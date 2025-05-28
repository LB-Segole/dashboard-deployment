# VoiceAI Client

This is the client application for the VoiceAI voice calling agent system. It provides a modern, responsive web interface for managing AI-powered voice calls.

## Features

- Real-time voice call management
- Dashboard with call analytics
- Call history and recordings
- Agent configuration
- WebSocket-based real-time communication
- Error tracking and monitoring
- TypeScript support
- Modern React patterns and hooks
- Responsive design with Tailwind CSS
- Authentication and authorization
- Protected routes
- Form validation with Zod
- Testing with Jest and React Testing Library

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- A running instance of the VoiceAI server

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/ai-voice-calling-agent.git
cd ai-voice-calling-agent/client
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment configuration:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your configuration.

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run validate` - Run all validation checks
- `npm run analyze` - Analyze bundle size

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── context/       # React context providers
  ├── hooks/         # Custom React hooks
  ├── pages/         # Page components
  ├── services/      # API and external services
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── App.tsx        # Root component
  └── index.tsx      # Entry point
```

## Code Quality

The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Jest and React Testing Library for testing
- Husky for git hooks
- lint-staged for staged files linting

## Authentication

The application implements a secure authentication system with:
- JWT-based authentication
- Protected routes
- Automatic token refresh
- Persistent sessions
- Form validation
- Error handling

## Error Handling

The application includes:
- Global error boundary
- Error tracking with Sentry
- WebSocket error handling
- API error handling
- TypeScript type safety
- Form validation errors

## Performance

Performance optimizations include:
- React Query for data fetching and caching
- Code splitting with React.lazy
- Bundle size optimization
- Web Vitals monitoring
- Performance tracking

## Docker Support

Build the Docker image:
```bash
docker build -t voiceai-client .
```

Run the container:
```bash
docker run -p 3000:3000 voiceai-client
```

## Testing

Run the test suite:
```bash
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 