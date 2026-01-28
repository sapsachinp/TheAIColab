# Ticket Tracking System - User Guide

## Overview
Comprehensive ticket tracking system that allows customers to submit, track, and manage their requests across all channels (Web, Chat, Mobile).

## Features Implemented

### 1. **Request Submission & Storage**
- ✅ Tickets are automatically saved to `data/tickets.json`
- ✅ Unique ticket ID format: `DEWA-{timestamp}-{random}`
- ✅ Priority calculated from AI analysis and request type
- ✅ Complete ticket metadata: status, priority, timestamps, AI recommendations

### 2. **Enhanced Submission Confirmation**
After submitting a request, users see:
- 🎫 **Ticket Details Card**:
  - Unique Ticket Number
  - Priority Level (High/Medium/Low with color coding)
  - Request Type
  - Current Status
  - Submission Timestamp
  
- 📋 **Next Steps Guide**:
  - System confirmation
  - Review timeline (24 hours)
  - Update notifications (Email & SMS)
  - Chat tracking instructions

- 🎯 **Quick Actions**:
  - Chat Support (direct link)
  - Back to Dashboard
  - Submit Another Request

### 3. **Chat Support Integration**
The AI chatbot now automatically:

#### **Detects Tracking Queries**
Recognizes keywords: `track`, `status`, `request`, `ticket`, `complaint`, `submitted`, `follow up`

#### **Shows Request History**
When users ask "track my requests" or similar:
- Lists up to 3 most recent tickets
- Shows ticket number, type, status, priority, date
- Bilingual support (English/Arabic)
- Color-coded status indicators

#### **Proactive Notifications**
Even when users don't explicitly ask:
- Notifies about active tickets
- Adds note: "You have X active request(s)"
- Suggests typing "track requests" for details

### 4. **Ticket Display in Chat**
Each ticket shown includes:
- 🎫 Ticket number with emoji
- 📅 Creation date (localized format)
- 🎯 Priority badge (color-coded)
- 📋 Request type
- 🟢 Status with indicator dot

### 5. **Backend API Endpoints**

#### Submit Ticket
```
POST /api/backoffice/submit-ticket
```
- Saves ticket to JSON file
- Returns complete ticket object
- Auto-generates unique ID

#### Get Customer Tickets
```
GET /api/backoffice/tickets/:customerId?status=Open
```
- Retrieves all tickets for a customer
- Optional status filtering
- Sorted by newest first

#### Get Specific Ticket
```
GET /api/backoffice/ticket/:ticketId
```
- Fetches detailed ticket information
- Includes status history

## Usage Examples

### For Customers

#### 1. Submit a Request
1. Navigate to "New Request"
2. Select request type (auto-generates AI explanation)
3. Click "Get AI Guidance" (analyzes your account)
4. Review recommendations
5. Submit ticket
6. **Save your ticket number!**

#### 2. Track via Chat
Open Chat Support and type any of:
- "track my requests"
- "show my tickets"
- "request status"
- "تتبع طلباتي" (Arabic)

#### 3. Automatic Detection
The AI will automatically mention active tickets when you chat about related issues!

## Data Structure

### Ticket Object
```json
{
  "ticketId": "DEWA-1738070400000-1234",
  "customerId": "C001",
  "requestType": "billing_inquiry",
  "requestDetails": "Customer notes...",
  "status": "Open",
  "priority": "High",
  "createdAt": "2026-01-28T11:00:00.000Z",
  "updatedAt": "2026-01-28T11:00:00.000Z",
  "channel": "web",
  "aiGuidance": { ... },
  "aiRecommendations": [...],
  "statusHistory": [...]
}
```

### Status Values
- **Open**: Newly submitted, awaiting review
- **In Progress**: Being worked on by support team
- **Resolved**: Completed successfully
- **Closed**: Archived

### Priority Levels
- **High**: Service outages, urgent issues (🔴)
- **Medium**: Billing inquiries, payment issues (🟡)
- **Low**: General questions, information requests (🟢)

## Multi-Channel Support

### Web Portal
✅ Full submission form with AI guidance
✅ Enhanced confirmation page
✅ Direct links to chat and dashboard

### Chat Support
✅ Natural language tracking queries
✅ Automatic detection of existing tickets
✅ Bilingual support (EN/AR)
✅ Visual ticket cards

### Mobile (Future)
🔄 API endpoints ready
🔄 Same data access
🔄 Consistent experience

## Bilingual Support

### English
- "track my requests"
- "show my tickets"
- "request status"
- Clear, concise responses

### Arabic
- "تتبع طلباتي"
- "أين طلباتي"
- "حالة الطلب"
- RTL-optimized display

## Best Practices

### For Customers
1. **Save your ticket number** - It's your reference
2. **Use chat for quick status** - Faster than email
3. **Check AI guidance first** - May resolve issue immediately
4. **Provide details** - Better analysis and faster resolution

### For Support Team
1. Ticket IDs are unique and traceable
2. AI recommendations included in each ticket
3. Priority pre-calculated for triage
4. Complete audit trail in statusHistory

## Technical Notes

- Tickets stored in: `/data/tickets.json`
- Auto-save on submission
- No database required (JSON file)
- Ready for database migration
- Concurrent access handled
- Backup recommended

## Future Enhancements

🔮 **Planned Features**:
- Email notifications on status change
- SMS alerts for high-priority tickets
- Customer portal for detailed tracking
- Ticket escalation workflow
- SLA tracking and reminders
- Analytics dashboard for ticket trends
- Auto-close resolved tickets after 7 days
- Customer satisfaction surveys
- Attachment support
- Internal notes for support team

## Testing

### Test Scenarios

1. **Submit Request**
   - Login as ahmed@example.com
   - Submit billing inquiry
   - Note ticket number

2. **Track in Chat**
   - Open chat
   - Type "track my requests"
   - Verify tickets displayed

3. **Multiple Tickets**
   - Submit 2-3 different requests
   - Check all appear in chat
   - Verify sorting (newest first)

4. **Bilingual**
   - Switch to Arabic
   - Submit request in Arabic
   - Track using Arabic keywords

## Support

For issues or questions:
- Check logs: `/tmp/backend.log`
- Ticket data: `/data/tickets.json`
- API health: `http://localhost:3001/health`
