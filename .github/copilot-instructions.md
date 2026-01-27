# TheAIColab - GitHub Copilot Instructions

## Project Overview
**TheAIColab** ("The Co-Innovation Lab") is a hackathon project building a **Humanized AI Customer Support** system. The platform combines proactive AI guidance, omnichannel chatbot (with voice support), predictive analytics, and back-office copilot to reduce support tickets while maintaining human oversight.

**Core Philosophy**: AI assists and accelerates, humans validate and decide. The system prevents unnecessary tickets through proactive guidance while humanizing interactions via empathy-driven responses and STT/TTS.

## Architecture

### High-Level Components
```
┌─────────────┐      ┌──────────────────────┐      ┌─────────────┐
│  Frontend   │ ←──→ │  Backend (Node.js)   │ ←──→ │ Data Store  │
│ (React.js)  │      │  - Omnichannel AI    │      │ (JSON/API)  │
│             │      │  - Proactive Engine  │      └─────────────┘
│ - Login     │      │  - Back-Office AI    │
│ - Summary   │      │  - Analytics Logger  │
│ - Chatbot   │      └──────────────────────┘
│ - Dashboard │               ↓
└─────────────┘      ┌──────────────────────┐
                     │  AI Services         │
                     │  - GPT/Azure OpenAI  │
                     │  - STT/TTS (Voice)   │
                     └──────────────────────┘
```

### Component Responsibilities
- **Customer Summary**: AI predictions (bills, consumption patterns) + open complaints
- **Proactive Guidance**: Intercepts requests, suggests alternatives before ticket submission
- **Chatbot**: Multi-channel (web/voice) with intent recognition, empathy, STT/TTS
- **Back-Office Copilot**: Auto-fills tickets, prioritizes, suggests resolutions (human oversight required)
- **Analytics**: Tracks FCR (First Contact Resolution), ticket deflection, prediction accuracy

## Technology Stack
- **Frontend**: React.js, Tailwind CSS / Chakra UI
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT / Azure OpenAI for intent, empathy, proactive responses
- **Voice**: Web Speech API (STT/TTS) or Azure Cognitive Services
- **Data**: JSON sample files (dev) → PostgreSQL/MongoDB (production)
- **Logging**: Winston/Pino, Grafana/Chart.js for metrics
- **Deployment**: Docker Compose (local), Terraform/Bicep (cloud)

## Development Workflow

### Folder Structure (Target)
```
/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── CustomerSummary.jsx
│   │   │   ├── RequestForm.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   └── Dashboard.jsx
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── customer.js
│   │   ├── proactive.js
│   │   └── chatbot.js
│   ├── ai/
│   │   ├── proactiveEngine.js
│   │   ├── intentClassifier.js
│   │   └── empathyEngine.js
│   └── package.json
├── data/
│   ├── customers.json
│   └── ai-logs.json
└── README.md
```

### Development Roadmap
1. **Setup**: Initialize repo, Node.js backend, React frontend scaffold
2. **Customer Summary**: `/api/customer-summary/:id` - AI predictions + open complaints
3. **Proactive Guidance**: `/api/proactive-guidance` - AI intercepts requests before submission
4. **Chatbot**: `/api/analyze-query` - Multi-channel with STT/TTS integration
5. **Integration**: Connect frontend → backend → AI agents → logging
6. **Testing**: Jest/Cypress for intent classification, customer journey flows
7. **Analytics**: Dashboard tracking FCR, ticket deflection, prediction accuracy

### Running Locally
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm start
```

## Key API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/login` | POST | User authentication |
| `/api/customer-summary/:id` | GET | Fetch AI insights, open complaints, predicted bills |
| `/api/proactive-guidance` | POST | AI evaluates request before ticket submission |
| `/api/submit-ticket` | POST | Creates ticket for back-office copilot |
| `/api/analyze-query` | POST | Chatbot processing with STT/TTS support |

## Data Models

### Customer (customers.json)
```json
{
  "id": "C12345",
  "name": "John Doe",
  "openComplaints": [
    { "ticketId": "T001", "subject": "High bill", "status": "Open" }
  ],
  "predictedBill": 245.50,
  "consumptionHistory": [200, 210, 230, 245]
}
```

### AI Log (ai-logs.json)
```json
{
  "timestamp": "2026-01-27T10:23:00Z",
  "customerId": "C12345",
  "interactionType": "Chat",
  "query": "Why is my bill high?",
  "aiResponse": "Your consumption spiked due to AC usage",
  "proactiveSuggestion": "Check energy history before submitting complaint"
}
```

## Project-Specific Conventions

### AI-Human Handoff Pattern
- **AI proposes**, human approves/overrides (especially in back-office copilot)
- Proactive guidance shows confidence scores; low confidence = escalate to human
- All AI decisions logged to `ai-logs.json` for continuous learning

### Voice Integration
- Use Web Speech API for quick prototyping
- TTS responses should sound empathetic, not robotic (adjust tone/speed)
- STT transcripts stored in logs for intent classification improvement

### Metrics Priority
1. **Ticket Deflection Rate**: % of requests resolved via proactive guidance/chatbot
2. **FCR (First Contact Resolution)**: % resolved without escalation
3. **Prediction Accuracy**: Predicted vs actual bills (MAPE - Mean Absolute Percentage Error)

## Hackathon Focus
- **Speed over perfection**: Use JSON files, skip database setup initially
- **Human-in-the-loop demos**: Show AI recommendations with human override capability
- **Voice demo**: STT/TTS chatbot interaction is a showstopper feature
- **Visual metrics**: Live dashboard showing ticket deflection in real-time

## Key Files to Create
- `backend/ai/proactiveEngine.js` - Core AI decision logic for request interception
- `frontend/src/components/Chatbot.jsx` - Multi-channel chat with voice support
- `data/customers.json` - Sample customer data for testing
- `backend/routes/proactive.js` - Proactive guidance API endpoint
