import express from 'express';
import { verifyToken } from './auth.js';
import unifiedBrain from '../ai/unifiedBrain.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * POST /api/proactive/guidance
 * Provide proactive AI guidance before ticket submission
 */
router.post('/guidance', verifyToken, async (req, res) => {
  try {
    const { customerId, requestType, requestDetails } = req.body;

    if (!customerId || !requestType) {
      return res.status(400).json({
        error: 'Customer ID and request type are required'
      });
    }

    // Load customer data for context
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

    // Get proactive guidance from Unified Brain
    const guidance = await unifiedBrain.analyzeRequest({
      customer,
      requestType,
      requestDetails
    });

    res.json({
      success: true,
      guidance
    });
  } catch (error) {
    console.error('Error generating proactive guidance:', error);
    res.status(500).json({
      error: 'Failed to generate guidance'
    });
  }
});

export default router;
