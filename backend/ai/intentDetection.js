import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

/**
 * Intent Detection Module
 * Classifies customer queries and requests into categories
 */
class IntentDetection {
  constructor() {
    this.categories = [
      'billing_inquiry',
      'bill_inquiry', 
      'service_outage',
      'complaint',
      'advisory',
      'meter_reading',
      'payment',
      'connection_request',
      'unknown'
    ];
  }

  /**
   * Classify query intent using OpenAI
   * @param {string} type - Request type
   * @param {string} details - Request details
   * @returns {Promise<Object>} Intent classification
   */
  async classify(type, details) {
    try {
      // For demo: use rule-based classification as fallback
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return this.ruleBasedClassify(type, details);
      }

      const prompt = `Classify the following customer request into one of these categories: ${this.categories.join(', ')}.

Request Type: ${type}
Details: ${details}

Respond with JSON: {"category": "category_name", "confidence": 0.0-1.0, "reasoning": "brief explanation"}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an AI intent classifier for DEWA customer service.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        category: result.category,
        confidence: result.confidence,
        reasoning: result.reasoning
      };
    } catch (error) {
      console.error('Intent detection error:', error);
      return this.ruleBasedClassify(type, details);
    }
  }

  /**
   * Rule-based fallback classification
   */
  ruleBasedClassify(type, details) {
    const text = `${type} ${details}`.toLowerCase();

    if (text.includes('bill') || text.includes('payment') || text.includes('charge')) {
      return { category: 'billing_inquiry', confidence: 0.85, reasoning: 'Bill-related keywords detected' };
    }
    if (text.includes('outage') || text.includes('power') || text.includes('electricity')) {
      return { category: 'service_outage', confidence: 0.88, reasoning: 'Service outage keywords detected' };
    }
    if (text.includes('meter') || text.includes('reading')) {
      return { category: 'meter_reading', confidence: 0.82, reasoning: 'Meter-related keywords detected' };
    }
    if (text.includes('complaint') || text.includes('issue') || text.includes('problem')) {
      return { category: 'complaint', confidence: 0.80, reasoning: 'Complaint keywords detected' };
    }
    if (text.includes('how') || text.includes('advice') || text.includes('reduce') || text.includes('save')) {
      return { category: 'advisory', confidence: 0.75, reasoning: 'Advisory keywords detected' };
    }

    return { category: 'unknown', confidence: 0.50, reasoning: 'No clear pattern matched' };
  }
}

export default new IntentDetection();
