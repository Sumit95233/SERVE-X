import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env so environment variables are always loaded regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Serve-X Backend] Server is running on port ${PORT}`);
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
