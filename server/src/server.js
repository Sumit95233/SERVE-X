import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Serve-X Backend] Server is running on http://localhost:${PORT}`);
    console.log(`[Serve-X Backend] Mode: ${process.env.NODE_ENV || 'development'}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('[Unhandled Rejection]', err);
  });

  process.on('uncaughtException', (err) => {
    console.error('[Uncaught Exception]', err);
  });
};

startServer();
