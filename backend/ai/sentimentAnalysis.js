/**
 * Sentiment Analysis Module
 * 
 * Analyzes customer messages to detect:
 * - Sentiment (Positive, Negative, Neutral)
 * - Emotion (Happy, Frustrated, Angry, Confused, Worried, Satisfied, etc.)
 * - Urgency Level (Low, Medium, High, Critical)
 * - Customer Satisfaction Score (1-5)
 * 
 * Used for:
 * - Real-time agent assist
 * - Quality management
 * - KPI tracking
 * - Proactive escalation
 */

import logger from '../config/logger.js';

// Sentiment keywords and phrases
const SENTIMENT_PATTERNS = {
  positive: {
    keywords: ['thank', 'thanks', 'grateful', 'appreciate', 'excellent', 'great', 'good', 'happy', 
               'satisfied', 'perfect', 'wonderful', 'amazing', 'love', 'helpful', 'resolved', 'شكرا', 
               'ممتاز', 'رائع', 'جيد', 'سعيد', 'راض'],
    weight: 1.0
  },
  negative: {
    keywords: ['bad', 'terrible', 'awful', 'worst', 'hate', 'angry', 'frustrated', 'disappointed', 
               'unhappy', 'unacceptable', 'poor', 'issue', 'problem', 'wrong', 'error', 'fail', 
               'سيء', 'رهيب', 'غاضب', 'محبط', 'مشكلة', 'خطأ', 'فشل'],
    weight: -1.0
  },
  urgent: {
    keywords: ['urgent', 'emergency', 'asap', 'immediately', 'critical', 'now', 'quickly', 'help', 
               'عاجل', 'طارئ', 'فورا', 'الآن', 'حرج'],
    weight: 1.5
  }
};

// Emotion detection patterns
const EMOTION_PATTERNS = {
  frustrated: ['frustrated', 'frustrating', 'annoyed', 'irritated', 'tired of', 'fed up', 'محبط', 'منزعج'],
  angry: ['angry', 'furious', 'outraged', 'mad', 'unacceptable', 'غاضب', 'غضبان'],
  confused: ['confused', 'don\'t understand', 'unclear', 'not sure', 'what', 'how', 'محتار', 'غير واضح'],
  worried: ['worried', 'concerned', 'anxious', 'afraid', 'scared', 'قلق', 'خائف'],
  happy: ['happy', 'glad', 'pleased', 'delighted', 'thrilled', 'سعيد', 'مسرور'],
  satisfied: ['satisfied', 'content', 'fine', 'okay', 'works', 'راض', 'جيد'],
  disappointed: ['disappointed', 'let down', 'expected more', 'expected better', 'محبط', 'خائب الأمل']
};

// Urgency indicators
const URGENCY_INDICATORS = {
  critical: ['emergency', 'urgent', 'asap', 'critical', 'no power', 'no water', 'leak', 'fire', 
             'عاجل', 'طارئ', 'حرج', 'تسريب'],
  high: ['soon', 'quickly', 'immediately', 'today', 'now', 'فورا', 'اليوم', 'الآن'],
  medium: ['when', 'schedule', 'appointment', 'متى', 'موعد'],
  low: ['whenever', 'no rush', 'eventually', 'عندما يمكن']
};

/**
 * Analyze sentiment of a text message
 * @param {string} text - The message to analyze
 * @param {string} language - Language code (en/ar)
 * @returns {Object} Sentiment analysis results
 */
async function analyzeSentiment(text, language = 'en') {
  try {
    if (!text || typeof text !== 'string') {
      return getDefaultSentiment();
    }

    const lowerText = text.toLowerCase();
    
    // Calculate sentiment score
    let sentimentScore = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    // Check positive keywords
    SENTIMENT_PATTERNS.positive.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        positiveCount++;
        sentimentScore += SENTIMENT_PATTERNS.positive.weight;
      }
    });

    // Check negative keywords
    SENTIMENT_PATTERNS.negative.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        negativeCount++;
        sentimentScore += SENTIMENT_PATTERNS.negative.weight;
      }
    });

    // Determine sentiment label
    let sentiment = 'neutral';
    if (sentimentScore > 0.5) sentiment = 'positive';
    else if (sentimentScore < -0.5) sentiment = 'negative';

    // Detect emotions
    const emotions = detectEmotions(lowerText);

    // Determine urgency
    const urgency = detectUrgency(lowerText);

    // Calculate confidence score (0-1)
    const totalMatches = positiveCount + negativeCount;
    const confidence = Math.min(totalMatches * 0.15 + 0.5, 1.0);

    // Estimate customer satisfaction (1-5)
    let satisfactionScore = 3; // Neutral default
    if (sentiment === 'positive') {
      satisfactionScore = 4 + (sentimentScore > 2 ? 1 : 0);
    } else if (sentiment === 'negative') {
      satisfactionScore = 2 - (sentimentScore < -2 ? 1 : 0);
    }

    // Determine if escalation is recommended
    const shouldEscalate = (
      sentiment === 'negative' && 
      (urgency === 'critical' || urgency === 'high') &&
      emotions.includes('angry')
    );

    logger.info('Sentiment analysis completed', {
      sentiment,
      emotions,
      urgency,
      satisfactionScore,
      shouldEscalate
    });

    return {
      sentiment,           // 'positive', 'negative', 'neutral'
      sentimentScore,      // Numerical score
      emotions,            // Array of detected emotions
      primaryEmotion: emotions[0] || 'neutral',
      urgency,             // 'critical', 'high', 'medium', 'low'
      satisfactionScore,   // 1-5
      confidence,          // 0-1
      shouldEscalate,      // boolean
      analysis: {
        positiveIndicators: positiveCount,
        negativeIndicators: negativeCount,
        wordCount: text.split(' ').length
      }
    };

  } catch (error) {
    logger.error('Error in sentiment analysis:', error);
    return getDefaultSentiment();
  }
}

/**
 * Detect emotions from text
 * @param {string} lowerText - Lowercase text
 * @returns {Array} List of detected emotions
 */
function detectEmotions(lowerText) {
  const detected = [];

  for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        detected.push(emotion);
        break;
      }
    }
  }

  return detected;
}

/**
 * Detect urgency level from text
 * @param {string} lowerText - Lowercase text
 * @returns {string} Urgency level
 */
function detectUrgency(lowerText) {
  // Check from highest to lowest priority
  for (const [level, indicators] of Object.entries(URGENCY_INDICATORS)) {
    for (const indicator of indicators) {
      if (lowerText.includes(indicator)) {
        return level;
      }
    }
  }

  return 'medium'; // Default
}

/**
 * Get default sentiment result
 * @returns {Object} Default sentiment
 */
function getDefaultSentiment() {
  return {
    sentiment: 'neutral',
    sentimentScore: 0,
    emotions: [],
    primaryEmotion: 'neutral',
    urgency: 'medium',
    satisfactionScore: 3,
    confidence: 0.5,
    shouldEscalate: false,
    analysis: {
      positiveIndicators: 0,
      negativeIndicators: 0,
      wordCount: 0
    }
  };
}

/**
 * Analyze sentiment trend over multiple interactions
 * @param {Array} interactions - Array of interaction objects with sentiment data
 * @returns {Object} Trend analysis
 */
function analyzeSentimentTrend(interactions) {
  if (!interactions || interactions.length === 0) {
    return {
      trend: 'stable',
      averageSatisfaction: 3,
      improvementRate: 0
    };
  }

  const satisfactionScores = interactions
    .map(i => i.customerSatisfaction || i.satisfactionScore || 3)
    .filter(score => score > 0);

  if (satisfactionScores.length === 0) {
    return {
      trend: 'stable',
      averageSatisfaction: 3,
      improvementRate: 0
    };
  }

  const avgSatisfaction = satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length;

  // Check if sentiment is improving or declining
  const recentScores = satisfactionScores.slice(-3);
  const olderScores = satisfactionScores.slice(0, -3);

  let trend = 'stable';
  if (recentScores.length >= 2 && olderScores.length >= 2) {
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    if (recentAvg > olderAvg + 0.5) trend = 'improving';
    else if (recentAvg < olderAvg - 0.5) trend = 'declining';
  }

  return {
    trend,
    averageSatisfaction: parseFloat(avgSatisfaction.toFixed(2)),
    improvementRate: recentScores.length >= 2 ? 
      (recentScores[recentScores.length - 1] - recentScores[0]) : 0
  };
}

export {
  analyzeSentiment,
  analyzeSentimentTrend,
  detectEmotions,
  detectUrgency
};
