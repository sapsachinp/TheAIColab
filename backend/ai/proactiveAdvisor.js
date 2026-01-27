import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Proactive Advisor Module
 * Provides guidance before ticket submission to reduce unnecessary tickets
 */
class ProactiveAdvisor {
  /**
   * Analyze request and provide proactive guidance
   * @param {Object} customer - Customer data
   * @param {string} requestType - Type of request
   * @param {string} requestDetails - Request details
   * @returns {Promise<Object>} Proactive guidance
   */
  async analyze(customer, requestType, requestDetails) {
    try {
      // Check for duplicate complaints
      const duplicateCheck = await this.checkDuplicates(customer, requestType);
      if (duplicateCheck.isDuplicate) {
        return {
          suggestion: duplicateCheck.message,
          confidence: 0.95,
          shouldDeflect: true,
          reason: 'duplicate_complaint',
          alternatives: duplicateCheck.alternatives
        };
      }

      // Check for known issues in area
      const areaIssue = await this.checkAreaIssues(customer, requestType);
      if (areaIssue.hasIssue) {
        return {
          suggestion: areaIssue.message,
          confidence: 0.90,
          shouldDeflect: true,
          reason: 'known_area_issue',
          eta: areaIssue.eta
        };
      }

      // Analyze bill-related requests
      if (requestType.toLowerCase().includes('bill') || requestType.toLowerCase().includes('billing')) {
        const billAnalysis = await this.analyzeBillRequest(customer, requestDetails);
        if (billAnalysis.canDeflect) {
          return {
            suggestion: billAnalysis.message,
            confidence: billAnalysis.confidence,
            shouldDeflect: true,
            reason: 'explainable_variance',
            insights: billAnalysis.insights
          };
        }
      }

      // No deflection needed
      return {
        suggestion: 'Your request will be processed. We\'ll assign it to the appropriate team.',
        confidence: 0.50,
        shouldDeflect: false,
        reason: 'needs_human_review'
      };
    } catch (error) {
      console.error('Proactive advisor error:', error);
      return {
        suggestion: 'Processing your request...',
        confidence: 0.30,
        shouldDeflect: false,
        reason: 'error'
      };
    }
  }

  /**
   * Check for duplicate complaints
   */
  async checkDuplicates(customer, requestType) {
    const openComplaints = customer.openComplaints || [];
    const type = requestType.toLowerCase();

    const duplicate = openComplaints.find(complaint => 
      complaint.subject.toLowerCase().includes(type) ||
      type.includes(complaint.subject.toLowerCase().split(' ')[0])
    );

    if (duplicate) {
      return {
        isDuplicate: true,
        message: `You already have an open complaint about this issue (Ticket ${duplicate.ticketId}). ` +
                 `Current status: ${duplicate.status}. Would you like to check its status instead of creating a new ticket?`,
        alternatives: [
          'Check existing ticket status',
          'Add details to existing ticket',
          'Request escalation'
        ]
      };
    }

    return { isDuplicate: false };
  }

  /**
   * Check for known issues in area
   */
  async checkAreaIssues(customer, requestType) {
    // Simulate area issue database
    const knownIssues = [
      {
        area: 'Downtown Dubai',
        type: 'service_outage',
        message: 'Planned maintenance in Downtown Dubai today from 10:00-14:00. Service will resume automatically.',
        eta: '14:00'
      },
      {
        area: 'Dubai Marina',
        type: 'service_outage',
        message: 'We\'re aware of a service interruption in Dubai Marina. Our team is working to resolve it.',
        eta: '16:00'
      }
    ];

    const customerArea = customer.address?.split(',')[0] || '';
    const type = requestType.toLowerCase();

    const issue = knownIssues.find(i => 
      customerArea.includes(i.area) && 
      (type.includes('outage') || type.includes('service'))
    );

    if (issue) {
      return {
        hasIssue: true,
        message: issue.message,
        eta: issue.eta
      };
    }

    return { hasIssue: false };
  }

  /**
   * Analyze bill-related requests
   */
  async analyzeBillRequest(customer, details) {
    const history = customer.consumptionHistory || [];
    if (history.length < 2) {
      return { canDeflect: false };
    }

    const amounts = history.map(h => h.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const latest = customer.lastBill;
    const variance = ((latest - avg) / avg * 100).toFixed(2);

    // If variance is explainable and customer has usage reason
    if (Math.abs(variance) > 15 && customer.usagePatterns?.highConsumptionReason) {
      return {
        canDeflect: true,
        confidence: 0.85,
        message: `Your bill increased by ${Math.abs(variance)}% due to ${customer.usagePatterns.highConsumptionReason}. ` +
                 `This is consistent with your usage pattern. Would you like energy-saving tips instead of filing a complaint?`,
        insights: [
          `Average bill: AED ${avg.toFixed(2)}`,
          `Current bill: AED ${latest}`,
          `Variance: ${variance}%`,
          `Reason: ${customer.usagePatterns.highConsumptionReason}`
        ]
      };
    }

    return { canDeflect: false };
  }
}

export default new ProactiveAdvisor();
