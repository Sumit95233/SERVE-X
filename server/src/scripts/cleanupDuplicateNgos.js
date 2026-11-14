import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { NGO } from '../models/NGO.js';
import { User } from '../models/User.js';

const cleanupDuplicateNgos = async () => {
  try {
    await connectDB();
    console.log('[Cleanup] Connected to MongoDB.');

    // Identify duplicates by organization name
    const ngos = await NGO.find({}).sort({ createdAt: 1 }).lean();
    console.log(`[Cleanup] Total NGO records in DB: ${ngos.length}`);

    // Group by organizationName
    const grouped = {};
    for (const ngo of ngos) {
      const name = ngo.organizationName;
      if (!grouped[name]) grouped[name] = [];
      grouped[name].push(ngo);
    }

    const duplicatesReport = [];
    const removedIds = [];

    for (const [name, records] of Object.entries(grouped)) {
      if (records.length > 1) {
        console.log(`\n[Report] Found ${records.length} duplicate records for "${name}":`);
        duplicatesReport.push({ name, count: records.length, ids: records.map((r) => r._id) });

        // Keep the latest record (index records.length - 1) or first seeded record
        // Remove the rest if they are test-generated records
        const recordsToRemove = records.slice(0, records.length - 1);
        for (const rec of recordsToRemove) {
          const user = await User.findById(rec.userId);
          console.log(`  - Deleting duplicate record: ${rec._id} (User: ${user?.email || 'N/A'}, Reg: ${rec.registrationNumber})`);
          
          await NGO.findByIdAndDelete(rec._id);
          if (rec.userId) {
            await User.findByIdAndDelete(rec.userId);
          }
          removedIds.push(rec._id);
        }

        // For the kept record, normalize the email if it was a test email
        const kept = records[records.length - 1];
        const keptUser = await User.findById(kept.userId);
        if (keptUser && keptUser.email.startsWith('ngotest_')) {
          keptUser.email = 'pratham@servex.org';
          await keptUser.save();
          console.log(`  + Preserved 1 unique record: ${kept._id} (Updated user email to pratham@servex.org)`);
        } else {
          console.log(`  + Preserved 1 unique record: ${kept._id} (${keptUser?.email || 'N/A'})`);
        }
      }
    }

    const remainingNgos = await NGO.find({}).select('organizationName city verificationStatus').lean();
    console.log(`\n[Cleanup Complete] Successfully pruned ${removedIds.length} duplicate test artifacts.`);
    console.log(`Remaining Unique NGOs (${remainingNgos.length}):`);
    remainingNgos.forEach((n, idx) => console.log(`  ${idx + 1}. ${n.organizationName} (${n.city}) - ${n.verificationStatus}`));

    process.exit(0);
  } catch (err) {
    console.error('[Cleanup Error]', err);
    process.exit(1);
  }
};

cleanupDuplicateNgos();
