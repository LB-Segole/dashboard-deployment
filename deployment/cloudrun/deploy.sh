#!/bin/bash

# Set project ID
PROJECT_ID="your-project-id"

# Build and push Docker image
gcloud builds submit --tag gcr.io/$PROJECT_ID/voiceai-service

# Deploy to Cloud Run
gcloud run deploy voiceai-service \
  --image gcr.io/$PROJECT_ID/voiceai-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated