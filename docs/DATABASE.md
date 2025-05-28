3. **database.md**
```markdown
# Database Documentation

## Overview
This document outlines the database architecture, schema, and management procedures for the AI Voice Calling Agent system. We use PostgreSQL with TimescaleDB extension for time-series data handling.

## Connection Configuration

### Environment Variables
```bash
# Required database configuration
DATABASE_URL=postgres://user:password@host:5432/voiceai
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_IDLE_TIMEOUT=10000
DATABASE_CONNECTION_TIMEOUT=2000
```

### Connection Pool Setup
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '10000'),
  connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '2000'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
});
```

## Schema Definition

### Core Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

#### calls
```sql
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_number VARCHAR(20) NOT NULL,
    to_number VARCHAR(20) NOT NULL,
    duration INTERVAL,
    status VARCHAR(50) NOT NULL DEFAULT 'initiated',
    recording_url TEXT,
    transcript TEXT,
    sentiment_score FLOAT,
    cost_cents INTEGER,
    agent_id UUID REFERENCES agents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    CONSTRAINT valid_phone_numbers CHECK (
        from_number ~* '^\+[1-9]\d{1,14}$' AND
        to_number ~* '^\+[1-9]\d{1,14}$'
    )
);

-- Time-series hypertable conversion
SELECT create_hypertable('calls', 'created_at');
```

#### agents
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    voice_model VARCHAR(100) NOT NULL,
    language VARCHAR(10)[] NOT NULL DEFAULT ARRAY['en-US'],
    context_prompt TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    success_rate FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb
);
```

#### call_events
```sql
CREATE TABLE call_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES calls(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_event_type CHECK (
        event_type IN ('initiation', 'answer', 'transcription', 'response', 'error', 'termination')
    )
);

-- Time-series hypertable conversion
SELECT create_hypertable('call_events', 'created_at');
```

### Indexes

```sql
-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Calls indexes
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_from_number ON calls(from_number);
CREATE INDEX idx_calls_to_number ON calls(to_number);
CREATE INDEX idx_calls_agent_id ON calls(agent_id);

-- Agents indexes
CREATE INDEX idx_agents_active ON agents(active);
CREATE INDEX idx_agents_voice_model ON agents(voice_model);
CREATE INDEX idx_agents_success_rate ON agents(success_rate DESC);

-- Call events indexes
CREATE INDEX idx_call_events_call_id ON call_events(call_id);
CREATE INDEX idx_call_events_type ON call_events(event_type);
CREATE INDEX idx_call_events_created_at ON call_events(created_at DESC);
```

## Migrations

### Migration Management
We use `node-pg-migrate` for database migrations.

```bash
# Create a new migration
npm run migration:create -- --name add_user_preferences

# Run pending migrations
npm run migration:up

# Rollback last migration
npm run migration:down

# Show migration status
npm run migration:status
```

### Example Migration
```typescript
import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Add new column
  pgm.addColumn('calls', {
    customer_feedback: {
      type: 'text',
      comment: 'Customer feedback for the call',
    },
  });
  
  // Create index
  pgm.createIndex('calls', 'customer_feedback');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Remove index
  pgm.dropIndex('calls', 'customer_feedback');
  
  // Remove column
  pgm.dropColumn('calls', 'customer_feedback');
}
```

## Backup & Recovery

### Automated Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/postgresql"
DATABASE="voiceai"

# Create backup
pg_dump -Fc $DATABASE > "$BACKUP_DIR/$DATABASE_$DATE.dump"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$DATABASE_$DATE.dump" \
    "s3://voiceai-backups/postgresql/$DATABASE_$DATE.dump"

# Cleanup old backups
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Backup Strategy
1. Daily automated backups
2. Point-in-time recovery (PITR) enabled
3. Cross-region replication for disaster recovery
4. 30-day retention period
5. Encrypted backups using KMS

### Recovery Procedures
```bash
# Restore from backup
pg_restore -d voiceai_new backup_file.dump

# Point-in-time recovery
SELECT pg_wal_replay_resume();
```

## Performance Optimization

### Query Optimization

#### Example Optimized Queries
```sql
-- Efficient call history query
SELECT 
    c.id,
    c.from_number,
    c.to_number,
    c.duration,
    c.status,
    a.name as agent_name,
    ce.event_data->'transcription' as transcription
FROM calls c
LEFT JOIN agents a ON c.agent_id = a.id
LEFT JOIN LATERAL (
    SELECT event_data
    FROM call_events
    WHERE call_id = c.id
    AND event_type = 'transcription'
    ORDER BY created_at DESC
    LIMIT 1
) ce ON true
WHERE c.created_at > NOW() - INTERVAL '24 hours'
AND c.status = 'completed';

-- Efficient analytics query
SELECT 
    time_bucket('1 hour', created_at) AS hour,
    COUNT(*) as call_count,
    AVG(EXTRACT(EPOCH FROM duration)) as avg_duration_seconds
FROM calls
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour DESC;
```

### Maintenance Tasks
```sql
-- Regular VACUUM
VACUUM ANALYZE calls;
VACUUM ANALYZE call_events;

-- Update statistics
ANALYZE calls;
ANALYZE call_events;

-- Reindex for better performance
REINDEX TABLE calls;
REINDEX TABLE call_events;
```

## Monitoring & Alerts

### Key Metrics
1. Connection pool utilization
2. Query performance
3. Table/index size
4. Transaction throughput
5. Lock contention
6. Cache hit ratio

### Monitoring Queries
```sql
-- Connection status
SELECT * FROM pg_stat_activity;

-- Index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes;

-- Table statistics
SELECT 
    relname,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables;
```

## Security

### Access Control
```sql
-- Create read-only user
CREATE ROLE readonly_user WITH 
    LOGIN
    PASSWORD 'secure_password'
    CONNECTION LIMIT 5;

-- Grant permissions
GRANT CONNECT ON DATABASE voiceai TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### Security Best Practices
1. Use SSL/TLS for connections
2. Regular security audits
3. Password rotation
4. IP whitelisting
5. Row-level security
6. Audit logging

## Troubleshooting

### Common Issues

1. Connection Issues
```sql
-- Check current connections
SELECT COUNT(*) FROM pg_stat_activity;

-- Kill long-running queries
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active'
AND state_change < NOW() - INTERVAL '1 hour';
```

2. Performance Issues
```sql
-- Find slow queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

3. Lock Issues
```sql
-- Check for locks
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.usename AS blocked_user,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype;
```

## Support

### Internal Resources
- Database Team: db-team@yourdomain.com
- Documentation: /internal/docs/database
- Monitoring: /grafana/postgresql

### External Resources
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TimescaleDB Documentation](https://docs.timescale.com/)