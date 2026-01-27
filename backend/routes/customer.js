import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from './auth.js';
import unifiedBrain from '../ai/unifiedBrain.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * GET /api/customer/summary/:id
 * Fetch customer summary with AI-generated insights
 */
router.get('/summary/:id', verifyToken, async (req, res) => {
  try {
    const customerId = req.params.id;

    // Load customer data
    const customersData = await fs.readFile(
      path.join(__dirname, '../../data/customers.json'),
      'utf-8'
    );
    const customers = JSON.parse(customersData);
    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    // Get AI-powered insights from Unified Brain
    const aiInsights = await unifiedBrain.getCustomerInsights(customer);

    res.json({
      success: true,
      customer,
      aiInsights
    });
  } catch (error) {
    console.error('Error fetching customer summary:', error);
    res.status(500).json({
      error: 'Failed to fetch customer summary'
    });
  }
});

export default router;
