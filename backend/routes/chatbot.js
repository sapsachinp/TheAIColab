import express from 'express';
import { verifyToken } from './auth.js';
import unifiedBrain from '../ai/unifiedBrain.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * POST /api/chatbot/query
 * Process chatbot queries with STT/TTS support
 */
router.post('/query', verifyToken, async (req, res) => {
  try {
    const { customerId, query, channel, language } = req.body;

    if (!customerId || !query) {
      return res.status(400).json({
        error: 'Customer ID and query are required'
      });
    }

    // Load customer data for context
    const customersData = await fs.readFile(
      path.join(__dirname, '../../data/customers.json'),
      'utf-8'
    );
    const customers = JSON.parse(customersData);
    const customer = customers.find(c => c.id === customerId);

    // Process query through Unified Brain
    const response = await unifiedBrain.processQuery({
      customer,
      query,
      channel: channel || 'web',
      language: language || 'en'
    });

    // Log the interaction
    await logInteraction({
      customerId,
      query,
      response,
      channel: channel || 'web'
    });

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({
      error: 'Failed to process query'
    });
  }
});

/**
 * Helper function to log AI interactions
 */
async function logInteraction(data) {
  try {
    const logPath = path.join(__dirname, '../../data/ai-logs.json');
    const logsData = await fs.readFile(logPath, 'utf-8');
    const logs = JSON.parse(logsData);

    const newLog = {
      id: `LOG${String(logs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      customerId: data.customerId,
      interactionType: 'Chat',
      channel: data.channel,
      query: data.query,
      intent: data.response.intent,
      aiResponse: data.response.message,
      confidenceScore: data.response.confidence,
      escalated: data.response.escalated || false,
      resolved: true,
      resolutionTime: data.response.resolutionTime || 60,
      humanOverride: false
    };

    logs.push(newLog);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error logging interaction:', error);
  }
}

export default router;
