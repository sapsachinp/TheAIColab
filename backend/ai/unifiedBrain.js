import OpenAI from 'openai';
import dotenv from 'dotenv';
import intentDetection from './intentDetection.js';
import empathyResponse from './empathyResponse.js';
import proactiveAdvisor from './proactiveAdvisor.js';
import billPredictor from './billPredictor.js';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

/**
 * Unified AI Brain - Central orchestration layer
 * Coordinates all AI modules: intent, empathy, proactive, prediction
 */
class UnifiedBrain {
  constructor() {
    this.openai = openai;
  }

  /**
   * Get AI-powered customer insights
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>} AI insights
   */
  async getCustomerInsights(customer) {
    try {
      // Run prediction and analysis in parallel
      const [billPrediction, consumptionAnalysis] = await Promise.all([
        billPredictor.predictNextBill(customer),
        this.analyzeConsumption(customer)
      ]);

      return {
        billPrediction,
        consumptionAnalysis,
        openComplaintsCount: customer.openComplaints.length,
        recommendations: this.generateRecommendations(customer, consumptionAnalysis)
      };
    } catch (error) {
      console.error('Error in getCustomerInsights:', error);
      return {
        error: 'Unable to generate insights',
        billPrediction: { predicted: customer.predictedBill, confidence: 0 },
        consumptionAnalysis: { trend: 'stable' }
      };
    }
  }

  /**
   * Analyze customer request and provide proactive guidance
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Guidance response
   */
  async analyzeRequest(params) {
    try {
      const { customer, requestType, requestDetails } = params;

      // Detect intent and get proactive advice in parallel
      const [intent, proactiveAdvice] = await Promise.all([
        intentDetection.classify(requestType, requestDetails),
        proactiveAdvisor.analyze(customer, requestType, requestDetails)
      ]);

      return {
        intent,
        proactiveAdvice,
        shouldProceed: proactiveAdvice.confidence < 0.7, // Low confidence = proceed with ticket
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in analyzeRequest:', error);
      return {
        error: 'Unable to analyze request',
        shouldProceed: true
      };
    }
  }

  /**
   * Process chatbot query with context awareness
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response with intent and message
   */
  async processQuery(params) {
    try {
      const { customer, query, channel, language } = params;

      // Parallel processing: intent detection and context building
      const [intent, contextSummary] = await Promise.all([
        intentDetection.classify('query', query),
        this.buildContext(customer)
      ]);

      // Generate empathetic response
      const response = await empathyResponse.generate({
        query,
        intent: intent.category,
        context: contextSummary,
        language
      });

      return {
        message: response.message,
        intent: intent.category,
        confidence: intent.confidence,
        escalated: intent.confidence < 0.6,
        resolutionTime: this.estimateResolutionTime(intent.category),
        suggestions: response.suggestions || []
      };
    } catch (error) {
      console.error('Error in processQuery:', error);
      return {
        message: 'I apologize, I\'m having trouble processing your request. A support agent will assist you shortly.',
        intent: 'unknown',
        confidence: 0,
        escalated: true
      };
    }
  }

  /**
   * Analyze consumption patterns
   */
  async analyzeConsumption(customer) {
    const history = customer.consumptionHistory || [];
    if (history.length < 2) {
      return { trend: 'insufficient_data', variance: 0 };
    }

    const amounts = history.map(h => h.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const latest = amounts[amounts.length - 1];
    const variance = ((latest - avg) / avg * 100).toFixed(2);

    let trend = 'stable';
    if (variance > 10) trend = 'increasing';
    else if (variance < -10) trend = 'decreasing';

    return {
      trend,
      variance: parseFloat(variance),
      average: avg.toFixed(2),
      latest: latest.toFixed(2),
      reason: customer.usagePatterns?.highConsumptionReason || null
    };
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(customer, analysis) {
    const recommendations = [];

    if (analysis.trend === 'increasing' && analysis.variance > 15) {
      recommendations.push({
        type: 'energy_saving',
        message: 'Your consumption is 15% higher than average. Consider adjusting AC to 24°C.',
        priority: 'high'
      });
    }

    if (customer.openComplaints.length > 0) {
      recommendations.push({
        type: 'complaint_status',
        message: `You have ${customer.openComplaints.length} open complaint(s). Check status before creating new tickets.`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Build customer context summary
   */
  async buildContext(customer) {
    if (!customer) return 'No customer context available';

    return `Customer ${customer.name} (${customer.id}) has ${customer.openComplaints.length} open complaints. ` +
           `Last bill: AED ${customer.lastBill}, Predicted: AED ${customer.predictedBill}. ` +
           `Usage pattern: ${customer.usagePatterns?.highConsumptionReason || 'Normal'}.`;
  }

  /**
   * Estimate resolution time based on intent
   */
  estimateResolutionTime(intent) {
    const times = {
      billing_inquiry: 60,
      bill_inquiry: 45,
      service_outage: 30,
      advisory: 120,
      complaint: 90,
      unknown: 60
    };
    return times[intent] || 60;
  }
}

// Export singleton instance
export default new UnifiedBrain();
