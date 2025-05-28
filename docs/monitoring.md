# VoiceAI Monitoring Guide

## Overview

This document outlines the monitoring setup for the VoiceAI platform, covering metrics collection, logging, and alerting configurations.

## Components

### 1. Metrics Collection (Prometheus)

- **Base Metrics**
  - API endpoints performance
  - Node system metrics
  - Container metrics (cAdvisor)
  - Database metrics (PostgreSQL)
  - Message queue metrics (RabbitMQ)
  - Cache metrics (Redis)

- **Custom Business Metrics**
  - Call success rate
  - Voice recognition accuracy
  - Agent response time
  - User satisfaction scores

### 2. Logging System (Winston)

- **Log Levels**
  - ERROR: System errors requiring immediate attention
  - WARN: Potential issues or degraded performance
  - INFO: Normal operation events
  - DEBUG: Detailed information for development

- **Log Storage**
  - Local rotating files (development)
  - Google Cloud Logging (production)
  - Error-specific logs
  - Exception and rejection handlers

### 3. Alerting System

- **Alert Channels**
  - Slack for non-critical notifications
  - PagerDuty for critical alerts

- **Alert Categories**
  - High Error Rate (>1%)
  - API Latency (>1000ms)
  - Resource Usage (CPU >80%, Memory >85%)
  - Business Metrics Anomalies

## Deployment

### Prerequisites

1. Set up environment variables:
   ```bash
   SLACK_ALERT_WEBHOOK=<webhook_url>
   PAGERDUTY_KEY=<integration_key>
   PROMETHEUS_USER=<username>
   PROMETHEUS_PASSWORD=<password>
   GOOGLE_CLOUD_PROJECT=<project_id>
   ```

2. Configure storage:
   ```bash
   mkdir -p /var/log/voiceai
   mkdir -p /etc/prometheus/rules
   ```

### Installation

1. Deploy Prometheus:
   ```bash
   docker-compose up -d prometheus
   ```

2. Deploy Alert Manager:
   ```bash
   docker-compose up -d alertmanager
   ```

3. Deploy Logging:
   ```bash
   docker-compose up -d logging
   ```

## Best Practices

1. **Metric Collection**
   - Keep collection intervals consistent (15s recommended)
   - Use labels effectively for better querying
   - Monitor both system and business metrics

2. **Logging**
   - Use structured logging with consistent fields
   - Include relevant context in log messages
   - Rotate logs regularly to manage storage

3. **Alerting**
   - Configure appropriate thresholds based on historical data
   - Implement alert throttling to prevent alert fatigue
   - Document alert response procedures

## Grafana Dashboards

Access the Grafana dashboards at:
- Development: http://localhost:3000
- Production: https://grafana.voiceai.com

Available dashboards:
1. System Overview
2. API Performance
3. Business Metrics
4. Error Tracking

## Troubleshooting

Common issues and solutions:

1. **High Memory Usage**
   - Check log rotation settings
   - Verify proper garbage collection
   - Review memory limits

2. **Missing Metrics**
   - Verify Prometheus targets
   - Check service discovery
   - Validate scrape configs

3. **Alert Delays**
   - Review alert manager configuration
   - Check notification channel settings
   - Verify network connectivity

## Contact

For monitoring-related issues:
- Slack: #voiceai-monitoring
- Email: monitoring@voiceai.com

## Updates and Maintenance

Regular maintenance tasks:
1. Review and update alert thresholds monthly
2. Clean up old logs weekly
3. Validate backup systems
4. Update monitoring documentation 