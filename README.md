# TheAIColab - Humanized AI Customer Support for DEWA

**The Co-Innovation Lab** - AI-powered customer support platform combining proactive guidance, omnichannel chatbot (voice-enabled), predictive analytics, and back-office copilot with human oversight.

## 🎯 Project Overview

This hackathon project demonstrates how AI can **humanize** customer service by:
- **Proactive Guidance**: Prevents unnecessary tickets before submission
- **Unified AI Brain**: Orchestrates intent detection, empathy responses, bill predictions
- **Voice Support**: STT/TTS integration for accessibility
- **Continuous Learning**: Feedback loop improves AI with every interaction
- **Human Oversight**: AI recommends, humans approve

## 🏗️ Architecture

```
Customer Interaction → Unified AI Brain → Back-Office Copilot → Analytics
      ↓                      ↓                    ↓                ↓
  (Web/Mobile)        (Intent, Empathy,      (Human Review)    (FCR, Deflection)
                    Proactive, Prediction)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key (optional - has fallback to rule-based AI)

### 1. Clone & Setup
```bash
git clone <repo-url>
cd TheAIColab

# Copy environment template
cp .env.example .env

# Add your OpenAI API key (optional)
# Edit .env and set OPENAI_API_KEY=your_key_here
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:3001

### 3. Frontend Setup (separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

### 4. Login with Demo Account
Use any of these 6 diverse test accounts:

| Customer | Email | Password | Scenario |
|----------|-------|----------|----------|
| **Ahmed** | `ahmed@example.com` | `password123` | ⚠️ Bill spike investigation |
| **Fatima** | `fatima@example.com` | `password123` | ✅ Model customer (energy efficient) |
| **Mohammed** | `mohammed@example.com` | `password123` | 🏊 Villa owner with pool |
| **Sara** | `sara@example.com` | `password123` | 🚨 Critical overdue bill |
| **Omar** | `omar@example.com` | `password123` | 🏢 Commercial account |
| **Layla** | `layla@example.com` | `password123` | ⭐ Star customer (solar panels) |

## 📊 What's New - Recent Enhancements

### ✨ Enhanced Data & Humanization
- **6 Diverse Test Accounts**: Covering scenarios from critical overdue to star customers
- **Rich Historical Data**: 8 months of consumption history per customer with predictions
- **Account Health Scoring**: 0-100 scale with color-coded status (Excellent/Good/Warning/Critical)
- **Personalized AI Tips**: 3-4 context-specific recommendations per customer
- **12 Humanized Interactions**: Empathetic, name-personalized AI responses with emotional intelligence

### 📈 New Visualizations
- **Historical Consumption Charts**: Dual Y-axis (AED + kWh) with Recharts
- **Account Health Dashboard**: Progress bars, status badges, trend indicators
- **Prediction Display**: Next month's forecasted bill shown with confidence scores
- **Payment History**: Visual timeline of on-time vs late payments

See [ENHANCEMENTS.md](ENHANCEMENTS.md) for complete details.

## 📁 Project Structure

```
TheAIColab/
├── backend/
│   ├── server.js                 # Express server
│   ├── routes/
│   │   ├── auth.js              # Login/JWT
│   │   ├── customer.js          # Customer summary
│   │   ├── proactive.js         # Proactive guidance
│   │   ├── chatbot.js           # Chat queries
│   │   └── backoffice.js        # Tickets & analytics
│   ├── ai/
│   │   ├── unifiedBrain.js      # Central AI orchestrator
│   │   ├── intentDetection.js   # Query classification
│   │   ├── empathyResponse.js   # Humanized replies
│   │   ├── proactiveAdvisor.js  # Pre-submission guidance
│   │   └── billPredictor.js     # Consumption prediction
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app with routing
│   │   ├── components/
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── CustomerSummary.jsx  # Dashboard with AI insights
│   │   │   ├── RequestForm.jsx      # Proactive guidance demo
│   │   │   ├── Chatbot.jsx          # STT/TTS chat
│   │   │   └── Dashboard.jsx        # Analytics metrics
│   └── package.json
├── data/
│   ├── customers.json           # Sample customer data (bilingual)
│   └── ai-logs.json             # Interaction logs for learning
└── docker-compose.yml           # Container orchestration
```

## 🎨 Key Features

### 1. Customer Summary (AI-Powered)
- **Bill Prediction**: ML-based forecasting with confidence scores
- **Consumption Analysis**: Trend detection and variance calculation
- **Proactive Alerts**: AI recommendations based on patterns

### 2. Proactive Guidance
- **Duplicate Detection**: Checks for existing open complaints
- **Known Issue Alerts**: Matches against area-specific outages
- **Bill Explanation**: AI analyzes consumption before ticket creation
- **Confidence Scoring**: Low confidence = escalate to human

### 3. Omnichannel Chatbot
- **Voice Input**: Web Speech API (STT)
- **Voice Output**: Text-to-Speech with empathetic tone
- **Intent Classification**: Real-time query categorization
- **Context Awareness**: Customer history in every response

### 4. Analytics Dashboard
- **FCR Rate**: First Contact Resolution tracking
- **Ticket Deflection**: % prevented through proactive guidance
- **Bill Prediction Accuracy**: MAPE calculation
- **Continuous Learning**: Feedback loop visualization

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/customer/summary/:id` | GET | AI insights + open complaints |
| `/api/proactive/guidance` | POST | Pre-submission analysis |
| `/api/chatbot/query` | POST | Chat with STT/TTS |
| `/api/backoffice/submit-ticket` | POST | Create ticket |
| `/api/backoffice/analytics` | GET | Metrics dashboard |

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up

# Backend: http://localhost:3001
# Frontend: http://localhost:5173
```

## 🌐 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, Winston
- **AI**: OpenAI GPT-4 (with rule-based fallback)
- **Voice**: Web Speech API (STT/TTS)
- **Data**: JSON (dev) → PostgreSQL/MongoDB (production)

## 📊 Sample Data

Includes 3 demo customers with:
- Bilingual data (English/Arabic)
- Consumption history (5 months)
- Open complaints with status tracking
- Usage patterns and peak hours

## 🔐 Security Notes

- JWT-based authentication
- Token expiry: 24 hours
- API keys in `.env` (never committed)
- CORS configured for frontend origin

## 🎯 Hackathon Demo Flow

1. **Login** → Ahmed's account (high bill customer)
2. **Summary** → View AI bill prediction + proactive alerts
3. **Request** → Try submitting "High Bill" complaint
4. **Proactive AI** → See AI deflect with explanation
5. **Chat** → Test voice input: "Why is my bill high?"
6. **Dashboard** → View real-time FCR and deflection metrics

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repo
2. Create feature branch
3. Test thoroughly
4. Submit PR with detailed description

## 📄 License

MIT License - built for DEWA Hackathon 2026

## 🙏 Acknowledgments

- Dubai Electricity & Water Authority (DEWA)
- OpenAI for GPT models
- React & Node.js communities
===========================

# DEWA AI Customer Support Platform

## Architecture Overview
A unified AI-driven customer support system with centralized orchestration, empathy-driven responses, proactive guidance, and continuous learning.

### System Flow
```
Customer Interactions (Web/Mobile/IVR)
    ↓
Unified AI Brain (Central Orchestrator)
    ↓
┌───────────────────────────────────────┐
│ Intent Detection                      │
│ Empathy Response                      │
│ Proactive Advisor                     │
│ Bill Predictor                        │
└───────────────────────────────────────┘
    ↓
Back-Office Copilot (Human Oversight)
    ↓
Analytics & Continuous Learning
    ↓
Feedback Loop → AI Improvement
```

## Features
- **Unified AI Brain**: Central orchestration layer coordinating all AI modules
- **Intent Detection**: Classifies customer queries (billing/outage/service)
- **Empathy Response**: Generates humanized, context-aware replies
- **Proactive Guidance**: Pre-submission alerts to prevent unnecessary tickets
- **Bill Prediction**: Analyzes consumption patterns with recommendations
- **Back-Office Copilot**: AI-assisted ticket management with human oversight
- **Continuous Learning**: Analytics-driven feedback loop for AI improvement
- **Bilingual Support**: English and Arabic language detection and responses

## Tech Stack
- **Backend**: Node.js, Express, OpenAI API
- **Frontend**: React, Tailwind CSS, Chakra UI
- **Analytics**: Chart.js / Recharts
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Docker Compose

## Project Structure
```
dewa-ai-support/
├── backend/
│   ├── ai/
│   │   ├── unifiedBrain.js       # Central orchestration layer
│   │   ├── intentDetection.js    # Query classification
│   │   ├── empathyResponse.js    # Humanized replies
│   │   ├── proactiveAdvisor.js   # Pre-submission guidance
│   │   └── billPredictor.js      # Consumption analysis
│   ├── routes/
│   │   ├── auth.js               # Authentication
│   │   ├── customer.js           # Customer data
│   │   ├── proactive.js          # Proactive guidance
│   │   ├── chatbot.js            # Chat interface
│   │   └── backoffice.js         # Ticket management
│   ├── services/
│   │   ├── ticketClassifier.js   # Urgency/type classification
│   │   ├── solutionEngine.js     # Resolution suggestions
│   │   └── analytics.js          # Metrics calculation
│   └── server.js                 # Express server
├── frontend/
│   └── src/
│       └── components/
│           ├── Login.jsx
│           ├── CustomerSummary.jsx
│           ├── ProactiveGuidance.jsx
│           ├── Chatbot.jsx
│           ├── BackOfficePanel.jsx
│           └── Dashboard.jsx
├── data/
│   ├── customers.json            # Customer data
│   └── ai-logs.json              # AI interaction logs
├── tests/
└── docker-compose.yml
```

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables
Create `.env` file in backend/:
```
OPENAI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```

### Running the Application
```bash
# Development mode
npm run dev

# Production mode (with Docker)
docker-compose up
```

## API Documentation

### Authentication
- `POST /api/login` - Customer login

### Customer Endpoints
- `GET /api/customer-summary/:id` - Get customer insights and predictions
- `GET /api/proactive-guidance` - Get pre-submission alerts

### Chatbot
- `POST /api/analyze-query` - Process customer query through Unified AI Brain

### Back-Office
- `POST /api/submit-ticket` - Create ticket with AI recommendations
- `GET /api/tickets` - List tickets with AI classifications
- `POST /api/tickets/:id/resolve` - Resolve ticket and log for learning

### Analytics
- `GET /api/analytics/metrics` - Get dashboard metrics
- `GET /api/analytics/trends` - Get trend analysis

## AI Module Coordination Strategy

### Parallel Execution with Weighted Scoring
The Unified AI Brain executes modules in parallel for optimal speed:
1. Intent Detection (weight: 1.0) - Critical for routing
2. Empathy Response (weight: 0.8) - Important for tone
3. Proactive Advisor (weight: 0.9) - High value for deflection
4. Bill Predictor (weight: 0.7) - Context-dependent

Modules return confidence scores; final response aggregates with weighted averaging.

## Continuous Improvement

### Automated Learning
- **Low-risk changes**: Automated A/B testing (empathy tone, response templates)
- **High-risk changes**: Manual approval required (ticket classification, routing logic)

### Human Override Logging
Granular tracking includes:
- Override reason (wrong_intent, incomplete_info, customer_preference, urgency_change)
- Original AI recommendation
- Human decision
- Timestamp and operator ID

### Feedback Loop Metrics
- First Contact Resolution (FCR) Rate
- Ticket Deflection Rate
- Bill Prediction Accuracy
- Proactive Guidance Acceptance Rate
- Human Override Frequency by Module

## Bilingual Support
- Automatic Arabic language detection in Intent Module
- Bilingual responses in Empathy Engine
- UI language toggle in all customer-facing components
- Sample data includes English and Arabic test cases

## Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

## License
THECOLABS

## Contributors
DEWA AI Support Team
