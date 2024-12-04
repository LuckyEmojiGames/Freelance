// src/routes/api.js
const express = require('express');
// const tonService = require('../services/tonService');
const router = express.Router();

// Route to get account details
router.get('/account/:address', async (req, res) => {
    const { address } = req.params;
    try {
        const accountDetails = await tonService.getAccountDetails(address);
        res.json(accountDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to send a transaction
router.post('/transaction', async (req, res) => {
    const { fromAddress, toAddress, amount } = req.body;
    try {
        const result = await tonService.sendTransaction(fromAddress, toAddress, amount);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router;