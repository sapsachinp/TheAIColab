/**
 * Knowledge Graph Module
 * 
 * Builds and maintains a knowledge graph for:
 * - Intent-response patterns
 * - Customer behavior tracking
 * - Common issue identification
 * - AI learning and improvement
 * - Query resolution optimization
 * 
 * Foundation for continuous learning system
 */

import fs from 'fs/promises';
import path from 'path';
import logger from '../config/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_FILE = path.join(__dirname, '../../data/knowledge-graph.json');

// Initialize knowledge graph structure
let knowledgeGraph = {
  intents: {},           // Intent patterns and common queries
  resolutions: {},       // Successful resolution patterns
  escalations: {},       // Common escalation triggers
  customerPatterns: {},  // Customer behavior patterns
  queryVariations: {},   // Different ways customers ask same thing
  feedbackLoop: {        // Human corrections and improvements
    corrections: [],
    improvements: []
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    totalInteractions: 0,
    learningCycles: 0
  }
};

/**
 * Initialize the knowledge graph from file or create new
 */
async function initializeKnowledgeGraph() {
  try {
    const data = await fs.readFile(KNOWLEDGE_FILE, 'utf8');
    knowledgeGraph = JSON.parse(data);
    logger.info('Knowledge graph loaded successfully');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it
      await saveKnowledgeGraph();
      logger.info('New knowledge graph created');
    } else {
      logger.error('Error loading knowledge graph:', error);
    }
  }
}

/**
 * Save knowledge graph to file
 */
async function saveKnowledgeGraph() {
  try {
    knowledgeGraph.metadata.lastUpdated = new Date().toISOString();
    await fs.writeFile(KNOWLEDGE_FILE, JSON.stringify(knowledgeGraph, null, 2));
    logger.info('Knowledge graph saved successfully');
  } catch (error) {
    logger.error('Error saving knowledge graph:', error);
  }
}

/**
 * Learn from a successful interaction
 * @param {Object} interaction - Interaction data
 */
async function learnFromInteraction(interaction) {
  try {
    const { intent, query, resolved, confidence, humanOverride, escalated } = interaction;

    knowledgeGraph.metadata.totalInteractions++;

    // Track intent patterns
    if (!knowledgeGraph.intents[intent]) {
      knowledgeGraph.intents[intent] = {
        count: 0,
        successRate: 0,
        avgConfidence: 0,
        commonQueries: [],
        resolutionTime: []
      };
    }

    const intentData = knowledgeGraph.intents[intent];
    intentData.count++;
    
    // Update average confidence
    intentData.avgConfidence = (
      (intentData.avgConfidence * (intentData.count - 1) + confidence) / intentData.count
    );

    // Track common query variations
    addQueryVariation(intent, query);

    // Track successful resolutions
    if (resolved && !escalated) {
      if (!knowledgeGraph.resolutions[intent]) {
        knowledgeGraph.resolutions[intent] = {
          successfulPatterns: [],
          avgResolutionTime: 0,
          count: 0
        };
      }

      knowledgeGraph.resolutions[intent].count++;
      
      // Update success rate
      const totalIntentInteractions = intentData.count;
      const successfulResolutions = knowledgeGraph.resolutions[intent].count;
      intentData.successRate = (successfulResolutions / totalIntentInteractions) * 100;
    }

    // Track escalations
    if (escalated) {
      if (!knowledgeGraph.escalations[intent]) {
        knowledgeGraph.escalations[intent] = {
          count: 0,
          reasons: [],
          patterns: []
        };
      }

      knowledgeGraph.escalations[intent].count++;
      
      // Analyze why escalation happened
      if (confidence < 0.5) {
        addEscalationPattern(intent, 'low_confidence', query);
      }
    }

    // Track human overrides (AI was wrong)
    if (humanOverride) {
      knowledgeGraph.feedbackLoop.corrections.push({
        timestamp: new Date().toISOString(),
        intent,
        query,
        originalResponse: interaction.aiResponse,
        confidence
      });

      // Limit corrections array to last 100
      if (knowledgeGraph.feedbackLoop.corrections.length > 100) {
        knowledgeGraph.feedbackLoop.corrections = 
          knowledgeGraph.feedbackLoop.corrections.slice(-100);
      }
    }

    // Save every 10 interactions
    if (knowledgeGraph.metadata.totalInteractions % 10 === 0) {
      await saveKnowledgeGraph();
    }

  } catch (error) {
    logger.error('Error learning from interaction:', error);
  }
}

/**
 * Add query variation to track different phrasings
 * @param {string} intent - Intent category
 * @param {string} query - User query
 */
function addQueryVariation(intent, query) {
  if (!knowledgeGraph.queryVariations[intent]) {
    knowledgeGraph.queryVariations[intent] = [];
  }

  // Normalize query (lowercase, trim)
  const normalizedQuery = query.toLowerCase().trim();

  // Check if similar query already exists
  const exists = knowledgeGraph.queryVariations[intent].some(
    v => v.query === normalizedQuery
  );

  if (!exists) {
    knowledgeGraph.queryVariations[intent].push({
      query: normalizedQuery,
      count: 1,
      firstSeen: new Date().toISOString()
    });

    // Limit to 50 most common variations per intent
    if (knowledgeGraph.queryVariations[intent].length > 50) {
      knowledgeGraph.queryVariations[intent].sort((a, b) => b.count - a.count);
      knowledgeGraph.queryVariations[intent] = 
        knowledgeGraph.queryVariations[intent].slice(0, 50);
    }
  } else {
    // Increment count for existing variation
    const variation = knowledgeGraph.queryVariations[intent].find(
      v => v.query === normalizedQuery
    );
    if (variation) variation.count++;
  }
}

/**
 * Add escalation pattern for analysis
 * @param {string} intent - Intent category
 * @param {string} reason - Escalation reason
 * @param {string} query - User query
 */
function addEscalationPattern(intent, reason, query) {
  const pattern = {
    reason,
    query: query.substring(0, 100), // Truncate long queries
    timestamp: new Date().toISOString()
  };

  knowledgeGraph.escalations[intent].patterns.push(pattern);

  // Keep only last 20 patterns per intent
  if (knowledgeGraph.escalations[intent].patterns.length > 20) {
    knowledgeGraph.escalations[intent].patterns = 
      knowledgeGraph.escalations[intent].patterns.slice(-20);
  }
}

/**
 * Get intent insights for a specific intent
 * @param {string} intent - Intent category
 * @returns {Object} Intent insights
 */
function getIntentInsights(intent) {
  const intentData = knowledgeGraph.intents[intent];
  const resolutionData = knowledgeGraph.resolutions[intent];
  const escalationData = knowledgeGraph.escalations[intent];

  if (!intentData) {
    return {
      exists: false,
      message: 'No data available for this intent'
    };
  }

  return {
    exists: true,
    totalInteractions: intentData.count,
    successRate: intentData.successRate.toFixed(2) + '%',
    averageConfidence: (intentData.avgConfidence * 100).toFixed(2) + '%',
    commonQueries: knowledgeGraph.queryVariations[intent]?.slice(0, 5) || [],
    escalationRate: escalationData ? 
      ((escalationData.count / intentData.count) * 100).toFixed(2) + '%' : '0%',
    recommendations: generateRecommendations(intent, intentData, escalationData)
  };
}

/**
 * Generate recommendations for improving AI performance
 * @param {string} intent - Intent category
 * @param {Object} intentData - Intent statistics
 * @param {Object} escalationData - Escalation statistics
 * @returns {Array} Recommendations
 */
function generateRecommendations(intent, intentData, escalationData) {
  const recommendations = [];

  // Low success rate
  if (intentData.successRate < 70) {
    recommendations.push({
      priority: 'high',
      issue: 'Low success rate',
      suggestion: 'Review response templates and add more context-specific guidance',
      metric: `${intentData.successRate.toFixed(1)}%`
    });
  }

  // Low confidence
  if (intentData.avgConfidence < 0.7) {
    recommendations.push({
      priority: 'medium',
      issue: 'Low confidence in intent detection',
      suggestion: 'Add more training examples or refine intent keywords',
      metric: `${(intentData.avgConfidence * 100).toFixed(1)}%`
    });
  }

  // High escalation rate
  if (escalationData && (escalationData.count / intentData.count) > 0.3) {
    recommendations.push({
      priority: 'high',
      issue: 'High escalation rate',
      suggestion: 'Analyze escalation patterns and improve AI responses or add human review triggers',
      metric: `${((escalationData.count / intentData.count) * 100).toFixed(1)}%`
    });
  }

  return recommendations;
}

/**
 * Get overall knowledge graph statistics
 * @returns {Object} Statistics
 */
function getKnowledgeGraphStats() {
  const totalIntents = Object.keys(knowledgeGraph.intents).length;
  const totalResolutions = Object.values(knowledgeGraph.resolutions)
    .reduce((sum, r) => sum + r.count, 0);
  const totalEscalations = Object.values(knowledgeGraph.escalations)
    .reduce((sum, e) => sum + e.count, 0);

  const avgSuccessRate = totalIntents > 0 ?
    Object.values(knowledgeGraph.intents)
      .reduce((sum, i) => sum + i.successRate, 0) / totalIntents : 0;

  return {
    totalInteractions: knowledgeGraph.metadata.totalInteractions,
    totalIntents,
    totalResolutions,
    totalEscalations,
    averageSuccessRate: avgSuccessRate.toFixed(2) + '%',
    escalationRate: knowledgeGraph.metadata.totalInteractions > 0 ?
      ((totalEscalations / knowledgeGraph.metadata.totalInteractions) * 100).toFixed(2) + '%' : '0%',
    lastUpdated: knowledgeGraph.metadata.lastUpdated,
    topIntents: getTopIntents(5),
    needsAttention: getIntentsNeedingAttention()
  };
}

/**
 * Get top intents by interaction count
 * @param {number} limit - Number of intents to return
 * @returns {Array} Top intents
 */
function getTopIntents(limit = 5) {
  return Object.entries(knowledgeGraph.intents)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([intent, data]) => ({
      intent,
      count: data.count,
      successRate: data.successRate.toFixed(1) + '%'
    }));
}

/**
 * Get intents that need attention (low success rate or high escalation)
 * @returns {Array} Intents needing attention
 */
function getIntentsNeedingAttention() {
  const needsAttention = [];

  Object.entries(knowledgeGraph.intents).forEach(([intent, data]) => {
    if (data.successRate < 70 || data.avgConfidence < 0.7) {
      needsAttention.push({
        intent,
        successRate: data.successRate.toFixed(1) + '%',
        avgConfidence: (data.avgConfidence * 100).toFixed(1) + '%',
        reason: data.successRate < 70 ? 'Low success rate' : 'Low confidence'
      });
    }
  });

  return needsAttention.slice(0, 5); // Top 5
}

/**
 * Find similar queries for a given query
 * @param {string} query - User query
 * @param {string} intent - Intent category (optional)
 * @returns {Array} Similar queries
 */
function findSimilarQueries(query, intent = null) {
  const normalizedQuery = query.toLowerCase().trim();
  const similar = [];

  const intentsToSearch = intent ? 
    { [intent]: knowledgeGraph.queryVariations[intent] } : 
    knowledgeGraph.queryVariations;

  Object.entries(intentsToSearch).forEach(([intentKey, variations]) => {
    if (!variations) return;

    variations.forEach(variation => {
      // Simple similarity check (could be enhanced with Levenshtein distance)
      const similarity = calculateSimilarity(normalizedQuery, variation.query);
      if (similarity > 0.6) {
        similar.push({
          intent: intentKey,
          query: variation.query,
          similarity: similarity.toFixed(2),
          count: variation.count
        });
      }
    });
  });

  return similar.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
}

/**
 * Calculate similarity between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score
 */
function calculateSimilarity(str1, str2) {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Initialize on module load
initializeKnowledgeGraph();

export {
  learnFromInteraction,
  getIntentInsights,
  getKnowledgeGraphStats,
  findSimilarQueries,
  saveKnowledgeGraph
};
