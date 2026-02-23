import OpenAI from 'openai';
import dotenv from 'dotenv';
import intentDetection from './intentDetection.js';
import empathyResponse from './empathyResponse.js';
import proactiveAdvisor from './proactiveAdvisor.js';
import billPredictor from './billPredictor.js';
import * as sentimentAnalysis from './sentimentAnalysis.js';
import * as knowledgeGraph from './knowledgeGraph.js';

// Load env first before any client initialization
dotenv.config();

/**
 * Lazily create and cache the OpenAI client so it always uses
 * the env values that were loaded by dotenv.config()
 */
let _openaiClient = null;
function getOpenAIClient() {
  if (!_openaiClient) {
    _openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'demo-key',
      baseURL: process.env.OPENAI_BASE_URL || undefined
    });
  }
  return _openaiClient;
}

function isOpenAIEnabled() {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key';
}

function getModel() {
  return process.env.OPENAI_MODEL || 'gpt-5';
}

/**
 * Unified AI Brain - Central orchestration layer
 * Coordinates all AI modules: intent, empathy, proactive, prediction
 */
class UnifiedBrain {
  /**
   * Get AI-powered customer insights
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>} AI insights
   */
  async getCustomerInsights(customer) {
    try {
      // Analyze consumption first
      const consumptionAnalysis = await this.analyzeConsumption(customer);
      
      // Use OpenAI to generate intelligent predictions and insights
      let aiPredictions = null;
      if (isOpenAIEnabled()) {
        try {
          console.log('🔄 Calling OpenAI API for customer insights analysis...');
          const prompt = `Analyze this DEWA customer's energy consumption data and provide insights:

Customer: ${customer.name}
Last Bill: AED ${customer.lastBill}
Consumption History (last 8 months): ${JSON.stringify(customer.consumptionHistory)}
Usage Pattern: ${customer.usagePatterns?.highConsumptionReason || 'Normal usage'}
Peak Hours: ${customer.usagePatterns?.peakHours || 'N/A'}
Compared to Similar: ${customer.usagePatterns?.comparedToSimilar || 'N/A'}

Current Trend: ${consumptionAnalysis.trend}
Variance: ${consumptionAnalysis.variance}%

Please provide:
1. Next bill prediction with confidence level (0-1)
2. Consumption trend explanation
3. 3 personalized energy-saving recommendations
4. Risk assessment (low/medium/high) for bill shock

Respond ONLY with valid JSON (no markdown, no code fences). Use these exact keys: predictedBill (number), confidence (number 0-1), trendExplanation (string), recommendations (array of strings), riskLevel (string: low/medium/high)`;

          const completion = await getOpenAIClient().chat.completions.create({
            model: getModel(),
            messages: [
              {
                role: "system",
                content: "You are an AI energy analyst for DEWA (Dubai Electricity & Water Authority). Provide accurate, data-driven insights. Always respond with valid JSON only."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 600
          });

          const aiResponse = completion.choices[0].message.content.trim();
          // Strip markdown code fences if present
          const cleanResponse = aiResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
          try {
            aiPredictions = JSON.parse(cleanResponse);
            console.log('✅ Received real OpenAI insights:', {
              predictedBill: aiPredictions.predictedBill,
              confidence: aiPredictions.confidence,
              recommendations: aiPredictions.recommendations?.length || 0
            });
          } catch (parseError) {
            console.warn('⚠️  OpenAI response not valid JSON, parsing text:', parseError.message);
            // Try to extract data from text response
            aiPredictions = this.parseTextResponse(aiResponse);
          }
        } catch (openaiError) {
          console.error('❌ OpenAI API error:', openaiError.message || openaiError);
          console.log('⚠️  Will use local bill prediction instead of AI');
        }
      } else {
        console.log('⚠️  No OpenAI API key found, using local prediction instead of real AI');
      }

      // Use OpenAI predictions if available, otherwise use local bill predictor
      const billPrediction = aiPredictions?.predictedBill 
        ? {
            predicted: aiPredictions.predictedBill,
            confidence: aiPredictions.confidence || 0.85,
            trend: consumptionAnalysis.trend
          }
        : await billPredictor.predictNextBill(customer);

      // Generate recommendations using AI if available
      const recommendations = aiPredictions?.recommendations 
        ? aiPredictions.recommendations.map((rec, idx) => ({
            type: 'ai_generated',
            message: rec,
            priority: idx === 0 ? 'high' : 'medium'
          }))
        : this.generateRecommendations(customer, consumptionAnalysis);

      return {
        billPrediction,
        consumptionAnalysis: {
          ...consumptionAnalysis,
          trendExplanation: aiPredictions?.trendExplanation || null,
          riskLevel: aiPredictions?.riskLevel || 'low'
        },
        openComplaintsCount: customer.openComplaints.length,
        recommendations,
        aiPowered: !!aiPredictions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getCustomerInsights:', error);
      // Fallback to basic predictions
      return {
        error: 'Unable to generate insights',
        billPrediction: { 
          predicted: customer.predictedBill, 
          confidence: 0.75,
          trend: 'stable'
        },
        consumptionAnalysis: { trend: 'stable', variance: 0 },
        recommendations: [],
        aiPowered: false
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

      // Analyze customer data for context
      const consumptionAnalysis = await this.analyzeConsumption(customer);
      
      // Generate AI-powered insights using OpenAI if available
      let aiAnalysis = null;
      if (isOpenAIEnabled()) {
        try {
          const prompt = `Analyze this DEWA customer's support request and provide insights:

Customer Profile:
- Name: ${customer.name}
- Account: ${customer.accountNumber}
- Last Bill: AED ${customer.lastBill}
- Predicted Next Bill: AED ${customer.predictedBill}
- Open Complaints: ${customer.openComplaints.length}
- Consumption Trend: ${consumptionAnalysis.trend} (${consumptionAnalysis.variance}% variance)

Request Details:
- Type: ${requestType}
- Details: ${requestDetails || 'Not provided'}

Respond ONLY with valid JSON (no markdown, no code fences). Use these exact keys: situationAnalysis (string), rootCause (string), recommendations (array of 3 strings), priority (string: low/medium/high/urgent), customerImpact (string)`;

          const completion = await getOpenAIClient().chat.completions.create({
            model: getModel(),
            messages: [
              {
                role: "system",
                content: "You are an AI support analyst for DEWA helping customers understand their utility situation. Always respond with valid JSON only."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 700
          });

          const aiResponse = completion.choices[0].message.content.trim();
          const cleanResponse = aiResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
          try {
            aiAnalysis = JSON.parse(cleanResponse);
            console.log('✅ OpenAI analyzeRequest succeeded');
          } catch (parseError) {
            console.warn('⚠️  OpenAI response not valid JSON in analyzeRequest:', parseError.message);
            aiAnalysis = {
              situationAnalysis: aiResponse,
              rootCause: 'See analysis above',
              recommendations: [aiResponse],
              priority: 'medium',
              customerImpact: 'Medium'
            };
          }
        } catch (openaiError) {
          console.error('❌ OpenAI API error in analyzeRequest:', openaiError.message || openaiError);
        }
      }

      // Build customer data analysis
      const customerDataAnalysis = {
        billingSummary: {
          currentBill: customer.lastBill,
          predictedBill: customer.predictedBill,
          variance: ((customer.predictedBill - customer.lastBill) / customer.lastBill * 100).toFixed(1),
          trend: consumptionAnalysis.trend
        },
        consumptionInsights: {
          trend: consumptionAnalysis.trend,
          variance: consumptionAnalysis.variance,
          average: consumptionAnalysis.average,
          latest: consumptionAnalysis.latest,
          comparedToSimilar: customer.usagePatterns?.comparedToSimilar || 'N/A'
        },
        accountStatus: {
          openComplaints: customer.openComplaints.length,
          hasUnpaidBills: customer.unpaidBills > 0,
          unpaidAmount: customer.unpaidBills || 0
        },
        usagePatterns: {
          reason: customer.usagePatterns?.highConsumptionReason || 'Normal usage',
          peakHours: customer.usagePatterns?.peakHours || 'Not available'
        }
      };

      // Generate personalized recommendations
      const recommendations = aiAnalysis?.recommendations || this.generateRequestRecommendations(
        customer, 
        requestType, 
        consumptionAnalysis
      );

      return {
        intent,
        proactiveAdvice,
        customerDataAnalysis,
        situationAnalysis: aiAnalysis?.situationAnalysis || this.generateSituationAnalysis(customer, requestType, consumptionAnalysis),
        rootCause: aiAnalysis?.rootCause || null,
        recommendations,
        priority: aiAnalysis?.priority || this.calculatePriority(customer, requestType),
        customerImpact: aiAnalysis?.customerImpact || 'Medium',
        shouldProceed: proactiveAdvice.confidence < 0.7,
        aiPowered: !!aiAnalysis,
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
   * Generate situation analysis for customer
   */
  generateSituationAnalysis(customer, requestType, consumptionAnalysis) {
    let analysis = `${customer.name}, your account shows `;
    
    if (consumptionAnalysis.trend === 'increasing') {
      analysis += `an increasing consumption trend (${consumptionAnalysis.variance}% above average). `;
    } else if (consumptionAnalysis.trend === 'decreasing') {
      analysis += `a decreasing consumption trend (${Math.abs(consumptionAnalysis.variance)}% below average). `;
    } else {
      analysis += `stable consumption patterns. `;
    }

    if (requestType === 'billing_inquiry') {
      analysis += `Your last bill was AED ${customer.lastBill}, and based on current usage, the next bill is predicted to be AED ${customer.predictedBill}.`;
    } else if (requestType === 'service_outage') {
      analysis += `We're actively monitoring your service status and will keep you updated.`;
    } else {
      analysis += `We're here to help resolve your ${requestType.replace('_', ' ')}.`;
    }

    return analysis;
  }

  /**
   * Generate recommendations specific to the request
   */
  generateRequestRecommendations(customer, requestType, consumptionAnalysis) {
    const recommendations = [];

    if (requestType === 'billing_inquiry') {
      if (consumptionAnalysis.trend === 'increasing') {
        recommendations.push('Review your AC settings - reducing to 24°C can save up to 20% on bills');
        recommendations.push('Check for any new appliances or increased usage during peak hours (12 PM - 6 PM)');
        recommendations.push('Consider a home energy audit through DEWA\'s Green Program');
      } else {
        recommendations.push('Your consumption is stable - this bill variation might be due to seasonal changes');
        recommendations.push('Download the DEWA app to monitor real-time consumption');
        recommendations.push('Set up bill payment autopay to avoid late fees');
      }
    } else if (requestType === 'service_outage') {
      recommendations.push('Check if neighbors are affected - might be area-wide maintenance');
      recommendations.push('Reset your main circuit breaker as a first step');
      recommendations.push('Download the DEWA app for real-time outage notifications');
    } else if (requestType === 'meter_reading') {
      recommendations.push('Take photos of your meter readings for reference');
      recommendations.push('Submit meter readings through DEWA app by the 5th of each month');
      recommendations.push('Ensure meter is accessible for DEWA technicians');
    } else {
      recommendations.push('Keep your account number handy for faster service');
      recommendations.push('Use DEWA app or website for quick self-service options');
      recommendations.push('Check our FAQ section - many queries are resolved instantly');
    }

    return recommendations;
  }

  /**
   * Calculate request priority
   */
  calculatePriority(customer, requestType) {
    if (requestType === 'service_outage') return 'urgent';
    if (customer.openComplaints.length > 2) return 'high';
    if (customer.unpaidBills > 1000) return 'high';
    if (requestType === 'billing_inquiry' && customer.predictedBill > customer.lastBill * 1.5) return 'high';
    return 'medium';
  }

  /**
   * Process chatbot query with context awareness
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response with intent and message
   */
  async processQuery(params) {
    try {
      const { customer, query, channel, language } = params;

      // Parallel processing: intent detection, sentiment analysis, and context building
      const [intent, sentiment, contextSummary] = await Promise.all([
        intentDetection.classify('query', query),
        sentimentAnalysis.analyzeSentiment(query, language),
        this.buildContext(customer)
      ]);

      // Generate empathetic response
      const response = await empathyResponse.generate({
        query,
        intent: intent.category,
        context: contextSummary,
        language,
        sentiment: sentiment.sentiment,
        emotion: sentiment.primaryEmotion
      });

      // Determine if escalation is needed
      const shouldEscalate = (
        intent.confidence < 0.6 || 
        sentiment.shouldEscalate ||
        sentiment.urgency === 'critical'
      );

      return {
        message: response.message,
        intent: intent.category,
        confidence: intent.confidence,
        sentiment: sentiment.sentiment,
        emotion: sentiment.primaryEmotion,
        urgency: sentiment.urgency,
        satisfactionScore: sentiment.satisfactionScore,
        escalated: shouldEscalate,
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

  /**
   * Parse text response from OpenAI when JSON parsing fails
   * @param {string} text - OpenAI text response
   * @returns {Object} Parsed insights or empty object
   */
  parseTextResponse(text) {
    try {
      // Try to extract numbers that look like bills/amounts
      const billMatch = text.match(/(\d+\.?\d*)\s*(?:AED|aed|dhs)/);
      const confidenceMatch = text.match(/(?:confidence|confidence level)[:\s]*(?:\.)?(\d+\.?\d*)/i);
      
      return {
        predictedBill: billMatch ? parseFloat(billMatch[1]) : null,
        confidence: confidenceMatch ? Math.min(1, Math.max(0, parseFloat(confidenceMatch[1]))) : 0.7,
        trendExplanation: text,
        recommendations: [text],
        riskLevel: text.toLowerCase().includes('risk') ? 'high' : 'low',
        textBased: true
      };
    } catch (e) {
      console.warn('Unable to parse text response:', e.message);
      return {};
    }
  }

  /**
   * Explain request type with AI-powered insights
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Explanation object
   */
  async explainRequestType(params) {
    try {
      const { customer, requestType } = params;

      // Get consumption analysis for context
      const consumptionAnalysis = await this.analyzeConsumption(customer);

      // Define base explanations
      const baseExplanations = {
        billing_inquiry: {
          title: 'Understanding Your Bill',
          description: 'Billing inquiries typically arise from unexpected increases in consumption. We analyze your usage patterns, compare with historical data, and identify potential causes.',
          commonReasons: [
            'Seasonal changes (summer AC usage)',
            'New appliances or equipment',
            'Changes in occupancy or usage habits',
            'Possible meter reading errors'
          ],
          nextSteps: 'Our AI will review your consumption history and provide personalized insights.'
        },
        service_outage: {
          title: 'Service Disruption',
          description: 'Service outages require immediate attention. We check for planned maintenance, area-wide issues, and your account status to provide quick resolution.',
          commonReasons: [
            'Scheduled maintenance in your area',
            'Weather-related disruptions',
            'Equipment failure or overload',
            'Individual connection issues'
          ],
          nextSteps: 'We\'ll check current outage reports and prioritize your request accordingly.'
        },
        meter_reading: {
          title: 'Meter Reading Concerns',
          description: 'Meter reading issues can affect billing accuracy. We verify your meter data, check for anomalies, and ensure correct readings.',
          commonReasons: [
            'Meter accessibility issues',
            'Digital vs. analog reading differences',
            'Faulty meter equipment',
            'Timing of meter reading cycles'
          ],
          nextSteps: 'Our team will verify meter readings and schedule inspection if needed.'
        },
        payment: {
          title: 'Payment Processing',
          description: 'Payment problems can include failed transactions, duplicate charges, or account reconciliation issues.',
          commonReasons: [
            'Bank transaction delays',
            'Incorrect payment reference',
            'System processing time',
            'Outstanding balance confusion'
          ],
          nextSteps: 'We\'ll review your payment history and account status immediately.'
        },
        connection_request: {
          title: 'New Service Connection',
          description: 'New connection requests involve technical assessment, documentation verification, and scheduling installation.',
          commonReasons: [
            'New property or construction',
            'Service upgrade requirements',
            'Additional meter installation',
            'Temporary connection needs'
          ],
          nextSteps: 'Our team will guide you through documentation and schedule technical survey.'
        },
        complaint: {
          title: 'General Complaint',
          description: 'We take all complaints seriously and aim to resolve them promptly with appropriate escalation when needed.',
          commonReasons: [
            'Service quality concerns',
            'Staff interaction issues',
            'Delayed response times',
            'Policy or procedure questions'
          ],
          nextSteps: 'Your complaint will be logged and assigned to appropriate team for resolution.'
        }
      };

      const baseExplanation = baseExplanations[requestType] || {
        title: 'Request Information',
        description: 'We\'re here to help with your request.',
        commonReasons: [],
        nextSteps: 'Our support team will review your request and respond accordingly.'
      };

      // Try to enhance with OpenAI insights
      let aiInsights = null;
      if (isOpenAIEnabled()) {
        try {
          const prompt = `Generate a personalized insight for a DEWA customer selecting this request type:

Customer Profile:
- Name: ${customer.name}
- Last Bill: AED ${customer.lastBill}
- Predicted Next Bill: AED ${customer.predictedBill}
- Consumption Trend: ${consumptionAnalysis.trend} (${consumptionAnalysis.variance}% variance)
- Open Complaints: ${customer.openComplaints.length}

Request Type: ${requestType.replace('_', ' ')}

Provide a brief (2-3 sentences) personalized insight for THIS SPECIFIC CUSTOMER about why they might be experiencing this issue, based on their data. Be empathetic and actionable. Respond with plain text only, no JSON.`;

          const completion = await getOpenAIClient().chat.completions.create({
            model: getModel(),
            messages: [
              {
                role: "system",
                content: "You are a helpful DEWA customer support AI that provides personalized, empathetic insights."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 200
          });

          aiInsights = completion.choices[0].message.content.trim();
          console.log('✅ Generated personalized insight using OpenAI API');
        } catch (openaiError) {
          console.error('❌ OpenAI API error in explainRequestType:', openaiError.message || openaiError);
        }
      }

      // Return combined explanation
      return {
        ...baseExplanation,
        aiInsights,
        customerContext: {
          lastBill: customer.lastBill,
          predictedBill: customer.predictedBill,
          trend: consumptionAnalysis.trend,
          openComplaints: customer.openComplaints.length
        }
      };
    } catch (error) {
      console.error('Error in explainRequestType:', error);
      // Return basic explanation on error
      return {
        title: 'Request Information',
        description: 'We\'re processing your request type selection.',
        commonReasons: [],
        nextSteps: 'Please provide details to help us assist you better.'
      };
    }
  }
}

// Export singleton instance
export default new UnifiedBrain();
