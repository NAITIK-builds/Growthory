
# Deploying Growthory to Vercel

This guide explains how to deploy both the Client (Frontend) and Server (Backend) to Vercel.

## Prerequisites
1.  A GitHub, GitLab, or Bitbucket account.
2.  A [Vercel](https://vercel.com) account.

## Step 1: Push Code to GitHub
1.  Create a new repository on GitHub.
2.  Push your code to this repository.

## Step 2: Deploy Backend (Server)
1.  Go to your Vercel Dashboard and click **"Add New Project"**.
2.  Import your GitHub repository.
3.  **Crucial Step:** In the "Configure Project" screen:
    *   **Root Directory:** Click "Edit" and select `server`.
    *   **Environment Variables:** Add your database secrets:
        *   `SUPABASE_URL`: (Your Supabase URL)
        *   `SUPABASE_SERVICE_ROLE_KEY`: (Your Service Role Key)
        *   `PORT`: `5000` (Optional, Vercel handles this mostly)
4.  Click **Deploy**.
5.  Once deployed, copy the **Deployment URL** (e.g., `https://growthory-server.vercel.app`).

## Step 3: Deploy Frontend (Client)
1.  Go to your Vercel Dashboard again and click **"Add New Project"** (same repo).
2.  Import the same GitHub repository again.
3.  **Crucial Step:** In the "Configure Project" screen:
    *   **Root Directory:** Click "Edit" and select `client`.
    *   **Framework Preset:** It should auto-detect "Next.js".
    *   **Environment Variables:**
        *   `NEXT_PUBLIC_API_URL`: **Paste your Backend URL from Step 2** (e.g., `https://growthory-server.vercel.app/api`).
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Public Anon Key)
4.  Click **Deploy**.

## Success!
Your application is now live.
- Frontend: `https://growthory-client.vercel.app`
- Backend: `https://growthory-server.vercel.app`
