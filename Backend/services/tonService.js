const TonWeb = require('tonweb');
const { HttpClient, Api } = require('tonapi-sdk-js');
const fs = require('fs').promises;
const axios = require('axios');
const Transaction = require('../models/transaction');
const api = require('../utils/api');
const amqp = require('amqplib');
require('dotenv').config();
const vault = require('node-vault')({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ENDPOINT,
    token: process.env.VAULT_TOKEN
});

class TonService {
    constructor() {
        this.tonweb = new TonWeb(new TonWeb.HttpProvider(process.env.TONCENTER_API_URL, {
            apiKey: process.env.TONCENTER_API_KEY
        }));
        const httpClient = new HttpClient({
            baseUrl: process.env.TON_API_URL,
            baseApiParams: {
                headers: {
                    Authorization: `Bearer ${process.env.TON_API_KEY}`,
                    'Content-type': 'application/json'
                }
            }
        });
        this.tonApi = new Api(httpClient);
        this.cache = {}; 

        this.tokenAddresses = {};
        this.publicKey = null;
        this.privateKey = null;
        this.init();
    }

    async init() {
        try {
            const { publicKey, privateKey } = await this.getKeysFromVault();
            this.publicKey = TonWeb.utils.base64ToBytes(publicKey);
            this.privateKey = TonWeb.utils.base64ToBytes(privateKey);
            this.wallet = new TonWeb.Wallets.all.v4R2(this.tonweb.provider, {
                publicKey: this.publicKey,
                secretKey: this.privateKey
            });

            await this.updateTokenAddresses(process.env.WALLET_ADDRESS);
            this.tokenAddresses = JSON.parse(await fs.readFile('config/contracts.json', 'utf8'));
            console.log('Token addresses loaded successfully');

        } catch (error) {
            console.error('Error initializing:', error.message);
            process.exit(1); 
        }

        this.monitorWallet(process.env.WALLET_ADDRESS);
    }

    async getKeysFromVault() {
        try {
            const result = await vault.read(process.env.VAULT_PATH);
            return {
                publicKey: result.data.publicKey,
                privateKey: result.data.privateKey
            };
        } catch (error) {
            console.error('Error retrieving keys from Vault:', error.message);
            throw new Error('Failed to retrieve keys');
        }
    }

    async updateTokenAddresses(accountId) {
        try {
            const response = await this.tonApi.accounts.getAccountJettonsBalances(accountId);
            const balances = response.balances;

            const tokenAddresses = {};

            for (const balance of balances) {
                const { symbol } = balance.jetton;
                const walletAddress = balance.wallet_address.address;
                tokenAddresses[walletAddress] = symbol; 
            }

            await fs.writeFile('config/contracts.json', JSON.stringify(tokenAddresses, null, 2));
            console.log('Token addresses updated successfully.');
        } catch (error) {
            console.error('Error updating token addresses:', error.message);
            throw new Error(error.message);
        }
    }

    async monitorWallet(walletAddress) {
        setInterval(async () => {
            const transactions = await this.getTransactions(walletAddress);
            for (const tx of transactions) {
                if (tx && tx.hash && (tx.in_msg || tx.out_msgs)) {
                    await this.handleTransaction(tx);
                }
            }
        }, parseInt(process.env.CHECK_INTERVAL));

        setInterval(async () => {
            await this.sendPendingTransactionsToAPI();
        }, parseInt(process.env.CHECK_INTERVAL));

        setInterval(async () => {
            await this.checkAndUpdateTransactions();
        }, parseInt(process.env.UPDATE_INTERVAL));
    }

    async getTransactions(walletAddress) {
        try {
            const response = await this.tonApi.blockchain.getBlockchainAccountTransactions(walletAddress, { limit: parseInt(process.env.LIMIT) });
            return response.transactions;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }

    async handleTransaction(tx) {
        const txId = tx.hash;

        let from, to, amount, memo, token;

        if (tx.in_msg && tx.in_msg.source && this.tokenAddresses[tx.in_msg.source.address]) {
            token = this.tokenAddresses[tx.in_msg.source.address];
            from = tx.in_msg.decoded_body.sender || tx.in_msg.source.address;
            to = tx.in_msg.destination.address;
            amount = tx.in_msg.decoded_body.amount || tx.in_msg.value;
            memo = tx.in_msg.decoded_body.forward_payload?.value?.value?.text || '';
        } else if (tx.in_msg && tx.in_msg.source && !tx.in_msg.decoded_body?.forward_payload) {
            
            from = tx.in_msg.source?.address || '';
            to = tx.in_msg.destination?.address || '';
            amount = tx.in_msg.value;
            memo = tx.in_msg.decoded_body?.text || '';
            token = 'TON';
        } else if (tx.out_msgs && tx.out_msgs.length > 0) {
            let out_msg = tx.out_msgs[0];
            from = out_msg.source?.address || '';
            if (out_msg.decoded_op_name == 'jetton_transfer' && this.tokenAddresses[out_msg.destination.address]) {
                to = out_msg.decoded_body?.destination || '';
                amount = out_msg.decoded_body?.amount || '0';
                token = this.tokenAddresses[out_msg.destination.address];
                memo = out_msg.decoded_body?.forward_payload?.value?.value?.text || '-'
            } else if (out_msg.decoded_op_name != 'jetton_transfer') {
                to = out_msg.destination?.address || '';
                amount = out_msg.value;
                token = 'TON';
                memo = out_msg.decoded_body?.text || '-'
            } else {
                return;
            }
        } else {
            return;
        }

        try {
            const existingTx = await Transaction.findOne({ txId });

            if (existingTx) {
                
                if (!existingTx.success && existingTx.success !== tx.success) {
                    existingTx.success = tx.success;
                    existingTx.tx = tx;
                    existingTx.sentToAPI = false;
                    existingTx.lastChecked = new Date(); 
                    await existingTx.save();
                    await this.sendToAPI(existingTx);
                }
            } else {
                
                if (this.cache[txId]) {
                    console.log(`Transaction ${txId} is already being processed.`);
                    return;
                }

                this.cache[txId] = true; 

                const newTx = new Transaction({
                    txId,
                    from,
                    to,
                    value: amount,
                    token,
                    memo,
                    success: tx.success,
                    tx: tx,
                    sentToAPI: false,
                    lastChecked: new Date(), 
                    createdAt: new Date() 
                });

                await newTx.save();
                await this.sendToAPI(newTx);
            }
        } catch (error) {
            console.error(`Error processing transaction ${txId}:`, error.message);
        } finally {
            delete this.cache[txId]; 
        }
    }

    async sendToAPI(transaction) {
        try {
            const response = await api.sendTransaction({
                txId: transaction.txId,
                from: transaction.from,
                to: transaction.to,
                value: transaction.value,
                token: transaction.token,
                memo: transaction.memo,
                success: transaction.success,
                tx: transaction.tx 
            });
            if (response.status === 200) {
                transaction.sentToAPI = true;
                await transaction.save();
            }
        } catch (error) {
            console.error('Error sending transaction to API:', error.message);
        }
    }

    async sendPendingTransactionsToAPI() {
        const pendingTransactions = await Transaction.find({ sentToAPI: false });
        for (const tx of pendingTransactions) {
            await this.sendToAPI(tx);
        }
    }

    async checkAndUpdateTransactions() {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const transactions = await Transaction.find({
            success: false,
            lastChecked: { $lt: fiveMinutesAgo },
            createdAt: { $gt: oneHourAgo }
        }).sort({ lastChecked: 1 }).limit(1);

        for (const tx of transactions) {
            try {
                const tcDetail = await this.getTransactionInfoByHash(tx.txId);
                if (tcDetail && tcDetail.description && tcDetail.description.action && tcDetail.description.action.success) {
                    tx.success = true;
                }
                tx.lastChecked = new Date();
                await tx.save();
            } catch (error) {
                console.error(`Error updating transaction ${tx.txId}:`, error.message);
            }
        }
    }

    async sendTon(toAddress, amount, memo) {
        try {
            const secretKey = this.privateKey;

            let seqno = await this.wallet.methods.seqno().call();
            if (seqno === null || seqno === undefined) {
                seqno = 0;
            }

            const transfer = this.wallet.methods.transfer({
                secretKey: secretKey,
                toAddress: toAddress,
                amount: TonWeb.utils.toNano(amount),
                seqno: seqno,
                sendMode: 3,
                payload: memo
            });

            const result = await transfer.send();
            console.log('Transaction Result:', result);

            return { success: true, result };
        } catch (error) {
            console.error('Error sending transaction:', error.message);
            throw new Error(error.message);
        }
    }

    async sendToken(toAddress, tokenContractAddress, tokenAmount, memo) {
        try {
            const jettonWallet = new TonWeb.token.jetton.JettonWallet(this.tonweb, { address: tokenContractAddress });
            const senderPrivateKey = this.privateKey;

            let seqno = await this.wallet.methods.seqno().call();
            if (seqno === null || seqno === undefined) {
                seqno = 0;
            }

            const amount = TonWeb.utils.toNano(tokenAmount);
            const payload = await jettonWallet.createTransferBody({
                jettonAmount: amount,
                toAddress: new TonWeb.utils.Address(toAddress),
                forwardAmount: TonWeb.utils.toNano('0.01'),
                forwardPayload: new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode(memo)]),
                responseAddress: new TonWeb.utils.Address(process.env.WALLET_ADDRESS)
            });

            const result = await this.wallet.methods.transfer({
                secretKey: senderPrivateKey,
                toAddress: tokenContractAddress,
                amount: TonWeb.utils.toNano('0.05'), 
                seqno: seqno,
                payload: payload,
                sendMode: 3
            }).send();

            console.log('sendToken Transaction Result:', result);
            return { success: true, result };
        } catch (error) {
            console.error('Error sending token:', error.message);
            throw new Error(error.message);
        }
    }

    async createWallet() {
        try {
            const keyPair = TonWeb.utils.nacl.sign.keyPair();
            const publicKey = keyPair.publicKey;
            const secretKey = keyPair.secretKey;

            const wallet = new TonWeb.wallet.all.v4R2(this.tonweb.provider, {
                publicKey: publicKey
            });

            const walletAddress = await wallet.getAddress();

            return {
                publicKey: TonWeb.utils.bytesToBase64(publicKey),
                secretKey: TonWeb.utils.bytesToBase64(secretKey),
                address: walletAddress.toString(true, true, true)
            };
        } catch (error) {
            console.error('Error creating wallet:', error.message);
            throw new Error(error.message);
        }
    }

    async getTransactionInfoByHash(transactionHash) {
        try {
            const response = await axios.get(`https://toncenter.com/api/v3/adjacentTransactions`, {
                headers: {
                    'X-API-Key': process.env.TONCENTER_API_KEY
                },
                params: {
                    hash: transactionHash,
                    direction: 'both',
                    limit: 1,
                }
            });

            if (response.data.transactions && response.data.transactions.length > 0) {
                return response.data.transactions[0];
            } else {
                throw new Error('Transaction not found');
            }
        } catch (error) {
            console.error('Error fetching transaction info:', error);
            throw error;
        }
    }
}

module.exports = TonService;
