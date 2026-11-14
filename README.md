# Serve-X — NGO Donation & Fundraising Platform
> **Tagline:** *"Bridging the Gap for Global Good"*  
> **Market:** India | **Currency:** INR (₹) | **Architecture:** Full Stack Decoupled (React 19 + Vite + Express + MongoDB)

---

## 🌟 Overview
**Serve-X** is a modern full-stack platform connecting donors with thoroughly vetted and verified NGOs across India. It supports both **monetary contributions** to active fundraising campaigns (integrated with Razorpay in test mode) and **physical item donations** (clothes, books, food, devices) with privacy-protected doorstep pickup coordination.

---

## 🎨 Visual Identity & Design System
- **Primary Blue:** `#07549A` (Action, trust, and primary CTAs)
- **Deep Navy:** `#003B64` (Dashboard hero and headers)
- **Primary Green:** `#00B98B` (Positive impact and verified badges)
- **Accent Mint:** `#55E6C1` (Gradients and highlights)
- **Background:** `#F7F9FC` | **Surface:** `#FFFFFF`
- **Heading:** `#101828` | **Body:** `#475467` | **Border:** `#E5EAF0`
- **Branding Icon:** Heart inside rounded square

---

## 🏗️ Technology Stack

### Frontend (`/client`)
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React
- **HTTP Client:** Axios with auto-interceptors
- **Geospatial Maps:** Leaflet + OpenStreetMap (`react-leaflet`)
- **Notifications:** React Hot Toast
- **Receipts:** Built-in Printable Section 80G Tax Receipt Modal

### Backend (`/server`)
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access & Refresh tokens) + bcryptjs hashing
- **Validation:** Zod schemas for all request payloads
- **Payments:** Razorpay Test Mode integration + HMAC-SHA256 server signature verification + Webhook idempotency
- **Security:** Helmet, CORS allowlisting, express-rate-limit, input sanitization
- **Automated Testing:** Vitest + Supertest (36 comprehensive integration tests)

---

## 📁 Project Structure

```
d:/SERVE-X1/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── api/axios.js        # Configured Axios instance with auth interceptor
│   │   ├── context/AuthContext # User & NGO state, session persistence
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ProtectedRoute, StatusBadge, ReceiptModal
│   │   │   ├── donor/          # ImpactScoreCard with gamified tiers
│   │   │   └── ngo/            # VerificationBanner for NGO portal
│   │   ├── pages/
│   │   │   ├── public/         # LandingPage (hero match), Login, Register, NGO Directory, Locator Map, Campaigns
│   │   │   ├── donor/          # Dashboard, ItemDonation, History, Impact, Notifications, Profile
│   │   │   ├── ngo/            # Dashboard, Profile, Requirements, Items, Claims, Campaigns, Donations, Reports
│   │   │   └── admin/          # Dashboard, NGO Verification Queue, Campaign Moderation, Users, Donations, Audit Logs
│   │   ├── App.jsx             # Client routing tree
│   │   ├── index.css           # Tailwind CSS imports & theme tokens
│   │   └── main.jsx
│   ├── .env                    # Frontend environment configuration
│   ├── .env.example            # Sanitized frontend environment template
│   └── package.json
│
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── models/             # User, NGO, ItemDonation, ItemRequirement, ItemClaim, Campaign, MonetaryDonation, AuditLog, Notification
│   │   ├── controllers/        # Auth, NGO, Item, Requirement, Campaign, Payment, Admin, Notification
│   │   ├── middleware/         # Auth, RoleGuard, NgoVerificationGuard, Validate, ErrorHandler
│   │   ├── routes/             # Modular Express routers
│   │   ├── services/           # Razorpay service, Notification and AuditLog helpers
│   │   ├── validators/         # Zod schemas
│   │   ├── utils/seed.js       # Database seeder with realistic Indian NGO data
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server bootstrap
│   ├── test/                   # Automated API integration tests (36 passing tests)
│   ├── .env                    # Backend environment secrets
│   ├── .env.example            # Sanitized backend environment template
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js** v18+ (tested on v24.18.0)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas connection URI

### 2. Configure Environment Variables
Copy `.env.example` templates to `.env`:

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/serve_x
JWT_SECRET=serve_x_jwt_secret_key_long_and_secure_2026
JWT_REFRESH_SECRET=serve_x_jwt_refresh_secret_key_secure_2026
RAZORPAY_KEY_ID=rzp_test_ServeXPlatformKey
RAZORPAY_KEY_SECRET=rzp_test_SecretServeX12345
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_servex_999
UPLOAD_STORAGE_PROVIDER=local
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_ServeXPlatformKey
```

### 3. Seed the Database
Populate verified Indian NGOs (Goonj, Akshaya Patra, Smile Foundation, HelpAge India), active campaigns, item requirements, and test donor accounts:
```bash
cd server
npm run seed
```

### 4. Run the Backend API Server
```bash
cd server
npm start
# Server listens at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 5. Run the Frontend Development Server
In a separate terminal:
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@servex.org` | `Admin@123` | Full administrative control, NGO approval, campaign moderation |
| **Donor** | `donor@servex.org` | `Donor@123` | Individual donor, physical item listings, history & 80G receipts |
| **Verified NGO** | `goonj@servex.org` | `Ngo@123` | Goonj India (Delhi) — verified, can claim items & publish campaigns |
| **Verified NGO** | `akshayapatra@servex.org` | `Ngo@123` | Akshaya Patra (Bengaluru) — verified hunger relief |
| **Pending NGO** | `hopeforstrays@example.com` | `Ngo@123` | Hope For Strays (Pune) — application under review for admin queue |

*(Note: The login page also features 1-click **Quick Demo Autofill** buttons for instant testing without typing).*

---

## 🔐 Google OAuth 2.0 Configuration Guide

Serve-X supports official **Google Sign-In** with cryptographic server-side JWT verification alongside email/password authentication.

### Setup Instructions:
1. **Google Cloud Console**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a project (or select an existing project).
   - Navigate to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth client ID**.
   - Application type: **Web application**.
2. **Authorized JavaScript Origins**:
   - For local development: `http://localhost:5173`
   - For backend / API testing: `http://localhost:5000`
   - For production: Add your production frontend domain (e.g., `https://your-servex-domain.com`).
3. **Environment Variables**:
   - Frontend (`client/.env`):
     ```env
     VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
     ```
   - Backend (`server/.env`):
     ```env
     GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
     ```
4. **Security & Role Rules**:
   - Google ID tokens are verified cryptographically on the server using `google-auth-library`.
   - Audience, issuer, expiration, and email verification status are checked.
   - **Role Selector Guard**: Selecting a role on the login page sets the intended role. If an existing account belongs to a different role, cross-role login is strictly blocked with `403 ROLE_MISMATCH`.
   - **NGO Onboarding**: First-time Google sign-ins selecting the NGO role are safely directed to complete the NGO organization registration form (with verified email/name pre-filled).
   - If Google OAuth keys are not configured, the platform displays a clear setup guide and keeps email/password login fully operational.

---

## 🧪 Automated Integration Tests
Run the complete backend integration test suite:
```bash
cd server
npm test
```
**Results:** `41 passed (41)` covering:
1. **Authentication Endpoints:** Donor, NGO, and Admin login, donor & NGO registration, password mismatch rejection, role selector mismatch rejection, Google token verification & fake credential rejection, live public platform impact statistics without authentication.
2. **Role-Based Route Protection:** Admin dashboard lockdown, donor access denial to admin endpoints, donor blocked from posting NGO requirements, NGO blocked from posting donor item listings, pending NGO campaign restrictions, admin statistics retrieval.
3. **NGO Directory and Map Locator:** Directory listing with active campaign counts, city filtering, and geospatial nearby queries.
4. **Item Donations and Claims Workflow:** Listing creation, pickup address protection from public queries, owner listing editing, pending NGO claim denial, verified NGO claim creation, excess quantity rejection, and route collision prevention for `/claims`.
5. **Fundraising Campaigns and Razorpay Payments:** Campaign progress calculation, order creation, forged signature rejection, genuine HMAC-SHA256 signature verification, production simulated signature rejection, webhook processing and idempotency duplicate protection.
6. **Section 80G Tax Exemption Receipt Security:** Unauthenticated access denial (401), receipt owner authorized download/view (200), cross-donor access denial (403), non-existent receipt handling (404).
7. **Admin Moderation & Audit Logs:** Pending NGO queue retrieval, admin status updates (verification/rejection), and immutable audit log trails.


---

## 🛡️ Security & Compliance Guarantees
- **Donor Address Protection:** A donor's exact residential street address is never exposed publicly. It is redacted and revealed strictly to the verified NGO partner after a claim request is accepted.
- **Server-Side Payment Truth:** Campaign raised amounts and donor counts are incremented only upon verified cryptographic evidence from the backend (HMAC-SHA256 signature verification).
- **Idempotent Webhooks:** All incoming payment events check `PaymentEvent` collection records to prevent duplicate donation counting.
- **Section 80G Receipts:** Receipts are restricted to the paying donor, receiving NGO, or platform administrators. Tax eligibility notes clearly disclose deduction eligibility is subject to the receiving NGO's registration status.
- **Audit Logs:** Administrative actions (verifications, rejections, suspensions) are recorded in the `AuditLog` collection.

---

## 🚢 Production Deployment Guide

### Recommended Targets:
- **Frontend:** Vercel, Netlify, or AWS CloudFront (Static SPA)
- **Backend:** Render, Railway, AWS ECS, or Fly.io (Node.js runtime)
- **Database:** MongoDB Atlas (M0/M10+ Dedicated Cluster with IP Access List)

### Backend Deployment Steps:
1. Set environment variables in the host secret manager:
   - `PORT=5000` (or host assigned `$PORT`)
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-servex-domain.com`
   - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/serve_x?retryWrites=true&w=majority`
   - `JWT_SECRET=<strong-random-64-char-string>`
   - `JWT_REFRESH_SECRET=<strong-random-64-char-string>`
   - `RAZORPAY_KEY_ID=<live_rzp_key_id>`
   - `RAZORPAY_KEY_SECRET=<live_rzp_key_secret>`
   - `RAZORPAY_WEBHOOK_SECRET=<live_webhook_secret>`
2. Deploy backend using `npm start`.
3. Verify the deployment health check at `GET https://your-backend-domain.com/api/health`.

### Frontend Deployment Steps:
1. Set build command: `npm run build`
2. Set publish directory: `dist`
3. Configure environment variables:
   - `VITE_API_BASE_URL=https://your-backend-domain.com/api`
   - `VITE_RAZORPAY_KEY_ID=<live_or_test_rzp_key_id>`
4. Deploy and verify client routing and API communication.
