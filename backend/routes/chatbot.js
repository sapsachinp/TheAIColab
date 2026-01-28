import express from 'express';
import { verifyToken } from './auth.js';
import unifiedBrain from '../ai/unifiedBrain.js';
import * as knowledgeGraph from '../ai/knowledgeGraph.js';
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

    // Check for existing tickets
    const ticketsPath = path.join(__dirname, '../../data/tickets.json');
    let customerTickets = [];
    try {
      const ticketsData = await fs.readFile(ticketsPath, 'utf-8');
      const allTickets = JSON.parse(ticketsData);
      customerTickets = allTickets.filter(t => t.customerId === customerId);
    } catch (err) {
      // No tickets file or error reading
      customerTickets = [];
    }

    // Check if query is about tracking or existing requests
    const isTrackingQuery = /track|status|view.*existing|view.*requests|show.*requests|1\.|option.*1|existing|تتبع|حالة|عرض.*الطلبات|١/i.test(query);
    const isSubmitQuery = /submit|create|new.*request|file.*complaint|lodge|register.*complaint|raise.*ticket|أريد.*تقديم|تسجيل.*شكوى|طلب.*جديد|أرسل.*طلب/i.test(query);
    const isForceNewRequest = /new.*anyway|submit.*anyway|2\.|option.*2|proceed|continue.*new|yes.*new|أريد.*جديد|متابعة.*جديد|نعم.*جديد|٢/i.test(query);
    
    let response;
    
    if (isTrackingQuery && customerTickets.length > 0 && !isSubmitQuery && !isForceNewRequest) {
      // Customer asking about their requests
      const openTickets = customerTickets.filter(t => t.status === 'Open');
      const recentTickets = customerTickets.slice(0, 3); // Get 3 most recent
      
      response = {
        message: await generateTicketStatusMessage(recentTickets, openTickets.length, language),
        intent: 'ticket_tracking',
        confidence: 0.95,
        sentiment: 'neutral',
        escalated: false,
        tickets: recentTickets,
        hasExistingTickets: true
      };
    } else if (isSubmitQuery || isForceNewRequest) {
      // Customer wants to submit a new request
      const openTickets = customerTickets.filter(t => t.status === 'Open');
      
      if (openTickets.length > 0 && !isForceNewRequest) {
        // Inform about existing tickets first
        response = {
          message: language === 'ar'
            ? `لديك ${openTickets.length} طلب نشط حالياً. هل تريد:\n1. عرض طلباتك الحالية\n2. تقديم طلب جديد على أي حال`
            : `You have ${openTickets.length} active request(s). Would you like to:\n1. View your existing requests\n2. Submit a new request anyway`,
          intent: 'new_request_with_existing',
          confidence: 0.9,
          sentiment: 'neutral',
          escalated: false,
          hasExistingTickets: true,
          tickets: openTickets.slice(0, 2),
          canSubmitNew: true
        };
      } else {
        // No existing tickets OR customer chose to submit anyway
        response = {
          message: language === 'ar'
            ? 'بالتأكيد! يمكنني مساعدتك في تقديم طلب جديد. الرجاء اختيار نوع الطلب:'
            : 'Sure! I can help you submit a new request. Please select the request type:',
          intent: 'new_request',
          confidence: 0.95,
          sentiment: 'positive',
          escalated: false,
          promptRequestForm: true
        };
      }
    } else if (customerTickets.length > 0) {
      // Customer has tickets but didn't explicitly ask - add to context
      const openTickets = customerTickets.filter(t => t.status === 'Open');
      
      // Process query through Unified Brain with ticket context
      response = await unifiedBrain.processQuery({
        customer: {
          ...customer,
          activeTickets: openTickets.length,
          recentTickets: customerTickets.slice(0, 2)
        },
        query,
        channel: channel || 'web',
        language: language || 'en'
      });
      
      // Add ticket info to response
      if (openTickets.length > 0) {
        response.existingTicketsNote = language === 'ar' 
          ? `ملاحظة: لديك ${openTickets.length} طلب نشط. اكتب "تتبع الطلبات" للحصول على التفاصيل.`
          : `Note: You have ${openTickets.length} active request(s). Type "track requests" for details.`;
      }
    } else {
      // Process query through Unified Brain normally
      response = await unifiedBrain.processQuery({
        customer,
        query,
        channel: channel || 'web',
        language: language || 'en'
      });
    }

    // Log the interaction with enhanced data
    await logInteraction({
      customerId,
      query,
      response,
      channel: channel || 'web',
      language: language || 'en'
    });

    // Learn from this interaction (Knowledge Graph)
    await knowledgeGraph.learnFromInteraction({
      intent: response.intent,
      query,
      resolved: !response.escalated,
      confidence: response.confidence,
      humanOverride: false,
      escalated: response.escalated
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
 * Generate ticket status message
 */
async function generateTicketStatusMessage(tickets, openCount, language) {
  const isArabic = language === 'ar';
  
  if (tickets.length === 0) {
    return isArabic 
      ? 'ليس لديك أي طلبات مسجلة حالياً.'
      : 'You don\'t have any registered requests at the moment.';
  }

  let message = isArabic
    ? `لديك ${openCount} طلب نشط. إليك طلباتك الأخيرة:\n\n`
    : `You have ${openCount} active request(s). Here are your recent requests:\n\n`;

  tickets.forEach((ticket, idx) => {
    const date = new Date(ticket.createdAt).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US');
    const typeLabel = formatRequestType(ticket.requestType, isArabic);
    
    message += isArabic
      ? `${idx + 1}. رقم الطلب: ${ticket.ticketId}\n   النوع: ${typeLabel}\n   الحالة: ${ticket.status}\n   الأولوية: ${ticket.priority}\n   التاريخ: ${date}\n\n`
      : `${idx + 1}. Ticket #${ticket.ticketId}\n   Type: ${typeLabel}\n   Status: ${ticket.status}\n   Priority: ${ticket.priority}\n   Date: ${date}\n\n`;
  });

  message += isArabic
    ? 'يمكنك أن تسألني عن أي طلب محدد للحصول على مزيد من التفاصيل.'
    : 'You can ask me about any specific ticket for more details.';

  return message;
}

/**
 * Format request type for display
 */
function formatRequestType(type, isArabic) {
  const types = {
    billing_inquiry: { en: 'Billing Inquiry', ar: 'استفسار عن الفاتورة' },
    service_outage: { en: 'Service Outage', ar: 'انقطاع الخدمة' },
    meter_reading: { en: 'Meter Reading', ar: 'قراءة العداد' },
    payment: { en: 'Payment Issue', ar: 'مشكلة في الدفع' },
    connection_request: { en: 'New Connection', ar: 'توصيل جديد' },
    complaint: { en: 'General Complaint', ar: 'شكوى عامة' }
  };
  
  return types[type]?.[isArabic ? 'ar' : 'en'] || type;
}

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
      sentiment: data.response.sentiment || 'neutral',
      emotion: data.response.emotion || 'neutral',
      urgency: data.response.urgency || 'medium',
      customerSatisfaction: data.response.satisfactionScore || 3,
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
