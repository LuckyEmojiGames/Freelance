// tonService.js
const {TonClient} = require("@eversdk/core");
const {libNode} = require("@eversdk/lib-node");

TonClient.useBinaryLibrary(libNode);

// Initialize the TON client with necessary configurations
const client = new TonClient({ 
    network: { 
        endpoints: ['net.ton.dev'] // Change to mainnet when ready
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
            query : { "limit": 10, "offset": 0 }
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
        // Implement transaction logic here, including creating the transaction, signing it, etc.
        // This is a placeholder for transaction logic; implement as needed.
        const transactionResult = await client.net.query({
            method: 'sendTransaction',
            params: {
                from: fromAddress,
                to: toAddress,
                amount,
            },
        });
        return transactionResult;
    } catch (error) {
        throw new Error(`Transaction failed: ${error.message}`);
    }
}

// Export the functions to be used in other parts of the application
module.exports = { getAccountDetails, sendTransaction };