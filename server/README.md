# VoiceAI Server

The server component of the VoiceAI calling agent application.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env` file):

```bash
# Required in production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
OPENAI_API_KEY=your-api-key
SIGNALWIRE_PROJECT_ID=your-project-id
SIGNALWIRE_TOKEN=your-token
SIGNALWIRE_SPACE=your-space
SIGNALWIRE_PHONE_NUMBER=+1234567890

# Optional with defaults
PORT=3000
HOST=localhost
CORS_ORIGIN=http://localhost:3000
DB_SSL=false
DB_POOL_SIZE=10
REDIS_TLS=false
```

3. Start development server:
```bash
npm run dev
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Features

- JWT Authentication
- WebSocket Support
- Rate Limiting
- Error Handling
- Input Validation
- Monitoring
- Health Checks
- Database Migrations
- Redis Caching
- OpenAI Integration
- SignalWire Integration

## API Documentation

Available at `/api/docs` when server is running.

## Health Check

Available at `/health`.

## Directory Structure

```
server/
├── src/
│   ├── config/        # Configuration
│   ├── controllers/   # Route controllers
│   ├── database/      # Database setup
│   ├── errors/        # Error handling
│   ├── hooks/         # Reusable hooks
│   ├── middleware/    # Express middleware
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utilities
│   └── websocket/     # WebSocket handling
├── tests/             # Test files
└── docs/              # Documentation
```

## License

MIT 