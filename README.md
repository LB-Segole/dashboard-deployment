<<<<<<< HEAD
# VoiceAI - Enterprise AI Voice Calling Agent Platform

A production-ready SaaS platform for AI-powered voice calling agents using SignalWire, OpenAI, and modern web technologies.

## 🌟 Key Features

### Voice Calling Capabilities
- Real-time AI voice conversations using advanced TTS and STT
- Natural language processing powered by OpenAI GPT-4
- Custom voice configuration and personality settings
- Seamless live transfer to human agents
- High-quality call recording and transcription

### Campaign Management
- Bulk call campaign scheduling and execution
- Customizable time windows and call rates
- Campaign performance analytics and reporting
- A/B testing for voice configurations
- Automated retry logic and call optimization

### Built-in CRM
- Contact management with custom fields
- Call history and interaction tracking
- Contact segmentation and tagging
- Automated follow-up scheduling
- Integration with popular CRM platforms

### Enterprise Features
- Multi-tenant architecture
- Role-based access control
- Detailed audit logging
- Custom API key management
- Usage monitoring and billing

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14, React 18
- **Styling**: TailwindCSS, Shadcn UI
- **State Management**: React Query, Zustand
- **Analytics**: Posthog, LogRocket

### Backend
- **Runtime**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session and rate limiting
- **Queue**: Bull for background jobs
- **Search**: Elasticsearch for contact search

### AI Services
- **LLM**: OpenAI GPT-4
- **STT**: Deepgram
- **TTS**: SignalWire
- **Analytics**: Custom ML models for call analysis

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Grafana, Prometheus
- **Logging**: ELK Stack
- **Load Balancing**: Nginx

## 📦 Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose
- PostgreSQL >= 14
- Redis >= 6.0
- SignalWire Account and API Keys
- OpenAI API Key
- Deepgram API Key

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voiceai.git
cd voiceai
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install
cd ..

# Install server dependencies
cd server && npm install
cd ..

# Install admin dashboard dependencies
cd admin-dashboard && npm install
cd ..
```

4. Initialize the database:
```bash
cd server
npx prisma migrate dev
cd ..
```

5. Start development servers:
```bash
# Start all services with Docker
npm run docker:up

# Or start services individually:
npm run dev        # Frontend
npm run start:api  # Backend
cd admin-dashboard && npm run dev  # Admin Dashboard
```

## 🚀 Deployment

1. Build Docker images:
```bash
npm run docker:build
```

2. Start production services:
```bash
npm run docker:up:prod
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=production
PORT=3000
API_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/voiceai

# Redis
REDIS_URL=redis://localhost:6379

# SignalWire
SIGNALWIRE_PROJECT_ID=your_project_id
SIGNALWIRE_TOKEN=your_token
SIGNALWIRE_SPACE=your_space

# OpenAI
OPENAI_API_KEY=your_openai_key

# Deepgram
DEEPGRAM_API_KEY=your_deepgram_key

# Security
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Monitoring
SENTRY_DSN=your_sentry_dsn
POSTHOG_API_KEY=your_posthog_key
```

## 🧪 Testing

```bash
# Run all tests
npm run test:ci

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run load tests
npm run test:load
```

## 📈 Monitoring

The platform includes comprehensive monitoring with:
- Real-time call quality metrics
- System performance monitoring
- Error tracking and alerting
- Custom analytics dashboards
- Cost optimization insights

Access the monitoring dashboard at: `http://localhost:3001/monitoring`

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- API key management
- Rate limiting and DDoS protection
- Data encryption at rest and in transit
- Regular security audits
- GDPR and CCPA compliance
- Call recording consent management

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:
- API Documentation
- Architecture Overview
- Deployment Guide
- Security Guidelines
- User Manual
- Integration Guide

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For enterprise support:
- Email: support@voiceai.com
- Phone: +1 (555) 123-4567
- Slack Community: [Join Here](https://voiceai.slack.com)

## 📄 License

Enterprise License - Contact for details

## 🏢 Enterprise Features

- Custom deployment options
- SLA guarantees
- Priority support
- Custom integrations
- Advanced analytics
- White-label solutions
=======
# dashboard-deployment
>>>>>>> 39d32320d681ba99695afd240d334613e7c3cdce
