import express from 'express';
import { verifyToken } from './auth.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * POST /api/backoffice/submit-ticket
 * Submit ticket for back-office processing
 */
router.post('/submit-ticket', verifyToken, async (req, res) => {
  try {
    const { customerId, requestType, requestDetails, aiGuidance } = req.body;

    // Create ticket
    const ticket = {
      ticketId: `T${String(Math.floor(Math.random() * 9000) + 1000)}`,
      customerId,
      requestType,
      requestDetails,
      aiGuidance,
      status: 'Open',
      priority: determinePriority(requestType),
      createdAt: new Date().toISOString(),
      aiRecommendations: aiGuidance?.suggestions || []
    };

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Error submitting ticket:', error);
    res.status(500).json({
      error: 'Failed to submit ticket'
    });
  }
});

/**
 * GET /api/backoffice/analytics
 * Get analytics metrics for dashboard
 */
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const logsData = await fs.readFile(
      path.join(__dirname, '../../data/ai-logs.json'),
      'utf-8'
    );
    const logs = JSON.parse(logsData);

    // Calculate metrics
    const totalInteractions = logs.length;
    const resolvedCount = logs.filter(log => log.resolved).length;
    const deflectedCount = logs.filter(log => log.ticketDeflected).length;
    const fcrRate = totalInteractions > 0 ? (resolvedCount / totalInteractions * 100).toFixed(2) : 0;
    const deflectionRate = totalInteractions > 0 ? (deflectedCount / totalInteractions * 100).toFixed(2) : 0;

    // Average satisfaction
    const satisfactionScores = logs.filter(log => log.customerSatisfaction).map(log => log.customerSatisfaction);
    const avgSatisfaction = satisfactionScores.length > 0
      ? (satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      metrics: {
        totalInteractions,
        fcrRate: parseFloat(fcrRate),
        deflectionRate: parseFloat(deflectionRate),
        avgSatisfaction: parseFloat(avgSatisfaction),
        resolvedCount,
        deflectedCount
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics'
    });
  }
});

function determinePriority(requestType) {
  const highPriority = ['service_outage', 'emergency', 'safety'];
  const mediumPriority = ['billing_dispute', 'high_bill'];
  return highPriority.includes(requestType) ? 'High' : mediumPriority.includes(requestType) ? 'Medium' : 'Low';
}

export default router;
