# Cookie Counter v4

A modernized sales and inventory management application for Girl Scouts, built with a mobile-first design.

## Features
-   **Sales Tracking**: Log and manage cookie sales on the go.
-   **Inventory Management**: Keep track of stock levels in real-time.
-   **Mobile-First UI**: Optimized for phone usage with a clean, responsive interface.
-   **Secure Authentication**: Powered by Supabase.

## Tech Stack
-   **Frontend**: React (Vite), Bootstrap 5
-   **Backend**: Node.js/Express
-   **Database**: Supabase
-   **Deployment**: Google Cloud Run (Dockerized)

## Quick Start (Local)

1.  **Install Dependencies**:
    ```bash
    npm install:all
    ```
2.  **Environment Variables**:
    Ensure you have `.env` files in `server/` and `client/` with valid Supabase credentials.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    This concurrently runs the client (Vite) and server (Express).

## Deployment

This application is containerized with Docker and deployed to Google Cloud Run.
For detailed deployment instructions, including building the image, pushing to Artifact Registry, and deploying to Cloud Run, please refer to:
👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## Future Improvements (Roadmap)

### 1. Establishing a SIT (System Integration Testing) Environment
To create a safe testing ground ("SIT"):
-   **Supabase**: Create a *separate* Supabase project (e.g., `cookie-counter-sit`). This isolates your test data from production.
-   **GCP**: Deploy a separate Cloud Run service named `cookie-counter-sit`.
-   **Process**:
    1.  Build image using SIT Supabase keys.
    2.  Push with a different tag (e.g., `:sit-latest`).
    3.  Deploy to `cookie-counter-sit` service.
    4.  Verify changes there before building for Prod.

### 2. Custom Domain (e.g., www.thecookiecounter.app)
1.  **Buy Domain**: Purchase the domain from a registrar (Google Domains, Namecheap, etc.).
2.  **Cloud Run Mapping**:
    -   Go to Cloud Run Console > Manage Custom Domains.
    -   Click "Add Mapping" and select your service (`cookie-counter-v4`).
    -   Follow verification steps (adding a TXT record to your DNS).
    -   Update your DNS 'A' and 'AAAA' records to point to the IPs provided by Google.
    -   Google automatically handles the SSL certificate (HTTPS).

### 3. CI/CD (Automation)
Currently, deployment is manual. To automate:
-   **Cloud Build**: Create a `cloudbuild.yaml` file to automate the Build -> Push -> Deploy steps whenever you push to GitHub.
-   **Triggers**: Set up a Cloud Build trigger to watch your `main` branch.
