#!/bin/bash
set -e

PROJECT="voiceai-prod"
SERVICE="voiceai-api"
REGION="us-central1"

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE \
  --project $PROJECT \
  --region $REGION \
  --image gcr.io/$PROJECT/$SERVICE \
  --platform managed \
  --set-env-vars "API_KEY=${VOICEAI_API_KEY}"

echo "Deployment complete"