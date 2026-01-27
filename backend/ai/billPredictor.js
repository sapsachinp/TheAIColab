/**
 * Bill Predictor Module
 * Predicts next bill based on consumption patterns
 */
class BillPredictor {
  /**
   * Predict next bill amount
   * @param {Object} customer - Customer data
   * @returns {Promise<Object>} Bill prediction
   */
  async predictNextBill(customer) {
    try {
      const history = customer.consumptionHistory || [];
      
      if (history.length < 3) {
        return {
          predicted: customer.predictedBill || 0,
          confidence: 0.50,
          method: 'insufficient_data',
          trend: 'unknown'
        };
      }

      // Simple moving average with trend analysis
      const amounts = history.map(h => h.amount);
      const recent3 = amounts.slice(-3);
      const avg3 = recent3.reduce((a, b) => a + b, 0) / 3;
      
      // Calculate trend
      const trend = this.calculateTrend(amounts);
      
      // Apply trend multiplier
      let predicted = avg3 * (1 + trend);
      
      // Apply seasonal adjustment (UAE winter = higher AC usage)
      const currentMonth = new Date().getMonth();
      if (currentMonth >= 11 || currentMonth <= 2) { // Dec-Feb (winter)
        predicted *= 1.1; // 10% increase for heating
      } else if (currentMonth >= 5 && currentMonth <= 9) { // Jun-Sep (summer)
        predicted *= 1.15; // 15% increase for cooling
      }

      // Calculate confidence based on variance
      const variance = this.calculateVariance(amounts);
      const confidence = Math.max(0.6, Math.min(0.95, 1 - (variance / 100)));

      return {
        predicted: parseFloat(predicted.toFixed(2)),
        confidence: parseFloat(confidence.toFixed(2)),
        method: 'moving_average_with_trend',
        trend: trend > 0.05 ? 'increasing' : trend < -0.05 ? 'decreasing' : 'stable',
        breakdown: {
          baseAverage: parseFloat(avg3.toFixed(2)),
          trendAdjustment: parseFloat((trend * 100).toFixed(2)) + '%',
          seasonalFactor: this.getSeasonalFactor(currentMonth)
        }
      };
    } catch (error) {
      console.error('Bill prediction error:', error);
      return {
        predicted: customer.predictedBill || 0,
        confidence: 0.30,
        method: 'fallback',
        trend: 'unknown'
      };
    }
  }

  /**
   * Calculate consumption trend
   */
  calculateTrend(amounts) {
    if (amounts.length < 2) return 0;

    const recent = amounts.slice(-3);
    const older = amounts.slice(-6, -3);
    
    if (older.length === 0) return 0;

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    return (recentAvg - olderAvg) / olderAvg;
  }

  /**
   * Calculate variance in consumption
   */
  calculateVariance(amounts) {
    if (amounts.length < 2) return 0;

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const squareDiffs = amounts.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    return (stdDev / mean) * 100; // Coefficient of variation as percentage
  }

  /**
   * Get seasonal factor name
   */
  getSeasonalFactor(month) {
    if (month >= 11 || month <= 2) return 'winter_heating (+10%)';
    if (month >= 5 && month <= 9) return 'summer_cooling (+15%)';
    return 'moderate (±0%)';
  }
}

export default new BillPredictor();
