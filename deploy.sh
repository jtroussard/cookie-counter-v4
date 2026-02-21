#!/bin/bash

# Deployment Script for Cookie Counter v4
# Usage: ./deploy.sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Deployment Process..."

# 1. Load Supabase Keys from server/.env for the build process
if [ -f server/.env ]; then
    export $(grep -v '^#' server/.env | xargs)
else
    echo "❌ Error: server/.env file not found. Cannot load Supabase keys."
    exit 1
fi

# Variables
PROJECT_ID="cookie-counter-v4-2026"
REGION="us-central1"
REPO="cookie-counter-artifactory"
SERVICE="cookie-counter-v4"
IMAGE_TAG="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$SERVICE:latest"

echo "🔎 Configuration:"
echo "   Project: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE"
echo "   Image: $IMAGE_TAG"

# 2. Build the Docker Image
echo "----------------------------------------------------"
echo "  Step 1: Building Docker Image (AMD64)..."
echo "----------------------------------------------------"
docker build --platform linux/amd64 \
  --build-arg VITE_SUPABASE_URL=$SUPABASE_URL \
  --build-arg VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  -t $IMAGE_TAG .

# 3. Push to Artifact Registry
echo "----------------------------------------------------"
echo "  Step 2: Pushing Image to Artifact Registry..."
echo "----------------------------------------------------"
docker push $IMAGE_TAG

# 4. Deploy to Cloud Run
echo "----------------------------------------------------"
echo "  Step 3: Deploying new revision to Cloud Run..."
echo "----------------------------------------------------"
gcloud run deploy $SERVICE \
  --image $IMAGE_TAG \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="SUPABASE_URL=$SUPABASE_URL,SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"

echo "----------------------------------------------------"
echo "  Deployment Complete!"
echo "----------------------------------------------------"
