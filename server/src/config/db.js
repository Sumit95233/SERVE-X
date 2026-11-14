import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/serve_x';
  try {
    if (uri.startsWith('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
      } catch (dnsErr) {
        console.warn('DNS server config notice', dnsErr.message);
      }
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error] ${err.message}`);
    console.warn('[MongoDB] Server will continue running, but MongoDB queries may fail until MongoDB is available.');
    return null;
  }
};
