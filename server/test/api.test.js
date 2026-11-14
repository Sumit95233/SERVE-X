import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import mongoose from 'mongoose';
import { verifyPaymentSignature } from '../src/services/razorpay.service.js';
import { Notification } from '../src/models/Notification.js';
import { User } from '../src/models/User.js';
import { MonetaryDonation } from '../src/models/MonetaryDonation.js';

describe('Serve-X Backend API Integration Tests', () => {
  let donorToken = '';
  let donor2Token = '';
  let ngoToken = '';
  let adminToken = '';
  let pendingNgoToken = '';
  let newPendingNgoId = '';
  let activeCampaignId = '';
  let testItemId = '';

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    if (newPendingNgoId) {
      const testNgo = await mongoose.model('NGO').findById(newPendingNgoId);
      if (testNgo?.userId) {
        await mongoose.model('User').findByIdAndDelete(testNgo.userId);
      }
      await mongoose.model('NGO').findByIdAndDelete(newPendingNgoId);
    }
    await mongoose.model('User').deleteMany({ email: { $regex: /^ngotest_/ } });
    await mongoose.connection.close();
  });

  describe('1. Authentication Endpoints', () => {
    it('should log in as a seeded donor and receive JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'donor@servex.org',
          password: 'Donor@123',
          role: 'donor',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      donorToken = res.body.data.accessToken;
    });

    it('should log in as second seeded donor', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'priya.sharma@example.com',
          password: 'Donor@123',
          role: 'donor',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      donor2Token = res.body.data.accessToken;
    });

    it('should log in as verified NGO', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'goonj@servex.org',
          password: 'Ngo@123',
          role: 'ngo',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ngo).toBeDefined();
      expect(res.body.data.ngo.verificationStatus).toBe('verified');
      ngoToken = res.body.data.accessToken;
    });

    it('should log in as pending NGO', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'hopeforstrays@example.com',
          password: 'Ngo@123',
          role: 'ngo',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ngo.verificationStatus).toBe('pending');
      pendingNgoToken = res.body.data.accessToken;
    });

    it('should log in as Admin', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@servex.org',
          password: 'Admin@123',
          role: 'admin',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      adminToken = res.body.data.accessToken;
    });

    it('should register a new donor', async () => {
      const uniqueEmail = `testdonor_${Date.now()}@test.org`;
      const res = await request(app)
        .post('/api/auth/register/donor')
        .send({
          fullName: 'Test Automation Donor',
          email: uniqueEmail,
          phone: '9988776655',
          password: 'Password@123',
          confirmPassword: 'Password@123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('donor');
    });

    it('should register a new NGO with pending status', async () => {
      const uniqueNgoEmail = `ngotest_${Date.now()}@example.org`;
      const res = await request(app)
        .post('/api/auth/register/ngo')
        .send({
          organizationName: 'Pratham Shiksha Foundation',
          registrationNumber: `REG-${Date.now()}`,
          contactPerson: 'Meera Deshmukh',
          email: uniqueNgoEmail,
          phone: '9871122334',
          password: 'Password@123',
          confirmPassword: 'Password@123',
          address: '42 MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          causeCategories: ['Education & Literacy'],
          description: 'Promoting education for underprivileged children.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ngo.verificationStatus).toBe('pending');
      newPendingNgoId = res.body.data.ngo._id;
    });

    it('should reject registration with mismatched passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register/donor')
        .send({
          fullName: 'Fail Donor',
          email: 'fail@test.org',
          phone: '9988776655',
          password: 'Password@123',
          confirmPassword: 'WrongPassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject login if selected role does not match stored account role (Role Selector Guard)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'donor@servex.org',
          password: 'Donor@123',
          role: 'ngo',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('ROLE_MISMATCH');
    });

    it('should reject invalid Google credentials on backend verification', async () => {
      // Temporarily ensure GOOGLE_CLIENT_ID is set for the test
      process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-client-id.apps.googleusercontent.com';
      const res = await request(app)
        .post('/api/auth/google')
        .send({
          credential: 'invalid-fake-google-jwt-token-xyz',
          role: 'donor',
        });

      expect([401, 503]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });

    it('should return live public platform impact statistics without authentication', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verifiedNgos).toBeGreaterThanOrEqual(0);
      expect(res.body.data.successfulDonations).toBeGreaterThanOrEqual(0);
      expect(res.body.data.peopleSupported).toBeGreaterThan(0);
    });
  });

  describe('2. Role-Based Route Protection & Permissions', () => {
    it('should block unauthorized access to admin dashboard stats', async () => {
      const res = await request(app).get('/api/admin/statistics');
      expect(res.status).toBe(401);
    });

    it('should block donor from calling NGO-only requirement creation endpoint', async () => {
      const res = await request(app)
        .post('/api/requirements')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          title: 'Illegitimate Requirement from Donor',
          category: 'Food',
          requiredQuantity: 10,
          unit: 'kg',
          urgency: 'high',
          description: 'A donor should never be able to post NGO requirements.',
        });
      expect(res.status).toBe(403);
    });

    it('should block NGO from calling donor-only item listing creation endpoint', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${ngoToken}`)
        .send({
          title: 'Illegitimate Item Listing from NGO',
          category: 'Clothes',
          quantity: 5,
          unit: 'sets',
          description: 'An NGO should never be able to post donor item listings.',
          condition: 'Good',
          intendedRecipients: ['Children'],
          city: 'New Delhi',
          state: 'Delhi',
          pickupAddress: 'Test NGO Address',
          pickupAvailability: 'Anytime',
        });
      expect(res.status).toBe(403);
    });


    it('should block donor from accessing admin endpoints', async () => {
      const res = await request(app)
        .get('/api/admin/statistics')
        .set('Authorization', `Bearer ${donorToken}`);
      expect(res.status).toBe(403);
    });

    it('should block pending NGO from creating fundraising campaigns', async () => {
      const res = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${pendingNgoToken}`)
        .send({
          title: 'Pending NGO Campaign Attempt',
          causeCategory: 'Animal Welfare',
          goalAmount: 50000,
          city: 'New Delhi',
          description: 'This campaign should not be creatable while pending verification by admins.',
          beneficiaryDescription: 'Street dogs in need of shelter and care.',
          fundUsagePlan: 'Shelter construction and food supplies.',
          endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('NGO_NOT_VERIFIED');
    });

    it('should allow admin to access platform statistics', async () => {
      const res = await request(app)
        .get('/api/admin/statistics')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verifiedNgos).toBeGreaterThan(0);
    });
  });

  describe('3. NGO Directory and Map Locator', () => {
    it('should return list of verified NGOs with active campaign count', async () => {
      const res = await request(app).get('/api/ngos');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter NGOs by city', async () => {
      const res = await request(app).get('/api/ngos?city=New Delhi');
      expect(res.status).toBe(200);
      expect(res.body.data.some((n) => n.city === 'New Delhi')).toBe(true);
    });

    it('should return nearby NGOs with valid coordinates', async () => {
      const res = await request(app).get('/api/ngos/nearby?lat=28.6139&lng=77.2090');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('4. Item Donations and Claims Workflow', () => {
    it('should allow donor to create a physical item donation listing', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          title: '30 School Backpacks with Stationery',
          category: 'Books',
          quantity: 30,
          unit: 'backpacks',
          description: 'Brand new sturdy school bags containing notebook bundles and pens.',
          condition: 'New',
          intendedRecipients: ['Children'],
          city: 'New Delhi',
          state: 'Delhi',
          pickupAddress: 'Sector 15, Rohini, New Delhi',
          pickupAvailability: 'Any day 10 AM - 4 PM',
          images: [],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('available');
      testItemId = res.body.data._id;
    });

    it('should hide exact pickup address from unauthenticated public queries', async () => {
      const res = await request(app).get(`/api/items/${testItemId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.pickupAddress).toContain('Full address shared upon claim confirmation');
    });

    it('should allow item owner donor to update the listing', async () => {
      const res = await request(app)
        .patch(`/api/items/${testItemId}`)
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          description: 'Updated: Brand new sturdy backpacks with notebooks and geometry boxes.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.description).toContain('geometry boxes');
    });

    it('should reject unverified/pending NGO from claiming an item', async () => {
      const res = await request(app)
        .post(`/api/items/${testItemId}/claims`)
        .set('Authorization', `Bearer ${pendingNgoToken}`)
        .send({
          requestedQuantity: 10,
          notes: 'Testing pending NGO claim',
        });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('NGO_NOT_VERIFIED');
    });

    it('should allow verified NGO to request claim with valid quantity', async () => {
      const res = await request(app)
        .post(`/api/items/${testItemId}/claims`)
        .set('Authorization', `Bearer ${ngoToken}`)
        .send({
          requestedQuantity: 20,
          notes: 'We would love to distribute these to students in our slum literacy program.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject claim quantity exceeding available quantity', async () => {
      const res = await request(app)
        .post(`/api/items/${testItemId}/claims`)
        .set('Authorization', `Bearer ${ngoToken}`)
        .send({
          requestedQuantity: 500,
          notes: 'Excessive request exceeding inventory',
        });

      expect(res.status).toBe(400);
    });

    it('should retrieve claims list for verified NGO without route collision', async () => {
      const res = await request(app)
        .get('/api/items/claims')
        .set('Authorization', `Bearer ${ngoToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should retrieve claims list for donor without route collision', async () => {
      const res = await request(app)
        .get('/api/items/claims')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('5. Fundraising Campaigns and Razorpay Payments', () => {
    it('should fetch active fundraising campaigns with progress calculations', async () => {
      const res = await request(app).get('/api/campaigns');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      activeCampaignId = res.body.data[0]._id;
      expect(res.body.data[0].progressPercentage).toBeDefined();
    });

    it('should create a Razorpay order on the backend with campaign link', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({
          campaignId: activeCampaignId,
          amount: 2500,
          donorName: 'Aarav Mehta',
          donorEmail: 'aarav@example.com',
          donorPhone: '9876543210',
          donorMessage: 'Keep up the remarkable work!',
          isAnonymous: false,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderId).toBeDefined();
    });

    it('should reject payment verification with invalid signature', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: 'order_fake_9999999',
          razorpayPaymentId: 'pay_fake_9999999',
          razorpaySignature: 'invalid_forged_signature_hash',
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('SIGNATURE_VERIFICATION_FAILED');
    });

    it('should verify genuine HMAC-SHA256 signature algorithm', () => {
      const orderId = 'order_test_hmac_123';
      const paymentId = 'pay_test_hmac_456';
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_SecretServeX12345';
      const signature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      });

      expect(isValid).toBe(true);
    });

    it('should reject simulated signatures in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const isValid = verifyPaymentSignature({
        razorpayOrderId: 'order_prod_test',
        razorpayPaymentId: 'pay_prod_test',
        razorpaySignature: 'simulated_test_signature',
      });

      process.env.NODE_ENV = originalEnv;
      expect(isValid).toBe(false);
    });

    it('should handle webhook event and ensure idempotency for duplicate delivery', async () => {
      const eventId = `evt_test_${Date.now()}`;
      const webhookPayload = {
        id: eventId,
        event: 'payment.captured',
        created_at: Math.floor(Date.now() / 1000),
        payload: {
          payment: {
            entity: {
              id: 'pay_hook_test_123',
              order_id: 'order_hook_test_123',
              amount: 500000,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      };

      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_servex_999';
      const rawPayload = JSON.stringify(webhookPayload);
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawPayload)
        .digest('hex');

      // First webhook delivery
      const res1 = await request(app)
        .post('/api/payments/webhook')
        .set('x-razorpay-signature', signature)
        .set('Content-Type', 'application/json')
        .send(rawPayload);

      expect(res1.status).toBe(200);
      expect(res1.body.success).toBe(true);

      // Duplicate delivery with the same event ID should be idempotent
      const res2 = await request(app)
        .post('/api/payments/webhook')
        .set('x-razorpay-signature', signature)
        .set('Content-Type', 'application/json')
        .send(rawPayload);

      expect(res2.status).toBe(200);
      expect(res2.body.message).toBe('Event already handled');
    });

    describe('Section 80G Tax Exemption Receipt Security', () => {
      it('should block unauthenticated access to registered donor receipt', async () => {
        const res = await request(app).get('/api/payments/SRVX-20261021-VKA1/receipt');
        expect(res.status).toBe(401);
        expect(res.body.code).toBe('UNAUTHORIZED');
      });

      it('should allow receipt owner donor to retrieve authorized receipt with 80G tax note', async () => {
        const res = await request(app)
          .get('/api/payments/SRVX-20261021-VKA1/receipt')
          .set('Authorization', `Bearer ${donorToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.receiptNumber).toBe('SRVX-20261021-VKA1');
        expect(res.body.data.amount).toBe(15000);
        expect(res.body.data.taxExemptionNote).toContain('Section 80G');
      });

      it('should block another donor from viewing a different donor receipt', async () => {
        const res = await request(app)
          .get('/api/payments/SRVX-20261021-VKA1/receipt')
          .set('Authorization', `Bearer ${donor2Token}`);

        expect(res.status).toBe(403);
        expect(res.body.code).toBe('UNAUTHORIZED_RECEIPT_ACCESS');
      });

      it('should return 404 for non-existent receipt number', async () => {
        const res = await request(app)
          .get('/api/payments/SRVX-NONEXISTENT-9999/receipt')
          .set('Authorization', `Bearer ${donorToken}`);

        expect(res.status).toBe(404);
        expect(res.body.code).toBe('RECEIPT_NOT_FOUND');
      });
    });
  });

  describe('6. Admin Moderation and Verification Queue', () => {
    it('should fetch pending NGOs in admin verification queue', async () => {
      const res = await request(app)
        .get('/api/admin/ngos/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((n) => n.verificationStatus === 'pending')).toBe(true);
    });

    it('should allow admin to verify a newly registered pending NGO', async () => {
      expect(newPendingNgoId).toBeDefined();

      const res = await request(app)
        .patch(`/api/admin/ngos/${newPendingNgoId}/verification`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'verified',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationStatus).toBe('verified');
    });

    it('should fetch audit logs including the verification action', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((log) => log.action.includes('NGO_VERIFICATION'))).toBe(true);
    });
  });

  describe('7. Notification System and Unread Synchronization', () => {
    let testNotificationId = '';
    let donorUser = null;

    it('should retrieve notifications and unread count for authenticated donor', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
      expect(typeof res.body.data.unreadCount).toBe('number');
    });

    it('should accurately report unreadCount when new unread notification is created', async () => {
      donorUser = await User.findOne({ email: 'donor@servex.org' });
      expect(donorUser).toBeDefined();

      const newNotif = await Notification.create({
        userId: donorUser._id,
        title: 'Test Distribution Scheduled',
        message: 'Your item has been scheduled for local distribution.',
        type: 'donation',
        isRead: false,
      });
      testNotificationId = newNotif._id.toString();

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.unreadCount).toBeGreaterThan(0);
      expect(res.body.data.notifications.some((n) => n._id === testNotificationId && !n.isRead)).toBe(true);
    });

    it('should mark one notification as read and decrease unread count', async () => {
      const beforeRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${donorToken}`);
      const beforeCount = beforeRes.body.data.unreadCount;

      const res = await request(app)
        .patch(`/api/notifications/${testNotificationId}/read`)
        .set('Authorization', `Bearer ${donorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isRead).toBe(true);

      const afterRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${donorToken}`);
      expect(afterRes.body.data.unreadCount).toBe(beforeCount - 1);
    });

    it('should mark all notifications as read and reset unreadCount to 0', async () => {
      // Create additional unread notifications
      await Notification.create([
        {
          userId: donorUser._id,
          title: 'Campaign Reached Milestone',
          message: 'The campaign you backed achieved 50% funding.',
          type: 'donation',
          isRead: false,
        },
        {
          userId: donorUser._id,
          title: 'Receipt Ready',
          message: 'Your official 80G tax receipt is ready for download.',
          type: 'donation',
          isRead: false,
        },
      ]);

      const markRes = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(markRes.status).toBe(200);
      expect(markRes.body.success).toBe(true);

      const afterRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${donorToken}`);
      expect(afterRes.body.data.unreadCount).toBe(0);
      expect(afterRes.body.data.notifications.every((n) => n.isRead === true)).toBe(true);
    });

    it('should handle idempotent repeated mark-all requests safely without error', async () => {
      const repeatRes = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(repeatRes.status).toBe(200);
      expect(repeatRes.body.success).toBe(true);

      const checkRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${donorToken}`);
      expect(checkRes.body.data.unreadCount).toBe(0);
    });

    it('should prevent cross-user unauthorized notification modification', async () => {
      const adminUser = await User.findOne({ email: 'admin@servex.org' });
      const adminNotif = await Notification.create({
        userId: adminUser._id,
        title: 'Admin Verification Alert',
        message: 'New NGO verification pending review.',
        isRead: false,
      });

      const res = await request(app)
        .patch(`/api/notifications/${adminNotif._id}/read`)
        .set('Authorization', `Bearer ${donorToken}`);

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOTIFICATION_NOT_FOUND');
    });
  });

  describe('8. Leaderboard Aggregation and Privacy Isolation', () => {
    it('should return 200 and list of verified donors on GET /api/leaderboard', async () => {
      const res = await request(app).get('/api/leaderboard');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.leaders)).toBe(true);
      expect(res.body.data.period).toBe('all_time');
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.summary).toBeDefined();

      // Check ranking order and no exposure of private fields
      const leaders = res.body.data.leaders;
      for (let i = 0; i < leaders.length; i++) {
        expect(leaders[i].rank).toBe(i + 1);
        expect(leaders[i].verifiedContributionTotal).toBeGreaterThan(0);
        expect(leaders[i].qualifyingDonationCount).toBeGreaterThanOrEqual(1);
        // Private fields must never be exposed
        expect(leaders[i].email).toBeUndefined();
        expect(leaders[i].donorEmail).toBeUndefined();
        expect(leaders[i].phone).toBeUndefined();
        expect(leaders[i].donorPhone).toBeUndefined();
        expect(leaders[i].panNumber).toBeUndefined();
      }
    });

    it('should filter by period (all_time, month, year) correctly', async () => {
      const monthRes = await request(app).get('/api/leaderboard?period=month');
      expect(monthRes.status).toBe(200);
      expect(monthRes.body.data.period).toBe('month');

      const yearRes = await request(app).get('/api/leaderboard?period=year');
      expect(yearRes.status).toBe(200);
      expect(yearRes.body.data.period).toBe('year');
    });

    it('should exclude anonymous donations from public donor identity rankings while counting in aggregate totals', async () => {
      const donorUser = await User.findOne({ email: 'donor@servex.org' });
      const testCampaign = await mongoose.model('Campaign').findOne({ status: 'active' });

      // Create an anonymous donation
      await MonetaryDonation.create({
        donorId: donorUser._id,
        donorName: 'Secret Philanthropist',
        donorEmail: 'secret@servex.org',
        ngoId: testCampaign.ngoId,
        campaignId: testCampaign._id,
        amount: 25000,
        currency: 'INR',
        razorpayOrderId: `order_anon_${Date.now()}`,
        razorpayPaymentId: `pay_anon_${Date.now()}`,
        paymentStatus: 'successful',
        receiptNumber: `RCPT_ANON_${Date.now()}`,
        isAnonymous: true,
      });

      const res = await request(app).get('/api/leaderboard');
      expect(res.status).toBe(200);

      // 1. Aggregate totals include the anonymous donation
      expect(res.body.data.summary.totalRaised).toBeGreaterThanOrEqual(25000);

      // 2. Public leaders and top donors must NOT contain any anonymous entries
      const anonInLeaders = res.body.data.leaders.find((l) => l.isAnonymous === true || l.displayName === 'Anonymous Supporter');
      expect(anonInLeaders).toBeUndefined();

      const anonInTop = res.body.data.topDonors.find((d) => d.isAnonymous === true || d.displayName === 'Anonymous Supporter');
      expect(anonInTop).toBeUndefined();

      // 3. Secret identity must not be revealed
      const leakedSecret = res.body.data.leaders.find((l) => l.displayName === 'Secret Philanthropist');
      expect(leakedSecret).toBeUndefined();
    });

    it('should return authenticated donor standing on GET /api/leaderboard/me', async () => {
      const res = await request(app)
        .get('/api/leaderboard/me')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isPublicDonor).toBeDefined();
      expect(res.body.data.emailPreferences).toBeDefined();
      expect(res.body.data.verifiedContributionTotal).toBeGreaterThanOrEqual(0);
    });

    it('should allow donor to update privacy preferences via PATCH /api/leaderboard/preferences', async () => {
      const res = await request(app)
        .patch('/api/leaderboard/preferences')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({
          isPublicDonor: false,
          emailPreferences: {
            donationReceipts: true,
            platformUpdates: true,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.isPublicDonor).toBe(false);
      expect(res.body.data.user.emailPreferences.platformUpdates).toBe(true);

      // Restore to public
      await request(app)
        .patch('/api/leaderboard/preferences')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ isPublicDonor: true });
    });
  });

  describe('9. Automated Thank-You Email System and Idempotency', () => {
    it('should record verified email delivery attempt when donation payment is verified', async () => {
      const donorUser = await User.findOne({ email: 'donor@servex.org' });
      const testCampaign = await mongoose.model('Campaign').findOne({ status: 'active' });

      const uniqueOrderId = `order_email_test_${Date.now()}`;
      const uniquePaymentId = `pay_email_test_${Date.now()}`;
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_SecretServeX12345';
      const validSignature = crypto
        .createHmac('sha256', secret)
        .update(`${uniqueOrderId}|${uniquePaymentId}`)
        .digest('hex');

      // Create donation
      const donation = await MonetaryDonation.create({
        donorId: donorUser._id,
        donorName: 'Test Email Donor',
        donorEmail: 'test.donor@servex.org',
        ngoId: testCampaign.ngoId,
        campaignId: testCampaign._id,
        amount: 5000,
        currency: 'INR',
        razorpayOrderId: uniqueOrderId,
        paymentStatus: 'initiated',
      });

      const verifyRes = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: uniqueOrderId,
          razorpayPaymentId: uniquePaymentId,
          razorpaySignature: validSignature,
        });

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.success).toBe(true);

      // Wait briefly for asynchronous email job execution
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedDonation = await MonetaryDonation.findById(donation._id);
      expect(updatedDonation.paymentStatus).toBe('successful');
      expect(['sent', 'simulated']).toContain(updatedDonation.emailDeliveryStatus);
      expect(updatedDonation.emailDeliveryId).toBeDefined();
      expect(updatedDonation.emailSentAt).toBeDefined();
    });

    it('should enforce idempotency and not send duplicate emails on repeat verification', async () => {
      const existingDonation = await MonetaryDonation.findOne({
        paymentStatus: 'successful',
        emailDeliveryStatus: { $in: ['sent', 'simulated'] },
      });

      expect(existingDonation).toBeDefined();
      const initialDeliveryId = existingDonation.emailDeliveryId;
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_SecretServeX12345';
      const validRepeatSig = crypto
        .createHmac('sha256', secret)
        .update(`${existingDonation.razorpayOrderId}|${existingDonation.razorpayPaymentId}`)
        .digest('hex');

      const repeatRes = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: existingDonation.razorpayOrderId,
          razorpayPaymentId: existingDonation.razorpayPaymentId,
          razorpaySignature: validRepeatSig,
        });

      expect(repeatRes.status).toBe(200);
      expect(repeatRes.body.message).toBe('Payment already verified');

      const recheckedDonation = await MonetaryDonation.findById(existingDonation._id);
      expect(recheckedDonation.emailDeliveryId).toBe(initialDeliveryId);
    });

    it('should never send thank-you email for unverified or failed payments', async () => {
      const donorUser = await User.findOne({ email: 'donor@servex.org' });
      const testCampaign = await mongoose.model('Campaign').findOne({ status: 'active' });

      const failedDonation = await MonetaryDonation.create({
        donorId: donorUser._id,
        donorName: 'Failed Payment Donor',
        donorEmail: 'failed.payment@servex.org',
        ngoId: testCampaign.ngoId,
        campaignId: testCampaign._id,
        amount: 1500,
        currency: 'INR',
        razorpayOrderId: `order_failed_${Date.now()}`,
        paymentStatus: 'failed',
      });

      const checked = await MonetaryDonation.findById(failedDonation._id);
      expect(checked.emailDeliveryStatus).toBe('pending');
      expect(checked.emailSentAt).toBeNull();
    });
  });

  describe('10. Leaderboard, Privacy and Authentication Logout Endpoints', () => {
    it('should successfully handle POST /api/auth/logout', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out successfully');
    });

    it('should fetch public leaderboard without any anonymous placeholders in rankings or top donors', async () => {
      const res = await request(app)
        .get('/api/leaderboard?period=all_time')
        .expect(200);

      expect(res.body.success).toBe(true);
      const { summary, topDonors, leaders, recentContributions } = res.body.data;

      // Summary statistics exist and are numeric
      expect(summary.totalRaised).toBeGreaterThanOrEqual(0);
      expect(summary.totalDonations).toBeGreaterThanOrEqual(0);
      expect(summary.activeDonors).toBeGreaterThanOrEqual(0);

      // Verify no top donor is anonymous
      topDonors.forEach((donor) => {
        expect(donor.isAnonymous).toBe(false);
        expect(donor.displayName).not.toMatch(/anonymous/i);
        expect(donor.verifiedContributionTotal).toBeGreaterThan(0);
      });

      // Verify no paginated leader is anonymous
      leaders.forEach((leader) => {
        expect(leader.isAnonymous).toBe(false);
        expect(leader.displayName).not.toMatch(/anonymous/i);
      });

      // Verify recent contributions are public and have valid status
      recentContributions.forEach((rc) => {
        expect(rc.paymentStatus).toBe('successful');
        expect(rc.donorName).not.toMatch(/anonymous/i);
      });
    });

    it('should allow authenticated donor to fetch their personal standing and update privacy preferences', async () => {
      // 1. Fetch standing
      const standingRes = await request(app)
        .get('/api/leaderboard/me?period=all_time')
        .set('Authorization', `Bearer ${donorToken}`)
        .expect(200);

      expect(standingRes.body.success).toBe(true);
      expect(standingRes.body.data.isPublicDonor).toBeDefined();

      // 2. Toggle to private
      const toggleRes = await request(app)
        .patch('/api/leaderboard/preferences')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ isPublicDonor: false })
        .expect(200);

      expect(toggleRes.body.success).toBe(true);
      expect(toggleRes.body.data.user.isPublicDonor).toBe(false);

      // 3. Reset back to public
      const resetRes = await request(app)
        .patch('/api/leaderboard/preferences')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ isPublicDonor: true })
        .expect(200);

      expect(resetRes.body.success).toBe(true);
      expect(resetRes.body.data.user.isPublicDonor).toBe(true);
    });

    it('should support period filters (all_time, month, year) consistently', async () => {
      const monthRes = await request(app).get('/api/leaderboard?period=month').expect(200);
      expect(monthRes.body.success).toBe(true);
      expect(monthRes.body.data.period).toBe('month');

      const yearRes = await request(app).get('/api/leaderboard?period=year').expect(200);
      expect(yearRes.body.success).toBe(true);
      expect(yearRes.body.data.period).toBe('year');
    });
  });
});
