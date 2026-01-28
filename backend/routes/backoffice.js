import express from 'express';
import { verifyToken } from './auth.js';
import * as sentimentAnalysis from '../ai/sentimentAnalysis.js';
import * as knowledgeGraph from '../ai/knowledgeGraph.js';
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

    // Load existing tickets
    const ticketsPath = path.join(__dirname, '../../data/tickets.json');
    let tickets = [];
    try {
      const ticketsData = await fs.readFile(ticketsPath, 'utf-8');
      tickets = JSON.parse(ticketsData);
    } catch (err) {
      // File doesn't exist or is empty, start with empty array
      tickets = [];
    }

    // Create ticket with unique ID
    const ticket = {
      ticketId: `DEWA-${Date.now()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      customerId,
      requestType,
      requestDetails,
      aiGuidance,
      status: 'Open',
      priority: determinePriority(requestType, aiGuidance),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiRecommendations: aiGuidance?.recommendations || [],
      channel: 'web',
      assignedTo: null,
      notes: [],
      statusHistory: [
        {
          status: 'Open',
          timestamp: new Date().toISOString(),
          note: 'Ticket created via web portal'
        }
      ]
    };

    // Add ticket to array
    tickets.push(ticket);

    // Save tickets to file
    await fs.writeFile(ticketsPath, JSON.stringify(tickets, null, 2), 'utf-8');

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
 * GET /api/backoffice/tickets/:customerId
 * Get all tickets for a customer
 */
router.get('/tickets/:customerId', verifyToken, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query;

    const ticketsPath = path.join(__dirname, '../../data/tickets.json');
    const ticketsData = await fs.readFile(ticketsPath, 'utf-8');
    let tickets = JSON.parse(ticketsData);

    // Filter by customer ID
    tickets = tickets.filter(t => t.customerId === customerId);

    // Filter by status if provided
    if (status) {
      tickets = tickets.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    // Sort by creation date (newest first)
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      tickets,
      count: tickets.length
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      error: 'Failed to fetch tickets',
      tickets: [],
      count: 0
    });
  }
});

/**
 * GET /api/backoffice/ticket/:ticketId
 * Get details of a specific ticket
 */
router.get('/ticket/:ticketId', verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticketsPath = path.join(__dirname, '../../data/tickets.json');
    const ticketsData = await fs.readFile(ticketsPath, 'utf-8');
    const tickets = JSON.parse(ticketsData);

    const ticket = tickets.find(t => t.ticketId === ticketId);

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      error: 'Failed to fetch ticket'
    });
  }
});

/**
 * GET /api/backoffice/analytics
 * Get analytics metrics for dashboard with enhanced KPIs
 */
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const logsData = await fs.readFile(
      path.join(__dirname, '../../data/ai-logs.json'),
      'utf-8'
    );
    const logs = JSON.parse(logsData);

    // Calculate basic metrics
    const totalInteractions = logs.length;
    const resolvedCount = logs.filter(log => log.resolved).length;
    const deflectedCount = logs.filter(log => log.ticketDeflected).length;
    const escalatedCount = logs.filter(log => log.escalated).length;
    
    const fcrRate = totalInteractions > 0 ? (resolvedCount / totalInteractions * 100).toFixed(2) : 0;
    const deflectionRate = totalInteractions > 0 ? (deflectedCount / totalInteractions * 100).toFixed(2) : 0;
    const escalationRate = totalInteractions > 0 ? (escalatedCount / totalInteractions * 100).toFixed(2) : 0;

    // Average satisfaction
    const satisfactionScores = logs.filter(log => log.customerSatisfaction).map(log => log.customerSatisfaction);
    const avgSatisfaction = satisfactionScores.length > 0
      ? (satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length).toFixed(2)
      : 0;

    // Average Handling Time (AHT) - NEW KPI
    const resolutionTimes = logs.filter(log => log.resolutionTime).map(log => log.resolutionTime);
    const avgHandlingTime = resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
      : 0;

    // Sentiment Score - NEW KPI
    const sentimentScores = logs.filter(log => log.sentiment);
    const positiveSentiment = sentimentScores.filter(log => log.sentiment === 'positive').length;
    const negativeSentiment = sentimentScores.filter(log => log.sentiment === 'negative').length;
    const sentimentScore = sentimentScores.length > 0
      ? ((positiveSentiment - negativeSentiment) / sentimentScores.length * 50 + 50).toFixed(2)
      : 50;

    // AI Accuracy - NEW KPI (based on confidence and no human override)
    const accurateInteractions = logs.filter(log => 
      log.confidenceScore >= 0.7 && !log.humanOverride
    ).length;
    const aiAccuracy = totalInteractions > 0
      ? (accurateInteractions / totalInteractions * 100).toFixed(2)
      : 0;

    // Sentiment trend analysis
    const sentimentTrend = sentimentAnalysis.analyzeSentimentTrend(logs);

    // Knowledge graph statistics
    const knowledgeStats = knowledgeGraph.getKnowledgeGraphStats();

    // Cost per interaction estimation (assuming $5 for human, $0.10 for AI)
    const aiInteractions = totalInteractions - escalatedCount;
    const estimatedCost = (escalatedCount * 5) + (aiInteractions * 0.1);
    const costPerInteraction = totalInteractions > 0
      ? (estimatedCost / totalInteractions).toFixed(2)
      : 0;

    // DEWA Savings Calculations
    const costPerHumanCall = 25; // AED per call handled by human agent
    const costPerAICall = 0.50;  // AED per AI-handled interaction
    const deflectedCalls = deflectedCount + resolvedCount; // Calls handled by AI without escalation
    
    // Savings breakdown
    const traditionalCost = totalInteractions * costPerHumanCall; // What it would cost without AI
    const actualCost = (escalatedCount * costPerHumanCall) + (aiInteractions * costPerAICall);
    const totalSavings = traditionalCost - actualCost;
    const savingsPercentage = traditionalCost > 0 
      ? ((totalSavings / traditionalCost) * 100).toFixed(2)
      : 0;
    
    // Monthly projection (assuming current data represents a week)
    const projectedMonthlySavings = totalSavings * 4;
    const projectedYearlySavings = totalSavings * 52;
    
    // Agent productivity metrics
    const avgCallsPerAgentPerDay = 40; // Industry average
    const equivalentAgentsSaved = deflectedCalls > 0
      ? (deflectedCalls / avgCallsPerAgentPerDay).toFixed(2)
      : 0;

    // Digital channel adoption (assuming all current logs are digital)
    const digitalAdoption = 100; // Placeholder - would need total transaction data

    res.json({
      success: true,
      metrics: {
        // Core KPIs
        totalInteractions,
        fcrRate: parseFloat(fcrRate),
        deflectionRate: parseFloat(deflectionRate),
        avgSatisfaction: parseFloat(avgSatisfaction),
        
        // Enhanced KPIs
        avgHandlingTime,              // NEW: Average handling time in seconds
        sentimentScore: parseFloat(sentimentScore),  // NEW: Sentiment score 0-100
        aiAccuracy: parseFloat(aiAccuracy),          // NEW: AI accuracy percentage
        escalationRate: parseFloat(escalationRate),  // NEW: Escalation rate
        costPerInteraction: parseFloat(costPerInteraction),  // NEW: Cost per interaction
        digitalAdoption,              // NEW: Digital channel adoption
        
        // DEWA Savings Metrics
        savings: {
          totalSavings: parseFloat(totalSavings.toFixed(2)),
          savingsPercentage: parseFloat(savingsPercentage),
          projectedMonthlySavings: parseFloat(projectedMonthlySavings.toFixed(2)),
          projectedYearlySavings: parseFloat(projectedYearlySavings.toFixed(2)),
          deflectedCalls,
          escalatedCalls: escalatedCount,
          traditionalCost: parseFloat(traditionalCost.toFixed(2)),
          actualCost: parseFloat(actualCost.toFixed(2)),
          costPerHumanCall,
          costPerAICall,
          equivalentAgentsSaved: parseFloat(equivalentAgentsSaved)
        },
        
        // Counts
        resolvedCount,
        deflectedCount,
        escalatedCount,
        
        // Trends
        sentimentTrend,
        
        // Knowledge Graph insights
        knowledgeGraph: {
          topIntents: knowledgeStats.topIntents,
          needsAttention: knowledgeStats.needsAttention,
          totalIntents: knowledgeStats.totalIntents
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics'
    });
  }
});

function determinePriority(requestType, aiGuidance) {
  // Check AI guidance priority first
  if (aiGuidance?.priority) {
    return aiGuidance.priority.charAt(0).toUpperCase() + aiGuidance.priority.slice(1);
  }

  // Fallback to request type priority
  const highPriority = ['service_outage', 'emergency', 'safety'];
  const mediumPriority = ['billing_inquiry', 'billing_dispute', 'high_bill'];
  
  if (highPriority.includes(requestType)) return 'High';
  if (mediumPriority.includes(requestType)) return 'Medium';
  return 'Low';
}

export default router;
