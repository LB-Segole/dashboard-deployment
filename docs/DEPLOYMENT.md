5. **deployment.md**
```markdown
# Deployment Guide

This guide covers the deployment process for the AI Voice Calling Agent system across different environments.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (for K8s deployment)
- SSL certificates
- Domain names configured
- Access to cloud provider (AWS/GCP/Azure)
- CI/CD pipeline access

## Environment Configuration

### Required Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | production | Environment name |
| DATABASE_URL | Yes | postgres://user:pass@host:5432/db | PostgreSQL connection string |
| REDIS_URL | Yes | redis://user:pass@host:6379 | Redis connection string |
| JWT_SECRET | Yes | your-secret-key | JWT signing key |
| OPENAI_API_KEY | Yes | sk-xxxxxxxxxxxxxxxx | OpenAI API key |
| DEEPGRAM_KEY | Yes | dg_xxxxxxxxxxxxxxxx | Deepgram API key |
| SIGNALWIRE_PROJECT_ID | Yes | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | SignalWire project ID |
| SIGNALWIRE_TOKEN | Yes | PTxxxxxxxxxxxxxxxx | SignalWire API token |
| CORS_ORIGINS | Yes | https://admin.yourdomain.com | Allowed CORS origins |
| LOG_LEVEL | No | info | Logging level |
| PORT | No | 3000 | Server port |

## Deployment Options

### 1. Docker Compose Deployment

Suitable for small to medium deployments or staging environments.

```bash
# Build and start production services
docker-compose -f docker/docker-compose.prod.yml up -d --build

# Monitor logs
docker-compose -f docker/docker-compose.prod.yml logs -f

# Scale specific services
docker-compose -f docker/docker-compose.prod.yml up -d --scale api=3
```

### 2. Kubernetes Deployment

Recommended for production environments with high availability requirements.

1. Configure Kubernetes context:
```bash
kubectl config use-context your-cluster-context
```

2. Create secrets:
```bash
kubectl create secret generic voiceai-secrets \
  --from-literal=database-url='postgres://user:pass@host:5432/db' \
  --from-literal=redis-url='redis://user:pass@host:6379' \
  --from-literal=jwt-secret='your-secret-key' \
  --from-literal=openai-key='sk-xxxxxxxxxxxxxxxx' \
  --from-literal=deepgram-key='dg_xxxxxxxxxxxxxxxx'
```

3. Deploy application:
```bash
# Apply configurations
kubectl apply -f deployment/k8s/

# Monitor deployment
kubectl get pods -n voiceai
kubectl logs -f -l app=voiceai-api -n voiceai
```

### 3. Cloud Provider Specific Deployments

#### AWS Deployment
1. Push Docker images to ECR
2. Deploy using ECS or EKS
3. Configure ALB/NLB
4. Set up CloudWatch monitoring

#### GCP Deployment
1. Push Docker images to Container Registry
2. Deploy using GKE
3. Configure Cloud Load Balancing
4. Set up Cloud Monitoring

## Database Management

### Migrations
```bash
# Run migrations before deployment
npm run migration:prod

# Verify migration status
npm run migration:status
```

### Backup Strategy
1. Automated daily backups
2. Point-in-time recovery enabled
3. Cross-region replication for disaster recovery

## SSL Configuration

1. Install certificates:
```bash
# Using Let's Encrypt with certbot
certbot certonly --dns-cloudflare \
  -d api.yourdomain.com \
  -d admin.yourdomain.com
```

2. Configure in Nginx/Load Balancer:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

## Monitoring & Health Checks

### Health Check Endpoints

1. API Health:
```bash
curl https://api.yourdomain.com/health
```

2. Database Health:
```bash
pg_isready -h your-db-host
```

3. Redis Health:
```bash
redis-cli -h your-redis-host ping
```

### Monitoring Setup

1. Prometheus metrics:
- System metrics
- Application metrics
- Business metrics

2. Grafana dashboards:
- System performance
- API performance
- Call metrics
- Error rates

3. Alerting:
- Set up PagerDuty/OpsGenie
- Configure alert thresholds
- Define escalation policies

## Security Considerations

1. Network Security:
- Enable WAF
- Configure DDoS protection
- Implement rate limiting

2. Application Security:
- Regular security updates
- Audit logging
- Input validation

3. Data Security:
- Encryption at rest
- Encryption in transit
- Regular security scans

## Rollback Procedures

### Docker Compose
```bash
# Rollback to previous version
docker-compose -f docker/docker-compose.prod.yml down
docker-compose -f docker/docker-compose.prod.yml up -d --build previous-version
```

### Kubernetes
```bash
# Rollback deployment
kubectl rollout undo deployment/voiceai-api -n voiceai
```

## Post-Deployment Verification

1. Verify API endpoints:
```bash
# Health check
curl https://api.yourdomain.com/health

# Auth check
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.yourdomain.com/users
```

2. Verify integrations:
- Test outbound calls
- Verify webhooks
- Check analytics

3. Monitor logs and metrics

## Troubleshooting

### Common Issues

1. Database Connection Issues:
- Check connection strings
- Verify network access
- Check SSL certificates

2. API Issues:
- Check logs
- Verify environment variables
- Check service dependencies

3. Voice Call Issues:
- Verify SignalWire configuration
- Check audio quality
- Monitor call logs

## Support and Maintenance

1. Regular Maintenance:
- Security updates
- Dependency updates
- Performance optimization

2. Backup Verification:
- Regular restore tests
- Backup integrity checks
- Recovery time objectives

3. Documentation Updates:
- Keep deployment docs updated
- Document incident responses
- Update runbooks

## Contacts

- DevOps Team: devops@yourdomain.com
- Security Team: security@yourdomain.com
- On-Call Support: oncall@yourdomain.com