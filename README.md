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

### 1. Bilingual Customer Support (English/Arabic)
- **i18next Integration**: 5 namespaces for organized translations
- **RTL Layout**: Automatic right-to-left support for Arabic
- **Dynamic Switching**: Language toggle with persistent preference
- **Native Support**: All UI components, AI responses, and error messages

### 2. Multi-Factor Authentication (MFA)
- **Email OTP**: 6-digit codes with 5-minute expiration
- **Rate Limiting**: 60-second cooldown between OTP requests
- **JWT Tokens**: Access (8h) + Refresh (7d) token strategy
- **Demo Bypass**: "000000" OTP for testing purposes
- **Security**: bcrypt password hashing, audit logging

### 3. Customer 360 View
- **Business Partner Information**: Complete account hierarchy
- **Multiple Contract Accounts**: Residential, commercial, villa accounts
- **Service Details**: Electricity, Water, Sewerage, District Cooling
- **Outstanding Dues**: Account-level and total balance tracking
- **Account Health**: 0-100 score with status indicators (Excellent/Good/Warning/Critical)
- **Open Requests**: Real-time ticket tracking with status

### 4. AI-Powered Predictions & Insights
- **Bill Prediction**: ML-based forecasting with confidence scores (80-90% accuracy)
- **Consumption Analysis**: Trend detection, variance calculation, pattern recognition
- **Personalized Recommendations**: 3-4 context-specific energy-saving tips per customer
- **Proactive Alerts**: AI detects anomalies before customers notice
- **Historical Visualization**: 8 months of consumption data with dual Y-axis charts (AED + kWh)

### 5. Proactive Request Guidance
- **Duplicate Detection**: Checks for existing open tickets
- **AI Request Analysis**: Analyzes customer data before submission
- **Smart Recommendations**: Suggests solutions based on historical patterns
- **Confidence Scoring**: High confidence (>80%) = auto-resolve, Low = escalate to agent
- **Request Type Explanations**: Dropdown selection triggers AI explanation of common causes
- **Multi-Channel Parity**: Same guidance quality in web form and chat

### 6. Omnichannel Chatbot (Voice + Text)
- **Voice Input**: Web Speech API (Speech-to-Text)
- **Voice Output**: Text-to-Speech with natural voices
- **Intent Classification**: Real-time query categorization (billing, service, outage, general)
- **Context Awareness**: Full customer history available in every interaction
- **Ticket Tracking**: Query and track request status via chat
- **Request Submission**: Complete complaint flow within chat interface
- **Empathy Engine**: Humanized, name-personalized responses

### 7. Comprehensive Ticket Management
- **Persistent Storage**: tickets.json with full metadata
- **Status Tracking**: Pending, In Progress, Resolved
- **Priority Classification**: High, Medium, Low (AI-assisted)
- **AI Metadata**: Includes guidance confidence, recommendations, analysis
- **Multi-Channel Access**: Track via web dashboard or chat
- **Timestamp Tracking**: Created, updated, resolved timestamps

### 8. Cost Savings Analytics Dashboard
- **Total Savings**: AED calculation with traditional vs. AI cost comparison
- **Cost Per Call**: Human agent (AED 25) vs. AI (AED 0.50)
- **Call Deflection Rate**: Percentage of issues resolved without escalation
- **Projections**: Monthly and yearly savings forecasts
- **Agent Capacity**: Equivalent FTE agents freed by AI automation
- **ROI Tracking**: Clear business value metrics for executives

### 9. Integrated Bill Payment
- **DEWA Portal**: Embedded iframe (https://www.dewa.gov.ae/consumer/billing/easypay)
- **Seamless UX**: In-app payment without external redirects
- **Security**: Sandbox isolation, no credential storage
- **Easy Navigation**: One-click return to dashboard
- **Future**: Direct API integration, payment status tracking

### 10. Unified AI Brain Architecture
- **Central Orchestrator**: Coordinates all AI modules (intent, empathy, proactive, prediction)
- **OpenAI Integration**: GPT-3.5-turbo for advanced analysis
- **Rule-Based Fallback**: Local algorithms when OpenAI unavailable
- **Sentiment Analysis**: Detects urgency and emotional tone
- **Knowledge Graph**: Entity linking for DEWA-specific context
- **Continuous Learning**: ai-logs.json tracks all interactions for improvement

## 🔧 API Endpoints

### Authentication
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/login` | POST | Authenticate user (email + password) | No |
| `/api/auth/verify-otp` | POST | Verify OTP code for MFA | No |
| `/api/auth/resend-otp` | POST | Resend OTP to user's email | No |
| `/health` | GET | Health check endpoint | No |

### Customer Services
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/customer/summary/:id` | GET | Get customer 360 view with AI insights | Yes (JWT) |

### Proactive Guidance
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/proactive/guidance` | POST | Get AI guidance before submission | Yes (JWT) |
| `/api/proactive/explain-request` | POST | Explain request type with AI | Yes (JWT) |

### Chatbot
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/chatbot/query` | POST | Process chat query with AI brain | Yes (JWT) |
| `/api/chatbot/submit-request` | POST | Submit request via chat | Yes (JWT) |

### Back-Office & Tickets
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/backoffice/submit` | POST | Create new ticket | Yes (JWT) |
| `/api/backoffice/tickets` | GET | List all tickets with filters | Yes (JWT) |
| `/api/backoffice/analytics` | GET | Get dashboard metrics & cost savings | Yes (JWT) |

### Request/Response Examples

#### POST /api/auth/login
```json
// Request
{
  "email": "ahmed@example.com",
  "password": "password123",
  "language": "en"
}

// Response (MFA Required)
{
  "requiresMFA": true,
  "expiresIn": 5,
  "message": "OTP sent to your email"
}
```

#### POST /api/proactive/guidance
```json
// Request
{
  "customerId": "C12345",
  "requestType": "billing_inquiry",
  "description": "My bill is higher than usual"
}

// Response
{
  "confidence": 0.85,
  "shouldSubmit": false,
  "analysis": {
    "billingSummary": {
      "currentBill": "450",
      "avgBill": "380",
      "variance": "18.4%"
    },
    "consumptionInsights": {
      "trend": "increasing",
      "spike": true,
      "possibleReasons": ["AC usage", "Pool pump"]
    }
  },
  "recommendations": [
    "Check AC thermostat settings",
    "Review pool pump timer"
  ]
}
```

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

### Frontend
- **Framework**: React 18.2.0 (Functional Components + Hooks)
- **Build Tool**: Vite 5.0.11 (Fast HMR, optimized bundling)
- **Routing**: React Router v6 (Client-side routing with guards)
- **HTTP Client**: Axios 1.x (API communication with interceptors)
- **Charts**: Recharts 2.x (Consumption visualization, dual Y-axis)
- **Internationalization**: react-i18next 13.x (5 namespaces: common, chatbot, customerSummary, dashboard, requestForm)
- **Styling**: Tailwind CSS 3.x (Utility-first CSS framework)
- **RTL Support**: tailwindcss-rtl 0.9.x (Arabic language layout)
- **State Management**: React Context API (Language, Authentication)
- **Voice**: Web Speech API (Speech-to-Text & Text-to-Speech)
- **Icons**: Native Emoji (Accessibility-friendly)

### Backend
- **Runtime**: Node.js 18+ with ES Modules
- **Framework**: Express.js 4.x (RESTful API server)
- **Authentication**: 
  - jsonwebtoken 9.x (JWT tokens: access 8h, refresh 7d)
  - bcrypt 5.x (Password hashing with 10 salt rounds)
  - Custom OTP service (6-digit codes, 5-minute expiration)
- **Email**: Nodemailer 6.x (OTP delivery, SMTP/Gmail integration)
- **Logging**: Winston 3.x (Structured JSON logging, error.log + combined.log)
- **AI/ML**: OpenAI 4.x (GPT-3.5-turbo with rule-based fallback)
- **CORS**: cors 2.x (Cross-origin resource sharing)
- **Environment**: dotenv 16.x (Environment variable management)
- **Data Storage**: JSON files (customers.json, tickets.json, ai-logs.json)
  - Future: PostgreSQL/MongoDB/Azure Cosmos DB

### AI & Integration Services

#### OpenAI Integration
- **Model**: GPT-3.5-turbo
- **Use Cases**:
  - Advanced consumption analysis and trend detection
  - Bill prediction with ML-enhanced forecasting
  - Personalized energy-saving recommendations
  - Natural language understanding for complex queries
  - Context-aware customer responses
- **Configuration**:
  - Temperature: 0.7 (Balanced creativity/accuracy)
  - Max Tokens: 500
  - Fallback: Rule-based AI algorithms (pattern matching, keyword analysis)
- **Cost Optimization**: Caching frequent queries, rule-based pre-filtering

#### Email Service (Nodemailer)
- **Purpose**: MFA OTP delivery, notifications
- **Provider**: Gmail (dev), SendGrid (production recommended)
- **Features**: HTML templates, bilingual support (EN/AR)
- **Security**: App-specific passwords, encrypted connections

#### DEWA Payment Portal
- **URL**: https://www.dewa.gov.ae/consumer/billing/easypay
- **Integration**: Embedded iframe with sandbox security
- **Future**: Direct API integration, payment webhooks, transaction sync

#### Web Speech API
- **Speech-to-Text**: Browser native (Chrome/Edge)
- **Text-to-Speech**: Browser native with voice selection
- **Languages**: English, Arabic
- **Fallback**: Text-only input/output

### DevOps & Deployment
- **Containerization**: Docker + docker-compose
- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **Documentation**: Markdown (README, ARCHITECTURE, ENHANCEMENTS, TESTING_GUIDE)
- **Future CI/CD**: GitHub Actions, Azure DevOps

### Security
- **Authentication**: Multi-Factor Authentication (MFA) with email OTP
- **Password Storage**: bcrypt hashing (cost factor 10)
- **API Security**: JWT token validation on all protected routes
- **CORS**: Configured for trusted origins
- **Audit Logging**: Winston structured logs with timestamps
- **Secrets**: Environment variables (.env, never committed)
- **Future**: Azure Key Vault, encryption at rest, GDPR compliance

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
