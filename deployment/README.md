# Deployment Guide

This project supports multiple deployment options to suit different needs:

## 1. Google Cloud Run (Backend Services)

Located in `/deployment/cloudrun/`

### Features
- Multi-stage Docker builds for optimal image size
- Automatic scaling (1-10 instances)
- Resource limits and requests configured
- Health checks and startup probes
- Security hardening (non-root user, security contexts)

### Deployment Steps
1. Set up Google Cloud project and enable Cloud Run
2. Build and push the Docker image:
   ```bash
   gcloud builds submit --config cloudrun/cloudbuild.yaml
   ```
3. Deploy the service:
   ```bash
   gcloud run deploy voiceai-service --image gcr.io/PROJECT-ID/voiceai-service
   ```

## 2. Render (Backend Alternative)

Located in `/deployment/render/`

### Features
- Automatic deployments from Git
- Configured scaling (1-3 instances)
- Persistent disk storage
- Health check monitoring

### Deployment Steps
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the configuration from `render.yaml`
4. Configure environment variables in Render dashboard

## 3. Netlify (Admin Dashboard)

Located in `/deployment/netlify/admin/`

### Features
- Optimized build configuration
- Security headers configured
- SPA routing support
- Development environment settings

### Deployment Steps
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm ci && npm run build`
   - Publish directory: `build`
3. Set environment variables in Netlify dashboard

## Environment Variables

Each deployment environment requires the following environment variables:

```
NODE_ENV=production
PORT=8080
API_KEY=your_api_key
DATABASE_URL=your_db_url
```

## Security Considerations

1. All deployments use HTTPS
2. Admin dashboard has security headers configured
3. Docker containers run as non-root
4. Resource limits are set to prevent DoS
5. Health checks are configured for all services

## Monitoring

- Cloud Run: Use Cloud Monitoring
- Render: Built-in metrics and logging
- Netlify: Analytics and deploy logs

## Troubleshooting

1. Health Check Failures
   - Verify the `/health` endpoint is responding
   - Check application logs
   - Ensure proper resource allocation

2. Build Failures
   - Verify Node.js version compatibility
   - Check for missing dependencies
   - Review build logs

3. Performance Issues
   - Monitor resource usage
   - Check scaling configurations
   - Review application metrics

## Support

For deployment issues:
1. Check the respective platform's status page
2. Review application logs
3. Contact platform support
4. Raise an issue in the project repository 