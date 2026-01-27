import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

/**
 * Empathy Response Module
 * Generates humanized, empathetic responses
 */
class EmpathyResponse {
  /**
   * Generate empathetic response
   * @param {Object} params - Response parameters
   * @returns {Promise<Object>} Empathetic response
   */
  async generate(params) {
    try {
      const { query, intent, context, language } = params;

      // For demo: use template-based responses as fallback
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return this.templateResponse(intent, context, language);
      }

      const systemPrompt = `You are a compassionate DEWA customer service AI assistant. Your responses should be:
1. Empathetic and understanding
2. Clear and concise
3. Action-oriented with specific next steps
4. Culturally appropriate for UAE/Dubai context
5. Bilingual (English/Arabic) when needed

Customer Context: ${context}`;

      const userPrompt = `Customer Query: "${query}"
Intent: ${intent}
Language: ${language || 'en'}

Provide a helpful, empathetic response.`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      const message = response.choices[0].message.content;

      return {
        message,
        suggestions: this.extractSuggestions(intent),
        tone: 'empathetic'
      };
    } catch (error) {
      console.error('Empathy response error:', error);
      return this.templateResponse(params.intent, params.context, params.language);
    }
  }

  /**
   * Template-based fallback responses
   */
  templateResponse(intent, context, language) {
    const templates = {
      billing_inquiry: {
        en: "I understand your concern about your bill. Let me help you understand the charges. Based on your usage history, I can see your consumption has increased recently. Would you like me to explain the specific charges or suggest ways to reduce your bill?",
        ar: "أتفهم قلقك بشأن فاتورتك. دعني أساعدك في فهم الرسوم. بناءً على سجل استهلاكك، أرى أن استهلاكك قد زاد مؤخرًا. هل تريد مني شرح الرسوم المحددة أو اقتراح طرق لتقليل فاتورتك؟"
      },
      service_outage: {
        en: "I apologize for the inconvenience caused by the service interruption. Let me check the status in your area right away. I'll provide you with an estimated restoration time and keep you updated.",
        ar: "أعتذر عن الإزعاج الناجم عن انقطاع الخدمة. دعني أتحقق من الحالة في منطقتك على الفور. سأزودك بوقت الاستعادة المقدر وأبقيك على اطلاع."
      },
      advisory: {
        en: "I'm happy to help you optimize your energy usage! Based on your consumption patterns, I have several personalized recommendations that could help you save on your bills.",
        ar: "يسعدني مساعدتك في تحسين استخدامك للطاقة! بناءً على أنماط استهلاكك، لدي العديد من التوصيات الشخصية التي يمكن أن تساعدك في توفير فواتيرك."
      },
      complaint: {
        en: "Thank you for bringing this to our attention. I sincerely apologize for any inconvenience. Let me review your account and help resolve this matter promptly.",
        ar: "شكرًا لك على لفت انتباهنا إلى هذا الأمر. أعتذر بصدق عن أي إزعاج. دعني أراجع حسابك وأساعد في حل هذا الأمر بسرعة."
      },
      unknown: {
        en: "Thank you for reaching out to DEWA. I'm here to help you with any questions or concerns. Could you please provide more details about what you need assistance with?",
        ar: "شكرًا لك على التواصل مع ديوا. أنا هنا لمساعدتك في أي أسئلة أو مخاوف. هل يمكنك تقديم المزيد من التفاصيل حول ما تحتاج المساعدة به؟"
      }
    };

    const lang = language === 'ar' ? 'ar' : 'en';
    const message = templates[intent]?.[lang] || templates.unknown[lang];

    return {
      message,
      suggestions: this.extractSuggestions(intent),
      tone: 'empathetic'
    };
  }

  /**
   * Extract actionable suggestions based on intent
   */
  extractSuggestions(intent) {
    const suggestions = {
      billing_inquiry: [
        'View detailed bill breakdown',
        'Compare with previous months',
        'Set up payment plan'
      ],
      service_outage: [
        'Check outage map',
        'Report new outage',
        'Get SMS updates'
      ],
      advisory: [
        'View energy-saving tips',
        'Schedule energy audit',
        'Compare usage with similar homes'
      ],
      complaint: [
        'Track complaint status',
        'Upload supporting documents',
        'Request callback'
      ]
    };

    return suggestions[intent] || ['Contact support', 'View FAQs'];
  }
}

export default new EmpathyResponse();
