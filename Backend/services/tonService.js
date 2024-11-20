const { TonClient } = require('@eversdk/core');
const { libNode } = require('@eversdk/lib-node');

TonClient.useBinaryLibrary(libNode);

// Initialize the TON client with the specified endpoint
const client = new TonClient({ 
    network: { 
        endpoints: ["https://mainnet.evercloud.dev/df4adb605c32403db6b75b7064cc1263/graphql"],
    },
    crypto: libNode
});

/**
 * Function to get account details by address
 * @param {string} address - The TON account address
 * @returns {Promise<Object>} - The account details
 */
async function getAccountDetails(address) {
    try {
        const account = await client.net.query({
            method: 'getAccount',
            params: { address },
            query : `
                query{
                    blockchain{
                    account(address:"UQAZNyw-9HlbaJlqkjK7z2Kr4x3yZTvmHGHpjUJFppSDkIzd"){
                        info{
                            address
                            acc_type
                            balance
                            last_paid
                            last_trans_lt
                            boc
                            data
                            code
                            library
                            data_hash
                            code_hash
                            library_hash
                        }
                    }
                    }
                }
            `,
        variables: {} 
        });
        return account;
    } catch (error) {
        throw new Error(`Failed to fetch account details: ${error.message}`);
    }
}

/**
 * Function to send a transaction
 * @param {string} fromAddress - The sender's address
 * @param {string} toAddress - The recipient's address
 * @param {number} amount - The amount to send (in nanotokens)
 * @returns {Promise<Object>} - Transaction result
 */
async function sendTransaction(fromAddress, toAddress, amount) {
    try {
        const transactionResult = await client.net.query({
            method: 'sendTransaction',
            params: {
                from: fromAddress,
                to: toAddress,
                amount,
            },
            query : `
                query{
                    blockchain{
                        transaction(hash:"b0e26c42164ec0137913fdcd754aa819323a6a4b9ef5188863b021c3801e7ae4"){
                        id
                        hash
                        balance_delta
                        aborted
                        lt
                        now
                    }
                    }
                }
            `,
        });
        return transactionResult;
    } catch (error) {
        throw new Error(`Transaction failed: ${error.message}`);
    }
}

async function receiveTransactions(walletAddress) {
    try {
        while (true) {
            const transactions = await client.net.query({
                collection: 'transactions',
                filter: {
                    account: { eq: walletAddress },
                },
                result: 'id, account, in_msg, out_msg',
                order: [{ path: 'lt', direction: 'desc' }],
                limit: 1,
                query : `
                query{
                    transactions(filter:{
                        in_msg:{
                        eq:"d158f7437080f6835792ac0ef9cccbcbd2874a63e8f7f1db9dcb97edc06f410d"
                        }
                    })
                    {
                        id
                        account_addr
                        balance_delta(format:DEC)
                        now
                        now_string
                    }
                }
            `,
            });

            if (transactions.length > 0) {
                const tx = transactions[0];
                console.log('Transaction received:', JSON.stringify(tx, null, 2));
            }
            transactions.forEach(tx => {
                console.log(`Transaction ID: ${tx.id}, Timestamp: ${tx.created_at}`);
            });
            // Wait before checking for new transactions
            await new Promise(resolve => setTimeout(resolve, 5000));
            return transactions;
        }
    } catch (error) {
        console.error('Error while monitoring transactions:', error);
    }
}

// Export the functions to be used in other parts of the application
module.exports = { getAccountDetails, sendTransaction,receiveTransactions };