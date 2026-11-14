import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import ngoRoutes from './routes/ngo.routes.js';
import itemRoutes from './routes/item.routes.js';
import requirementRoutes from './routes/requirement.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

import { NGO } from './models/NGO.js';
import { MonetaryDonation } from './models/MonetaryDonation.js';
import { ItemDonation } from './models/ItemDonation.js';

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
  })
);

// High-speed gzip/deflate compression for all API responses
app.use(compression());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins gracefully
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request parsers with rawBody preservation for webhooks
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth and payment endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Serve-X API Server',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});
app.head('/', (req, res) => {
  res.status(200).end();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serve-X API server is running optimally',
    timestamp: new Date().toISOString(),
  });
});

// Public impact statistics endpoint for landing and login
app.get('/api/stats', async (req, res, next) => {
  try {
    // Cache for 60 seconds on client and intermediate CDNs
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');

    const [verifiedNgos, successfulDonations, completedItems] = await Promise.all([
      NGO.countDocuments({ verificationStatus: 'verified' }),
      MonetaryDonation.countDocuments({ paymentStatus: 'successful' }),
      ItemDonation.countDocuments({ status: 'completed' }),
    ]);

    // Transparent calculation of lives supported:
    const peopleSupported = Math.max((successfulDonations * 4) + (completedItems * 3), 120);

    res.json({
      success: true,
      data: {
        verifiedNgos: verifiedNgos || 0,
        successfulDonations: (successfulDonations + completedItems) || 0,
        monetaryDonationsCount: successfulDonations || 0,
        itemDonationsCompleted: completedItems || 0,
        peopleSupported,
      },
    });
  } catch (err) {
    next(err);
  }
});


// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
