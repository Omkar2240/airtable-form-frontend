# Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Airtable Form Builder project from scratch.

## Table of Contents

1. [Prerequisites Installation](#prerequisites-installation)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Airtable OAuth Configuration](#airtable-oauth-configuration)
5. [MongoDB Setup](#mongodb-setup)
6. [Webhook Configuration](#webhook-configuration)
7. [Verification Steps](#verification-steps)

---

## Prerequisites Installation

### 1. Install Node.js

**Windows:**
1. Download Node.js LTS from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
   ```powershell
   node --version  # Should show v18.x.x or higher
   npm --version
   ```

### 2. Install pnpm

```powershell
npm install -g pnpm
pnpm --version  # Should show v8.x.x or higher
```

### 3. Install MongoDB

**Option A: MongoDB Community Edition (Local)**

1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Verify installation:
   ```powershell
   mongod --version
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Set up database user
4. Whitelist IP address (or use 0.0.0.0/0 for testing)
5. Get connection string

### 4. Install Git

1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer
3. Verify:
   ```powershell
   git --version
   ```

---

## Backend Setup

### Step 1: Clone and Navigate

```powershell
# Clone the backend repository
git clone https://github.com/Omkar2240/airtable-form-backend.git
cd airtable-form-backend

# Or navigate to existing directory
cd c:\Users\Omkar\Desktop\Airtable-form-builder\backend
```

### Step 2: Install Dependencies

```powershell
pnpm install
```

This will install:
- express (v5.1.0)
- mongoose (v9.0.0)
- axios (v1.13.2)
- cors (v2.8.5)
- dotenv (v17.2.3)
- express-session (v1.18.2)
- crypto-js (v4.2.0)
- body-parser (v2.2.1)

### Step 3: Environment Configuration

1. Copy the example environment file:
   ```powershell
   cp env.example .env
   ```

2. Edit `.env` with your favorite editor:
   ```powershell
   notepad .env
   # or
   code .env
   ```

3. Fill in the following values:

   ```env
   # ============================================
   # AIRTABLE OAUTH CREDENTIALS
   # ============================================
   # Get these from Airtable Developer Hub
   # https://airtable.com/create/oauth
   AIRTABLE_CLIENT_ID=your_client_id_here
   AIRTABLE_CLIENT_SECRET=your_client_secret_here
   
   # This must match the redirect URL configured in Airtable
   # For development: http://localhost:3000/oauth/success
   # For production: https://your-domain.com/oauth/success
   AIRTABLE_REDIRECT_URI=http://localhost:3000/oauth/success
   
   # ============================================
   # DATABASE CONFIGURATION
   # ============================================
   # Local MongoDB
   MONGO_URI=mongodb://localhost:27017/airtable-form-builder
   
   # Or MongoDB Atlas (cloud)
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/airtable-form-builder?retryWrites=true&w=majority
   
   # ============================================
   # SERVER CONFIGURATION
   # ============================================
   PORT=4000
   NODE_ENV=development
   
   # ============================================
   # SESSION SECURITY
   # ============================================
   # Generate a random string for production
   # You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   SESSION_SECRET=change-this-to-a-random-secret-in-production
   
   # ============================================
   # FRONTEND URL
   # ============================================
   # For development
   FRONTEND_URL=http://localhost:3000
   # For production: https://airtable-form-2025.vercel.app
   
   # ============================================
   # WEBHOOK CONFIGURATION
   # ============================================
   # MUST be a publicly accessible HTTPS URL
   # For local development, use ngrok: https://abc123.ngrok.io/api/webhooks/airtable
   # For production: https://your-backend-domain.com/api/webhooks/airtable
   WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/webhooks/airtable
   ```

### Step 4: Generate Session Secret

For production, generate a secure session secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `SESSION_SECRET`.

### Step 5: Start the Backend

**Development Mode (with hot reload):**
```powershell
pnpm dev
```

**Production Mode:**
```powershell
pnpm start
```

You should see:
```
Mongo connected
Server running on http://localhost:4000
```

### Step 6: Test Backend Health

Open a browser or use curl:
```powershell
curl http://localhost:4000/auth/airtable/login
```

If everything is set up correctly, you'll see a redirect or error about missing query parameters (which is expected).

---

## Frontend Setup

### Step 1: Navigate to Frontend

```powershell
cd ..\frontend
# or
cd c:\Users\Omkar\Desktop\Airtable-form-builder\frontend
```

### Step 2: Install Dependencies

```powershell
pnpm install
```

This will install:
- next (v16.0.5)
- react (v19.2.0)
- react-dom (v19.2.0)
- tailwindcss (v4)
- typescript (v5)

### Step 3: Environment Configuration

1. Copy the example file:
   ```powershell
   cp .env.local.example .env.local
   ```

2. Edit `.env.local`:
   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:4000
   
   # For production, use:
   # NEXT_PUBLIC_API_URL=https://airtable-form-backend-x3s3.onrender.com
   ```

### Step 4: Start the Frontend

**Development Mode:**
```powershell
pnpm dev
```

**Production Build:**
```powershell
pnpm build
pnpm start
```

You should see:
```
  ▲ Next.js 16.0.5
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in Xms
```

### Step 5: Test Frontend

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the login page.

---

## Airtable OAuth Configuration

### Step 1: Access Developer Hub

1. Log in to your Airtable account
2. Navigate to [https://airtable.com/create/oauth](https://airtable.com/create/oauth)
3. Click **"Create new OAuth integration"**

### Step 2: Basic Information

Fill in the integration details:

- **Name**: `Airtable Form Builder`
- **Description**: `A dynamic form builder that creates forms from Airtable bases with conditional logic and real-time webhook synchronization.`
- **Logo**: (Optional) Upload a 512x512 PNG image

### Step 3: Configure Redirect URLs

Add redirect URLs for each environment:

#### Development
```
http://localhost:3000/oauth/success
```

#### Production
```
https://airtable-form-2025.vercel.app/oauth/success
```

**Important**: URLs must match exactly, including the protocol (http/https) and path.

### Step 4: Set Required Scopes

Select the following scopes:

| Scope | Purpose |
|-------|---------|
| `data.records:read` | Read records from tables for form responses |
| `data.records:write` | Create new records when forms are submitted |
| `schema.bases:read` | List bases, tables, and fields for form building |
| `webhook:manage` | Register webhooks for real-time sync |

### Step 5: Save and Get Credentials

1. Click **"Save"**
2. Copy your **Client ID**
3. Generate and copy your **Client Secret**
4. Store these securely - you'll need them for the backend `.env` file

### Step 6: Update Backend Configuration

Add to `backend/.env`:
```env
AIRTABLE_CLIENT_ID=appXXXXXXXXXXXXXX
AIRTABLE_CLIENT_SECRET=your_secret_key_here
```

### Step 7: Test OAuth Flow

1. Restart backend: `pnpm dev`
2. Open frontend: `http://localhost:3000`
3. Click **"Login with Airtable"**
4. You should be redirected to Airtable authorization page
5. Click **"Grant access"**
6. You should be redirected back to `/oauth/success`

---

## MongoDB Setup

### Option A: Local MongoDB

#### Windows Setup

1. **Start MongoDB Service:**
   ```powershell
   # Using Windows Services
   net start MongoDB
   
   # Or manually
   mongod --dbpath C:\data\db
   ```

2. **Verify MongoDB is Running:**
   ```powershell
   # Connect using MongoDB shell
   mongosh
   
   # Inside mongosh:
   show dbs
   use airtable-form-builder
   show collections
   ```

3. **Configure Backend:**
   ```env
   MONGO_URI=mongodb://localhost:27017/airtable-form-builder
   ```

#### Create Database and Collections

MongoDB will automatically create the database and collections when first accessed, but you can verify:

```javascript
// Connect to MongoDB
mongosh

// Switch to your database
use airtable-form-builder

// View collections (will be empty initially)
show collections

// After running the app, you should see:
// - users
// - forms
// - responses
```

### Option B: MongoDB Atlas (Cloud)

#### Setup Steps

1. **Create Account:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster:**
   - Click **"Build a Database"**
   - Choose **"Shared"** (Free tier)
   - Select region closest to you
   - Click **"Create Cluster"**

3. **Create Database User:**
   - Go to **Database Access**
   - Click **"Add New Database User"**
   - Set username and password
   - Grant **"Read and write to any database"** privilege

4. **Whitelist IP Address:**
   - Go to **Network Access**
   - Click **"Add IP Address"**
   - For testing: Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production: Add specific IP addresses

5. **Get Connection String:**
   - Go to **Database** → **Connect**
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `airtable-form-builder`

6. **Configure Backend:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/airtable-form-builder?retryWrites=true&w=majority
   ```

#### Test Connection

```powershell
# In backend directory
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected!')).catch(err => console.error(err));"
```

You should see `Connected!`

---

## Webhook Configuration

Webhooks require a **publicly accessible HTTPS URL**. Here's how to set it up:

### For Local Development: Using ngrok

#### Step 1: Install ngrok

```powershell
# Using npm
npm install -g ngrok

# Or download from https://ngrok.com/download
```

#### Step 2: Sign Up for ngrok (Optional but Recommended)

1. Create account at [ngrok.com](https://ngrok.com/)
2. Get your auth token from the dashboard
3. Connect your account:
   ```powershell
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

#### Step 3: Start Backend

```powershell
cd backend
pnpm dev
```

Backend should be running on `http://localhost:4000`

#### Step 4: Create ngrok Tunnel

In a **new terminal**:

```powershell
ngrok http 4000
```

You'll see output like:
```
Session Status                online
Account                       Your Name
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok.io -> http://localhost:4000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

#### Step 5: Update Backend Environment

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and update `backend/.env`:

```env
WEBHOOK_URL=https://abc123.ngrok.io/api/webhooks/airtable
```

#### Step 6: Restart Backend

```powershell
# Press Ctrl+C to stop the backend, then restart
pnpm dev
```

### For Local Development: Using localtunnel

Alternative to ngrok:

```powershell
# Install
npm install -g localtunnel

# Create tunnel
lt --port 4000 --subdomain myformbuilder

# Update .env
WEBHOOK_URL=https://myformbuilder.loca.lt/api/webhooks/airtable
```

### For Production: Using Deployed Backend

Once deployed to Render, Heroku, or similar:

```env
WEBHOOK_URL=https://airtable-form-backend-x3s3.onrender.com/api/webhooks/airtable
```

### Verify Webhook Setup

1. Create a form in the app
2. Check backend logs for:
   ```
   Webhook registered: { id: 'achxxxxxxxxxxxxxx', ... }
   ```

3. Edit a record in Airtable
4. Check backend logs for webhook notification
5. Verify response updated in MongoDB

---

## Verification Steps

### 1. Backend Health Check

```powershell
# Check if server is running
curl http://localhost:4000/auth/airtable/bases
```

Expected: 401 or redirect (means server is responding)

### 2. Frontend Connection

```powershell
# Check if frontend can reach backend
curl http://localhost:3000
```

Expected: HTML page rendered

### 3. Database Connection

```powershell
# In backend directory
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ MongoDB Connected'); process.exit(0); }).catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });"
```

Expected: `✅ MongoDB Connected`

### 4. OAuth Flow Test

1. Open `http://localhost:3000`
2. Click "Login with Airtable"
3. Should redirect to Airtable
4. Grant permissions
5. Should redirect back to `/oauth/success`
6. Check `localStorage` for `userId`

### 5. Form Creation Test

1. Navigate to `/builder`
2. Select a base and table
3. Add some fields
4. Save form
5. Check MongoDB for new form document:
   ```javascript
   mongosh
   use airtable-form-builder
   db.forms.find().pretty()
   ```

### 6. Webhook Test

1. Create a form
2. Submit a response
3. Check Airtable for new record
4. Edit the record in Airtable
5. Check backend logs for webhook notification
6. Verify response updated in MongoDB:
   ```javascript
   db.responses.find().pretty()
   ```

---

## Troubleshooting Common Setup Issues

### Issue: "Cannot find module"

**Solution:**
```powershell
# Delete node_modules and lockfile
rm -r node_modules
rm pnpm-lock.yaml
# Reinstall
pnpm install
```

### Issue: Port Already in Use

**Solution:**
```powershell
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use a different port in .env
PORT=4001
```

### Issue: MongoDB Connection Timeout

**Solution:**
- Check if MongoDB service is running: `net start MongoDB`
- Verify connection string format
- For Atlas: Check network access whitelist

### Issue: OAuth Redirect Mismatch

**Solution:**
- Ensure `AIRTABLE_REDIRECT_URI` exactly matches Airtable OAuth settings
- Include protocol (http/https), port, and full path
- Restart backend after changing

### Issue: Webhook Registration Failed

**Solution:**
- Verify `WEBHOOK_URL` is HTTPS
- Check ngrok tunnel is active
- Ensure Airtable can reach the webhook URL
- Check for webhook limits (5 per base per OAuth integration)

---

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

**Happy Building! 🚀**
