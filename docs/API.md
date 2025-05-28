1. api.md
markdown
# AI Voice Calling Agent API Documentation

## Base URL
```
Production: https://api.voiceai.example.com/v1
Staging: https://api-staging.voiceai.example.com/v1
```

## Authentication
All API requests require authentication using a JWT token. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.voiceai.example.com/v1/calls
```

## Rate Limiting
- 100 requests per minute per API key
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## API Endpoints

### Calls

#### Create a Call
```http
POST /calls
```

Request Body:
```json
{
  "to_number": "+15551234567",
  "from_number": "+15557654321",
  "voice_model": "enhanced",
  "context": "sales_pitch",
  "language": "en-US",
  "callback_url": "https://your-domain.com/callback",
  "custom_parameters": {
    "customer_id": "cust_123",
    "campaign_id": "camp_456"
  }
}
```

Response:
```json
{
  "call_id": "call_abc123",
  "status": "initiated",
  "created_at": "2024-03-20T10:30:00Z",
  "estimated_duration": "120"
}
```

#### Get Call Details
```http
GET /calls/{call_id}
```

Response:
```json
{
  "call_id": "call_abc123",
  "status": "completed",
  "duration": 65,
  "transcription": "...",
  "sentiment_analysis": {
    "overall": "positive",
    "confidence": 0.89
  },
  "metrics": {
    "words_per_minute": 150,
    "silence_percentage": 12
  }
}
```

#### List Calls
```http
GET /calls
```

Query Parameters:
- `status` (optional): Filter by call status
- `from_date` (optional): ISO 8601 date
- `to_date` (optional): ISO 8601 date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

### Agents

#### List Agents
```http
GET /agents
```

Response:
```json
{
  "agents": [
    {
      "id": "agent_123",
      "name": "Sales Assistant",
      "voice_type": "feminine",
      "language": ["en-US", "es-ES"],
      "active": true,
      "success_rate": 0.95
    }
  ],
  "total": 10,
  "page": 1
}
```

#### Create Agent
```http
POST /agents
```

Request Body:
```json
{
  "name": "Customer Support",
  "voice_type": "masculine",
  "language": ["en-US"],
  "personality": "professional",
  "script_templates": ["support_intro", "problem_resolution"],
  "working_hours": {
    "timezone": "UTC",
    "schedule": {
      "monday": ["09:00-17:00"]
    }
  }
}
```

### Analytics

#### Get Call Statistics
```http
GET /analytics/calls
```

Query Parameters:
- `timeframe`: "daily" | "weekly" | "monthly"
- `from_date`: ISO 8601 date
- `to_date`: ISO 8601 date

Response:
```json
{
  "total_calls": 1000,
  "success_rate": 0.85,
  "average_duration": 180,
  "sentiment_breakdown": {
    "positive": 65,
    "neutral": 25,
    "negative": 10
  }
}
```

## Error Codes

| Code | Description                       | Solution                                     |
|------|-----------------------------------|----------------------------------------------|
| 400  | Bad Request                       | Check request parameters                     |
| 401  | Unauthorized                      | Verify authentication token                  |
| 403  | Forbidden                         | Check access permissions                     |
| 404  | Resource Not Found               | Verify resource ID                          |
| 429  | Too Many Requests                | Implement rate limiting                     |
| 500  | Internal Server Error            | Contact support with error ID              |

## Webhooks

### Call Status Updates
```http
POST {your_callback_url}
```

Example Payload:
```json
{
  "event_type": "call.completed",
  "call_id": "call_abc123",
  "timestamp": "2024-03-20T10:35:00Z",
  "data": {
    "duration": 65,
    "outcome": "success",
    "recording_url": "https://storage.example.com/recordings/abc123.mp3"
  }
}
```

## SDK Support
- Node.js: [@voiceai/node-sdk](https://github.com/voiceai/node-sdk)
- Python: [@voiceai/python-sdk](https://github.com/voiceai/python-sdk)
- Java: [@voiceai/java-sdk](https://github.com/voiceai/java-sdk)

## Additional Resources
- [API Changelog](/changelog)
- [Integration Guide](/guides/integration)
- [Best Practices](/guides/best-practices)
- [Sample Applications](/samples)