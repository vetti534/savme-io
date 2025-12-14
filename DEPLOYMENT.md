# Deployment Guide for Savme.io (Static + PHP)

This guide is for hosting Savme.io on **Shared Hosting (like Hostinger, Bluehost, GoDaddy)** where you have access to PHP but not Node.js.

## Overview
- **Type**: Static HTML Website
- **Backend**: Single PHP file (`gemini-proxy.php`) for AI features.
- **Folder**: `savme-deploy`

## Step 1: Build the Project
We have created an automated script for you.

1.  Navigate to your project folder: `c:\Users\sures\OneDrive\Desktop\FOLDERS\savme.io`
2.  Double-click **`build_project_v2.bat`**.
    *   This will run `npm run build` and generate an `out` folder.
3.  Double-click **`prepare_deploy.bat`**.
    *   This will create a final **`savme-deploy`** folder on your desktop (or project root).

## Step 2: Upload to Server

1.  Open your Hosting File Manager (Hostinger hPanel -> Files -> File Manager).
2.  Go to **`public_html`**.
3.  **Upload** all files from inside the **`savme-deploy`** folder here.
    *   *Note: If `public_html` has default files like `default.php`, delete them first.*

## Step 3: Configure AI (Important)

The AI features use a small PHP script `gemini-proxy.php`. You need to add your API Key to it.

1.  In your File Manager, find **`gemini-proxy.php`**.
2.  Right-click and select **Edit**.
3.  Find this line at the top:
    ```php
    $API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
    ```
4.  Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API Key.
5.  **Save** the file.

## Troubleshooting

- **404 Not Found**: Ensure you uploaded the files directly into `public_html`, not inside a subfolder.
- **AI Not Working**: Check if `gemini-proxy.php` has the correct API Key. Open `yourdomain.com/gemini-proxy.php` in browser; if it says "Method Not Allowed", it is working correctly (it expects POST requests).
