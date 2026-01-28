# Chat Request Submission - User Guide

## Overview
Customers can now submit new requests/complaints directly through the Chat Support interface without navigating to the "New Request" page. The AI chatbot provides guided submission with intelligent recommendations.

## Features

### 🎯 **Smart Intent Detection**
The AI automatically recognizes when you want to submit a request using keywords like:
- **English**: "submit", "create", "new request", "file complaint", "lodge complaint", "raise ticket"
- **Arabic**: "أريد تقديم", "تسجيل شكوى", "طلب جديد", "أرسل طلب"

### 📊 **Existing Request Check**
Before allowing new submission, the AI:
- Checks for active open requests
- Displays existing tickets if found
- Asks if you want to view existing or submit new anyway
- Prevents duplicate submissions

### 🎨 **Interactive Request Form**
When submitting through chat, you get:

1. **Request Type Selection**
   - 6 visual cards with icons
   - Billing Inquiry 💰
   - Service Outage ⚡
   - Meter Reading 📊
   - Payment Problem 💳
   - New Connection 🔌
   - General Complaint 📝

2. **AI-Powered Explanation**
   - Auto-loads explanation for selected type
   - Shows common reasons
   - Displays helpful information
   - Personalized to your account

3. **Details Input**
   - Optional text area for additional details
   - Pre-filled with AI context
   - Supports bilingual input

4. **Instant Submission**
   - Gets full AI guidance analysis
   - Creates ticket with priority
   - Shows confirmation with ticket number
   - Provides tracking instructions

## How to Use

### Method 1: Direct Command
Simply type in chat:
```
"I want to submit a new request"
"Create a complaint"
"أريد تقديم طلب جديد" (Arabic)
```

### Method 2: Natural Conversation
Chat naturally:
```
User: "My bill is too high this month"
AI: "I can help you submit a billing inquiry..."
```

### Step-by-Step Flow

1. **Initiate Submission**
   - Type submission keyword in chat
   - AI responds with request options

2. **Select Request Type**
   - Floating overlay appears with 6 options
   - Click the type that matches your issue
   - Or scroll up to message with inline buttons

3. **View AI Explanation**
   - System loads explanation automatically
   - Shows common reasons and insights
   - Personalized to your account data

4. **Add Details (Optional)**
   - Text area appears in chat
   - Add specific information
   - Or leave blank for general request

5. **Submit**
   - Click "Submit Request" button
   - AI analyzes and processes
   - Creates ticket instantly

6. **Get Confirmation**
   - Ticket card appears in chat
   - Shows ticket number, priority, status
   - Instructions for tracking provided

## UI Components

### Request Mode Indicator
When in submission mode, you'll see:
```
┌─────────────────────────────────┐
│ 📝 Request Submission Mode      │
│ Scroll up to select type above  │
└─────────────────────────────────┘
```

### Floating Selection Overlay
```
┌─────────────────────────────────┐
│ 📝 Submit New Request        ✕  │
│                                  │
│ Select type:                    │
│ ┌────────┐ ┌────────┐          │
│ │   💰   │ │   ⚡   │          │
│ │Billing │ │Outage  │          │
│ └────────┘ └────────┘          │
└─────────────────────────────────┘
```

### Inline Message Options
```
AI: Sure! I can help you submit a request.

[💰 Billing] [⚡ Outage] [📊 Meter]
[💳 Payment] [🔌 Connection] [📝 Complaint]

[✕ Cancel]
```

### Details Input
```
┌─────────────────────────────────┐
│ ℹ️ Helpful Information:         │
│ • Seasonal AC usage             │
│ • New appliances                │
└─────────────────────────────────┘

[Text area for details...]

[✓ Submit Request] [Cancel]
```

### Success Confirmation
```
┌─────────────────────────────────┐
│            ✅                    │
│                                  │
│ Ticket #: DEWA-123456-7890      │
│ Priority: High                   │
│                                  │
│ Track: type "track requests"    │
└─────────────────────────────────┘
```

## Key Features

### 🔄 **Seamless Flow**
- No page navigation required
- Stays in chat context
- Quick and intuitive
- Mobile-friendly

### 🤖 **AI-Powered**
- Intelligent intent detection
- Contextual explanations
- Account-specific insights
- Priority calculation

### 🌐 **Bilingual Support**
- Full English/Arabic support
- RTL layout for Arabic
- Localized messages
- Cultural sensitivity

### 📱 **Responsive Design**
- Works on all screen sizes
- Touch-optimized buttons
- Scrollable options
- Floating overlays

## Examples

### Example 1: Simple Submission
```
User: "submit a complaint"
AI: "Sure! Please select request type:"
[Shows 6 options]
User: [Clicks Billing Inquiry]
AI: "You selected: Billing Inquiry
     
     Your consumption is increasing..."
[Shows details input]
User: [Adds details or clicks Submit]
AI: "✅ Submitted! Ticket #DEWA-123..."
```

### Example 2: With Existing Tickets
```
User: "create new request"
AI: "You have 2 active requests.
     1. View existing
     2. Submit new anyway"
User: "submit new"
AI: [Shows request type options]
```

### Example 3: Arabic Flow
```
User: "أريد تقديم طلب جديد"
AI: "بالتأكيد! الرجاء اختيار نوع الطلب:"
[يعرض 6 خيارات]
User: [ينقر على استفسار الفاتورة]
AI: "✅ تم تقديم طلبك!"
```

## Advantages Over Traditional Form

| Feature | Chat Submission | Web Form |
|---------|----------------|----------|
| Navigation | ✅ No navigation | ❌ Navigate to page |
| Context | ✅ Conversational | ❌ Formal |
| Speed | ✅ 3-4 clicks | ❌ 5-6 clicks |
| AI Help | ✅ Real-time | ⚠️ After selection |
| Existing Check | ✅ Automatic | ❌ Manual |
| Mobile | ✅ Optimized | ⚠️ Responsive |
| Tracking | ✅ In same chat | ❌ Different page |

## Tips for Users

1. **Be Natural**: Type naturally, AI understands context
2. **Check Existing**: Always review existing tickets first
3. **Add Details**: More details = faster resolution
4. **Save Ticket Number**: Copy/paste for future reference
5. **Track Easily**: Just type "track my requests" anytime
6. **Cancel Anytime**: Click ✕ to exit submission mode

## Tips for Support Team

1. **Monitor Patterns**: Track submission keywords
2. **Review AI Accuracy**: Check if correct type detected
3. **Optimize Messages**: Update AI responses based on feedback
4. **Track Completion Rate**: Monitor submission vs abandonment
5. **Bilingual Quality**: Ensure Arabic translations accurate

## Technical Details

### API Endpoints Used
- `POST /api/proactive/explain-request` - Get request type explanation
- `POST /api/proactive/guidance` - Get AI analysis
- `POST /api/backoffice/submit-ticket` - Create ticket
- `GET /api/backoffice/tickets/:customerId` - Check existing

### Data Flow
1. User types submission keyword
2. Backend detects intent via regex
3. Frontend triggers request mode
4. User selects type → API call for explanation
5. User adds details → API call for guidance
6. Submit → Creates ticket in tickets.json
7. Display confirmation with ticket details

### State Management
- `requestMode`: Boolean for submission mode
- `selectedRequestType`: Currently selected type
- `requestDetails`: User-entered details
- Messages array includes form components

## Troubleshooting

### Issue: Request form not showing
**Solution**: Type explicit keywords like "submit request"

### Issue: Can't submit with existing tickets
**Solution**: Choose "submit new anyway" option

### Issue: Input disabled during submission
**Solution**: This is intentional - use form inputs instead

### Issue: Form disappears on cancel
**Solution**: Retype submission keyword to restart

## Future Enhancements

🔮 **Planned Features**:
- Voice submission support
- Image attachment capability
- Quick templates for common issues
- AI auto-fill from conversation
- Smart follow-up questions
- Estimated resolution time display
- Real-time priority adjustment
- Multi-step guided forms
- Integration with knowledge base
- Proactive suggestion before typing

## Testing Checklist

✅ Keywords trigger request mode  
✅ Existing tickets displayed  
✅ Request types load with icons  
✅ Explanation fetched correctly  
✅ Details input works  
✅ Submission creates ticket  
✅ Confirmation shows ticket ID  
✅ Tracking keywords work after  
✅ Cancel exits properly  
✅ Bilingual switches correctly  

## Success Metrics

Track these KPIs:
- Chat submission rate vs web form
- Time to complete submission
- Abandonment rate at each step
- AI intent detection accuracy
- Duplicate submission prevention
- Customer satisfaction scores
- Support team efficiency gains

---

**Ready to try it?**  
Open Chat Support and type: **"I want to submit a new request"** 🚀
