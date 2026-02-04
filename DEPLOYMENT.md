# Deployment Guide: Cookie Counter v4

This guide documents the manual deployment process for the Cookie Counter application to Google Cloud Run.

## Prerequisites
- **Google Cloud SDK (`gcloud`)** installed and authenticated.
- **Docker** installed and running.
- **Node.js Environment** (for local development).
- **Supabase Project** with URL and Anon Key.

## Configuration Overview
- **Project ID**: `cookie-counter-v4-2026`
- **Region**: `us-central1`
- **Repository**: `cookie-counter-artifactory`
- **Service Name**: `cookie-counter-v4`
- **Port**: `8080` (configured in `server/index.ts` and `Dockerfile`)

## Step-by-Step Deployment

### 1. Build the Docker Image
**Critical**: You must build for `linux/amd64` platform for Cloud Run compatibility. You also need to pass the Supabase credentials as build arguments so they are baked into the React client.

```bash
# Replace with your actual Supabase keys
docker build --platform linux/amd64 \
  --build-arg VITE_SUPABASE_URL=your_supabase_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_supabase_anon_key \
  -t us-central1-docker.pkg.dev/cookie-counter-v4-2026/cookie-counter-artifactory/cookie-counter-v4:latest .
```

### 2. Push to Artifact Registry
Push the built image to Google's container registry.

```bash
# Configure auth if needed (run once)
# gcloud auth configure-docker us-central1-docker.pkg.dev

docker push us-central1-docker.pkg.dev/cookie-counter-v4-2026/cookie-counter-artifactory/cookie-counter-v4:latest
```

### 3. Deploy to Cloud Run
Deploy the image as a serverless container. You must inject the Supabase keys again as environment variables for the Node.js server (though currently only `PORT` is strictly required by the server, it's good practice to keep them synced).

```bash
gcloud run deploy cookie-counter-v4 \
  --image us-central1-docker.pkg.dev/cookie-counter-v4-2026/cookie-counter-artifactory/cookie-counter-v4:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="SUPABASE_URL=your_url,SUPABASE_ANON_KEY=your_key"
```


