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
        console.log('⚠️  Using template-based response (no real OpenAI API key)');
        return this.templateResponse(intent, context, language);
      }

      console.log('🔄 Generating empathetic response with real OpenAI API...');
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
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      const message = response.choices[0].message.content;

      console.log('✅ Generated real empathetic response using OpenAI API');
      return {
        message,
        suggestions: this.extractSuggestions(params.intent),
        tone: 'empathetic'
      };
    } catch (error) {
      console.error('❌ OpenAI API error in empathy response:', error.message || error);
      console.log('⚠️  Using template-based response instead');
      return this.templateResponse(params.intent, params.context, params.language);
    }
  }

  /**
   * Template-based fallback responses (highly humanized)
   */
  templateResponse(intent, context, language) {
    const templates = {
      billing_inquiry: {
        en: "I completely understand your concern - nobody likes surprises when it comes to bills! Let me help you understand what's happening here. 🔍 Looking at your usage history, I can see your consumption has been trending upward recently. Think of me as your energy partner - together we'll figure this out! Would you like me to show you a detailed breakdown, or shall we explore some smart ways to optimize your usage and reduce future costs?",
        ar: "أتفهم تمامًا قلقك - لا أحد يحب المفاجآت عندما يتعلق الأمر بالفواتير! دعني أساعدك في فهم ما يحدث هنا. بالنظر إلى سجل استهلاكك، يمكنني أن أرى أن استهلاكك كان في ازدياد مؤخرًا. فكر بي كشريك الطاقة الخاص بك - معًا سنكتشف هذا!"
      },
      service_outage: {
        en: "I sincerely apologize for the inconvenience this outage has caused you - I know how disruptive it can be to your daily routine. 🔌 Let me check what's happening in your area right away... Our technical team is working diligently to restore service. I'll make sure you're kept updated every step of the way. Would you like me to set up SMS notifications so you know exactly when power is restored?",
        ar: "أعتذر بصدق عن الإزعاج الذي سببه هذا الانقطاع - أعلم مدى تعطيله لروتينك اليومي. دعني أتحقق مما يحدث في منطقتك على الفور... يعمل فريقنا الفني بجد لاستعادة الخدمة."
      },
      advisory: {
        en: "I love that you're taking a proactive approach! 💡 That shows real awareness. Based on analyzing your unique consumption patterns, I've identified several opportunities tailored specifically for you. These aren't just generic tips - they're personalized recommendations based on YOUR actual usage. Small changes can make a big difference! Shall we explore these together?",
        ar: "أحب أنك تتخذ نهجًا استباقيًا! هذا يظهر وعيًا حقيقيًا. بناءً على تحليل أنماط استهلاكك الفريدة، حددت عدة فرص مصممة خصيصًا لك. هذه ليست مجرد نصائح عامة - إنها توصيات شخصية بناءً على استخدامك الفعلي."
      },
      complaint: {
        en: "Thank you for bringing this to our attention - your feedback genuinely matters to us. I can hear your frustration, and you have every right to feel that way. 🤝 Let me be your advocate here. I'm reviewing your account now and taking immediate action to resolve this. You're not just a number to us - you're part of the DEWA family, and we're here to support you.",
        ar: "شكرًا لك على لفت انتباهنا إلى هذا - ملاحظاتك مهمة حقًا بالنسبة لنا. يمكنني سماع إحباطك، ولديك كل الحق في الشعور بهذه الطريقة. دعني أكون محاميك هنا. أنا أراجع حسابك الآن وأتخذ إجراءً فوريًا لحل هذا."
      },
      payment_assistance: {
        en: "First, I want you to know that you're not alone in facing financial challenges - we're here to help, not judge. It takes courage to reach out, and I'm glad you did. 💙 Let's work together to find a solution that works for YOUR situation. We have flexible payment options, and I can also show you ways to reduce future bills. You're going to get through this, and we're with you every step of the way.",
        ar: "أولاً، أريدك أن تعرف أنك لست وحدك في مواجهة التحديات المالية - نحن هنا للمساعدة، وليس للحكم. يتطلب الأمر شجاعة للتواصل، وأنا سعيد بأنك فعلت ذلك. دعنا نعمل معًا لإيجاد حل يناسب موقفك."
      },
      payment_inquiry: {
        en: "Great question! Let me get you that information right away. ✅ Your bill payment status is up-to-date. To make your life easier, we have multiple convenient payment options available. Pro tip: Setting up auto-pay means you'll never worry about due dates again, plus you can earn rewards! Would you like me to help you set that up?",
        ar: "سؤال رائع! دعني أحصل على هذه المعلومات لك على الفور. حالة دفع فاتورتك محدثة. لجعل حياتك أسهل، لدينا خيارات دفع مريحة متعددة متاحة."
      },
      account_update: {
        en: "I'd be happy to help you update your account information! 📝 Your security is our priority, so I'll need to verify a few details first - this will only take a moment. Once verified, we can update any information you need. Is there anything else you'd like to update while we're at it? Let's make sure everything is perfect!",
        ar: "يسعدني مساعدتك في تحديث معلومات حسابك! أمانك هو أولويتنا، لذا سأحتاج إلى التحقق من بعض التفاصيل أولاً - سيستغرق هذا لحظة فقط."
      },
      unknown: {
        en: "Thank you for reaching out to DEWA! 👋 I'm your AI assistant, and I'm here to make your experience smooth and helpful. I want to make sure I understand exactly what you need so I can provide the best possible assistance. Could you tell me a bit more about what brings you here today? Whether it's about your bill, service, account, or anything else - I'm all ears!",
        ar: "شكرًا لك على التواصل مع ديوا! أنا مساعدك الذكي، وأنا هنا لجعل تجربتك سلسة ومفيدة. أريد التأكد من أنني أفهم بالضبط ما تحتاجه حتى أتمكن من تقديم أفضل مساعدة ممكنة."
      }
    };

    const lang = language === 'ar' ? 'ar' : 'en';
    let message = templates[intent]?.[lang] || templates.unknown[lang];
    
    // Personalize with customer name if available in context
    message = this.personalize(message, context);

    return {
      message,
      suggestions: this.extractSuggestions(intent),
      tone: 'empathetic',
      emotion: this.detectEmotion(intent)
    };
  }

  /**
   * Personalize message with context
   */
  personalize(message, context) {
    // Try to extract customer name from context
    const nameMatch = context?.match(/(?:Customer|Account holder|Name)[:\s]+([A-Za-z]+)/i);
    if (nameMatch) {
      const name = nameMatch[1];
      // Add friendly greeting with name
      const greetings = [
        `Hi ${name}! `,
        `Hello ${name}! `,
        `${name}, `,
        `Great to hear from you, ${name}! `
      ];
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      message = greeting + message;
    }
    return message;
  }

  /**
   * Detect emotion/sentiment for response styling
   */
  detectEmotion(intent) {
    const emotions = {
      billing_inquiry: 'concerned',
      service_outage: 'apologetic',
      advisory: 'encouraging',
      complaint: 'empathetic',
      payment_assistance: 'supportive',
      payment_inquiry: 'helpful',
      account_update: 'professional',
      unknown: 'friendly'
    };
    return emotions[intent] || 'neutral';
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
