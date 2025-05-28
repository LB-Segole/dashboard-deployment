<<<<<<< HEAD
# VoiceAI - AI Voice Calling Agent Platform

A production-ready SaaS platform for AI-powered voice calling agents using SignalWire, OpenAI, and modern web technologies.

## 🚀 Features

- Real-time AI voice conversations
- Text-to-Speech and Speech-to-Text integration
- OpenAI-powered conversation intelligence
- Admin dashboard for call monitoring
- Scalable architecture with Docker
- Real-time analytics and reporting

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Cache**: Redis
- **AI Services**: OpenAI GPT-4, SignalWire
- **Infrastructure**: Docker, Nginx

## 📦 Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose
- SignalWire Account and API Keys
- OpenAI API Key
- MongoDB (local or cloud)
- Redis (local or cloud)

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

4. Start development servers:
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
npm run docker:up
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=production
PORT=3000
API_URL=http://localhost:4000

# Database
MONGODB_URI=mongodb://root:example@db:27017/voiceai?authSource=admin

# Redis
REDIS_URL=redis://redis:6379

# SignalWire
SIGNALWIRE_PROJECT_ID=your_project_id
SIGNALWIRE_TOKEN=your_token
SIGNALWIRE_SPACE=your_space

# OpenAI
OPENAI_API_KEY=your_openai_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 🧪 Testing

```bash
# Run all tests
npm run test:ci

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e
```

## 📈 Monitoring

The platform includes built-in monitoring with:
- Error tracking
- Performance metrics
- Call quality monitoring
- System health checks

Access the monitoring dashboard at: `http://localhost:3001/monitoring`

## 🔒 Security

- All API endpoints are authenticated
- Rate limiting implemented
- Data encryption in transit and at rest
- Regular security audits
- GDPR compliant data handling

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@voiceai.com or join our Slack community.
=======
# Final-SaaS
>>>>>>> b2dba505d10e562bc578755b68644aee5ecd734e
