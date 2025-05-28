# Development Guide

## Prerequisites

- Node.js (v18.x or later)
- Docker & Docker Compose
- PostgreSQL (v14 or later)
- Redis (v6 or later)
- OpenAI API key
- SignalWire credentials
- Deepgram API key

## Project Structure

```
ai-voice-calling-agent/
├── admin-dashboard/    # React admin interface
├── client/            # React client application
├── server/            # Node.js backend
├── shared/            # Shared types and utilities
├── deployment/        # Deployment configurations
├── monitoring/        # Monitoring setup
├── tests/            # Test suites
└── docker/           # Docker configurations
```

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/ai-voice-calling-agent.git
cd ai-voice-calling-agent
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm run bootstrap
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cp server/.env.example server/.env
cp admin-dashboard/.env.example admin-dashboard/.env
cp client/.env.example client/.env
```

4. Start development environment:
```bash
# Start all services with Docker
docker-compose up -d

# Start development servers
npm run dev
```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `release/*`: Release preparation

### Code Style
We use ESLint and Prettier for code formatting:
```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

### Type Checking
```bash
# Check types
npm run type-check

# Watch mode
npm run type-check:watch
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=auth

# Watch mode
npm run test:watch
```

### Database Migrations

```bash
# Create a new migration
npm run migration:create -- --name add_user_preferences

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Building for Production

```bash
# Build all packages
npm run build

# Build specific package
npm run build --scope=@voiceai/server
```

## Debugging

### Backend Debugging
1. Use the built-in debugging configuration in VSCode
2. Set breakpoints in your code
3. Start the debugger with F5

### Frontend Debugging
1. Use React Developer Tools
2. Use the browser's developer tools
3. Enable source maps in webpack configuration

## Common Issues & Solutions

### Database Connection Issues
1. Check PostgreSQL service is running
2. Verify connection string in `.env`
3. Ensure database user has proper permissions

### API Authentication Failures
1. Check JWT token expiration
2. Verify secret keys match in all services
3. Confirm CORS settings

### Voice Call Problems
1. Check SignalWire credentials
2. Verify network connectivity
3. Monitor call logs in dashboard

## Performance Optimization

### Frontend
- Implement code splitting
- Use React.lazy for component loading
- Optimize images and assets
- Enable caching strategies

### Backend
- Use connection pooling
- Implement request caching
- Optimize database queries
- Use appropriate indexes

## Monitoring & Logging

### Local Development
- Use `debug` package for detailed logs
- Monitor API responses with Postman
- Check Docker container logs

### Production
- Set up Prometheus metrics
- Configure Grafana dashboards
- Use ELK stack for log aggregation

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Write clear commit messages
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## Security Best Practices

1. Never commit sensitive data
2. Use environment variables
3. Implement rate limiting
4. Validate all inputs
5. Use prepared statements
6. Keep dependencies updated

## Resources

- [Project Wiki](https://github.com/your-org/ai-voice-calling-agent/wiki)
- [API Documentation](./API.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Support

- Create an issue in the repository
- Contact the development team
- Check existing documentation