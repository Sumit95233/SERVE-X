import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { NGO } from '../models/NGO.js';
import { Campaign } from '../models/Campaign.js';
import { ItemRequirement } from '../models/ItemRequirement.js';
import { ItemDonation } from '../models/ItemDonation.js';
import { ItemClaim } from '../models/ItemClaim.js';
import { MonetaryDonation } from '../models/MonetaryDonation.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to MongoDB. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      NGO.deleteMany({}),
      Campaign.deleteMany({}),
      ItemRequirement.deleteMany({}),
      ItemDonation.deleteMany({}),
      ItemClaim.deleteMany({}),
      MonetaryDonation.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    console.log('[Seed] Database cleared. Creating default users...');

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const donorPasswordHash = await bcrypt.hash('Donor@123', salt);
    const ngoPasswordHash = await bcrypt.hash('Ngo@123', salt);

    // 1. Admin
    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: 'admin@servex.org',
      phone: '9876543210',
      passwordHash: adminPasswordHash,
      role: 'admin',
    });

    // 2. Donors
    const donor1 = await User.create({
      fullName: 'Vikram Aditya',
      email: 'donor@servex.org',
      phone: '9811223344',
      passwordHash: donorPasswordHash,
      role: 'donor',
    });

    const donor2 = await User.create({
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9822334455',
      passwordHash: donorPasswordHash,
      role: 'donor',
    });

    const donor3 = await User.create({
      fullName: 'Arjun Nair',
      email: 'arjun.nair@example.com',
      phone: '9833445566',
      passwordHash: donorPasswordHash,
      role: 'donor',
    });

    // 3. NGO Users & Profiles
    // NGO 1: Goonj (Delhi)
    const goonjUser = await User.create({
      fullName: 'Anshu Gupta',
      email: 'goonj@servex.org',
      phone: '9111223344',
      passwordHash: ngoPasswordHash,
      role: 'ngo',
    });

    const goonjNgo = await NGO.create({
      userId: goonjUser._id,
      organizationName: 'Goonj India',
      registrationNumber: 'DL/2004/0014295',
      contactPerson: 'Anshu Gupta',
      description: 'Goonj envisions growing as an idea across the globe, where the surplus material of cities becomes a resource for rural development.',
      logo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=200&fit=crop',
      address: 'J-93, Sarita Vihar',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110076',
      locationCoordinates: {
        type: 'Point',
        coordinates: [77.2090, 28.6139],
      },
      causeCategories: ['Disaster Relief', 'Clothing & Dignity', 'Community Development'],
      verificationStatus: 'verified',
    });

    // NGO 2: Akshaya Patra Foundation (Bengaluru)
    const akshayaUser = await User.create({
      fullName: 'Sridhar Venkat',
      email: 'akshayapatra@servex.org',
      phone: '9122334455',
      passwordHash: ngoPasswordHash,
      role: 'ngo',
    });

    const akshayaNgo = await NGO.create({
      userId: akshayaUser._id,
      organizationName: 'Akshaya Patra Foundation',
      registrationNumber: 'KA/2001/0088921',
      contactPerson: 'Sridhar Venkat',
      description: 'Striving to eliminate classroom hunger by providing wholesome and nutritious mid-day meals to millions of government school children.',
      logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop',
      address: 'Hare Krishna Hill, West of Chord Road, Rajajinagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560010',
      locationCoordinates: {
        type: 'Point',
        coordinates: [77.5946, 12.9716],
      },
      causeCategories: ['Hunger Relief', 'Child Nutrition', 'Education'],
      verificationStatus: 'verified',
    });

    // NGO 3: Smile Foundation (Mumbai)
    const smileUser = await User.create({
      fullName: 'Santanu Mishra',
      email: 'smile@servex.org',
      phone: '9133445566',
      passwordHash: ngoPasswordHash,
      role: 'ngo',
    });

    const smileNgo = await NGO.create({
      userId: smileUser._id,
      organizationName: 'Smile Foundation',
      registrationNumber: 'MH/2002/0034561',
      contactPerson: 'Santanu Mishra',
      description: 'Directly benefitting over 1.5 million children and their families annually through more than 400 live welfare projects across India.',
      logo: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=200&h=200&fit=crop',
      address: '101, B Wing, Kanakia Wall Street, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400093',
      locationCoordinates: {
        type: 'Point',
        coordinates: [72.8777, 19.0760],
      },
      causeCategories: ['Child Welfare', 'Healthcare', 'Women Empowerment'],
      verificationStatus: 'verified',
    });

    // NGO 4: HelpAge India (Kolkata)
    const helpageUser = await User.create({
      fullName: 'Rohit Prasad',
      email: 'helpage@servex.org',
      phone: '9144556677',
      passwordHash: ngoPasswordHash,
      role: 'ngo',
    });

    const helpageNgo = await NGO.create({
      userId: helpageUser._id,
      organizationName: 'HelpAge India',
      registrationNumber: 'WB/1978/0002143',
      contactPerson: 'Rohit Prasad',
      description: 'Dedicated to serving disadvantaged elders and improving their quality of life through healthcare, mobile medical units, and elder-helplines.',
      logo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=200&h=200&fit=crop',
      address: 'C-14, Qutab Institutional Area',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700029',
      locationCoordinates: {
        type: 'Point',
        coordinates: [88.3639, 22.5726],
      },
      causeCategories: ['Elderly Care', 'Healthcare', 'Livelihood'],
      verificationStatus: 'verified',
    });

    // NGO 5: Hope For Strays (Pune) - PENDING verification for Admin Review
    const strayUser = await User.create({
      fullName: 'Dr. Neha Deshmukh',
      email: 'hopeforstrays@example.com',
      phone: '9155667788',
      passwordHash: ngoPasswordHash,
      role: 'ngo',
    });

    const strayNgo = await NGO.create({
      userId: strayUser._id,
      organizationName: 'Hope For Strays Pune',
      registrationNumber: 'MH/2025/0091234',
      contactPerson: 'Dr. Neha Deshmukh',
      description: 'Providing rescue, medical rehabilitation, and shelter for injured and abandoned community animals across Pune.',
      logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=200&h=200&fit=crop',
      address: 'Plot 44, Baner Pashan Link Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      locationCoordinates: {
        type: 'Point',
        coordinates: [73.8567, 18.5204],
      },
      causeCategories: ['Animal Welfare', 'Community Health'],
      verificationStatus: 'pending',
    });

    console.log('[Seed] Created NGOs and users. Creating campaigns...');

    // 4. Campaigns
    const campaign1 = await Campaign.create({
      ngoId: goonjNgo._id,
      title: 'Flood Relief & Emergency Food Kits 2026',
      description: 'Support critical flood-affected families in Assam and Northern Bihar with food essentials, clean water purification kits, and dry ration bags.',
      causeCategory: 'Disaster Relief',
      goalAmount: 850000,
      amountRaised: 540000,
      donorCount: 142,
      images: [
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop',
      ],
      city: 'New Delhi',
      startDate: new Date(Date.now() - 15 * 86400000),
      endDate: new Date(Date.now() + 30 * 86400000),
      beneficiaryDescription: 'Over 2,500 displaced families requiring dry rations and sanitation supplies.',
      fundUsagePlan: '65% Dry rations and clean drinking water, 20% Medical supplies, 15% Logistics and rescue coordination.',
      status: 'active',
      reviewedBy: adminUser._id,
    });

    const campaign2 = await Campaign.create({
      ngoId: smileNgo._id,
      title: 'Educate 500 Rural Girls with Digital Tablets',
      description: 'Bridging the digital divide for first-generation school-going girls from low-income communities with solar-charged educational tablets.',
      causeCategory: 'Education',
      goalAmount: 1200000,
      amountRaised: 980000,
      donorCount: 218,
      images: [
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop',
      ],
      city: 'Mumbai',
      startDate: new Date(Date.now() - 25 * 86400000),
      endDate: new Date(Date.now() + 20 * 86400000),
      beneficiaryDescription: '500 rural girl students studying in grades 6 through 10 in Maharashtra tribal belts.',
      fundUsagePlan: '75% Tablets and offline STEM learning content, 15% Teacher mentorship, 10% Solar charging stations.',
      status: 'active',
      reviewedBy: adminUser._id,
    });

    const campaign3 = await Campaign.create({
      ngoId: akshayaNgo._id,
      title: 'Daily Mid-Day Meals for 2,000 Underprivileged Children',
      description: 'Fueling young minds with fresh, hot, and hygienic nutritional lunches every single school day to reduce dropout rates.',
      causeCategory: 'Hunger Relief',
      goalAmount: 1500000,
      amountRaised: 1125000,
      donorCount: 310,
      images: [
        'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&auto=format&fit=crop',
      ],
      city: 'Bengaluru',
      startDate: new Date(Date.now() - 40 * 86400000),
      endDate: new Date(Date.now() + 45 * 86400000),
      beneficiaryDescription: '2,000 students enrolled in government primary schools across peri-urban Bengaluru.',
      fundUsagePlan: '85% Grains, pulses, vegetables and milk procurement, 15% High-standard kitchen operations and distribution.',
      status: 'active',
      reviewedBy: adminUser._id,
    });

    const campaign4 = await Campaign.create({
      ngoId: helpageNgo._id,
      title: 'Mobile Healthcare Vans for Rural Elders',
      description: 'Taking quality free healthcare, cataract screenings, diabetes diagnostics, and medicines directly to the doorstep of neglected senior citizens.',
      causeCategory: 'Healthcare',
      goalAmount: 600000,
      amountRaised: 310000,
      donorCount: 89,
      images: [
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop',
      ],
      city: 'Kolkata',
      startDate: new Date(Date.now() - 10 * 86400000),
      endDate: new Date(Date.now() + 35 * 86400000),
      beneficiaryDescription: '1,200 rural elderly without access to hospitals in rural West Bengal districts.',
      fundUsagePlan: '70% Medical diagnostics and free prescription medicines, 30% Mobile van fuel and doctor honorarium.',
      status: 'active',
      reviewedBy: adminUser._id,
    });

    // Pending campaign for Admin Review Queue
    await Campaign.create({
      ngoId: strayNgo._id,
      title: 'Solar Inverters & Medical ICU for Street Animal Hospital',
      description: 'Installing solar battery backup and critical oxygen concentrators for our veterinary emergency hospital.',
      causeCategory: 'Animal Welfare',
      goalAmount: 450000,
      amountRaised: 0,
      donorCount: 0,
      images: [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop',
      ],
      city: 'Pune',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 86400000),
      beneficiaryDescription: 'Over 80 critically wounded street animals treated weekly.',
      fundUsagePlan: '80% Solar system and inverter hardware, 20% Medical cages and monitors.',
      status: 'pending_review',
    });

    console.log('[Seed] Created campaigns. Creating urgent item requirements...');

    // 5. Item Requirements
    await ItemRequirement.create({
      ngoId: goonjNgo._id,
      title: '300 Heavy Winter Blankets for Night Shelters',
      category: 'Clothes',
      quantityRequired: 300,
      quantityFulfilled: 120,
      unit: 'blankets',
      description: 'Thick warm blankets needed urgently for homeless families taking refuge in temporary winter night shelters.',
      intendedRecipients: ['Homeless', 'Elderly', 'Children'],
      urgency: 'urgent',
      city: 'New Delhi',
      state: 'Delhi',
      requiredBy: new Date(Date.now() + 10 * 86400000),
      status: 'active',
    });

    await ItemRequirement.create({
      ngoId: akshayaNgo._id,
      title: '500 kg Sona Masoori Rice & Toor Dal',
      category: 'Food',
      quantityRequired: 500,
      quantityFulfilled: 280,
      unit: 'kg',
      description: 'Grain supplies for preparing community school meals. Clean sealed sacks preferred.',
      intendedRecipients: ['Children'],
      urgency: 'high',
      city: 'Bengaluru',
      state: 'Karnataka',
      requiredBy: new Date(Date.now() + 15 * 86400000),
      status: 'active',
    });

    await ItemRequirement.create({
      ngoId: smileNgo._id,
      title: '150 Science & Math Standard Reference Books',
      category: 'Books',
      quantityRequired: 150,
      quantityFulfilled: 45,
      unit: 'books',
      description: 'Textbooks, encyclopedias, and NCERT reference materials for our community learning centres.',
      intendedRecipients: ['Children'],
      urgency: 'medium',
      city: 'Mumbai',
      state: 'Maharashtra',
      requiredBy: new Date(Date.now() + 25 * 86400000),
      status: 'active',
    });

    await ItemRequirement.create({
      ngoId: helpageNgo._id,
      title: '35 Foldable Wheelchairs & Adjustable Walkers',
      category: 'Other',
      quantityRequired: 35,
      quantityFulfilled: 12,
      unit: 'units',
      description: 'Mobility support devices for non-ambulatory elderly residing in community shelters.',
      intendedRecipients: ['Elderly'],
      urgency: 'high',
      city: 'Kolkata',
      state: 'West Bengal',
      requiredBy: new Date(Date.now() + 18 * 86400000),
      status: 'active',
    });

    console.log('[Seed] Created requirements. Creating donor item listings...');

    // 6. Item Donations
    const item1 = await ItemDonation.create({
      donorId: donor1._id,
      title: '25 Warm Winter Woolen Sweaters & Thermal Jackets',
      category: 'Clothes',
      quantity: 25,
      unit: 'jackets',
      description: 'Gently used clean jackets and sweaters for men and women, washed and packed in boxes.',
      condition: 'Like New',
      intendedRecipients: ['Homeless', 'Anyone in Need'],
      city: 'New Delhi',
      state: 'Delhi',
      pickupAddress: 'House 14B, Green Park Main, Near Metro Gate 2',
      pickupAvailability: 'Weekdays after 6:00 PM, All day Saturday',
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop',
      ],
      status: 'available',
    });

    const item2 = await ItemDonation.create({
      donorId: donor2._id,
      title: '8 Refurbished Intel Core i5 Laptops with Chargers',
      category: 'Electronics',
      quantity: 8,
      unit: 'laptops',
      description: 'Fully tested laptops with SSD, fresh Linux/Win install, ideal for computer labs in low-income schools.',
      condition: 'Good',
      intendedRecipients: ['Children', 'Women'],
      city: 'Bengaluru',
      state: 'Karnataka',
      pickupAddress: 'Tower 4, Sobha Quartz, Bellandur Outer Ring Road',
      pickupAvailability: 'Anytime with 2 hours advance notice',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
      ],
      status: 'claim_requested',
      claimedByNgoId: akshayaNgo._id,
    });

    await ItemClaim.create({
      itemDonationId: item2._id,
      ngoId: akshayaNgo._id,
      requestedQuantity: 8,
      status: 'pending',
      notes: 'We would love to install these laptops in our digital skill center for rural youth.',
      pickupSchedule: {
        date: new Date(Date.now() + 2 * 86400000),
        timeSlot: '11:00 AM - 1:00 PM',
        contactPhone: '9122334455',
        notes: 'Our volunteer van will arrive at your lobby.',
      },
    });

    const item3 = await ItemDonation.create({
      donorId: donor1._id,
      title: '80 Illustrated Children Storybooks & Encyclopedias',
      category: 'Books',
      quantity: 80,
      unit: 'books',
      description: 'Assorted English and Hindi children storybooks, illustrated science books, and puzzle collections.',
      condition: 'Like New',
      intendedRecipients: ['Children'],
      city: 'Mumbai',
      state: 'Maharashtra',
      pickupAddress: 'Flat 702, Sea Breeze Apts, Bandra West',
      pickupAvailability: 'Weekends 10 AM to 5 PM',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop',
      ],
      status: 'completed',
      claimedByNgoId: smileNgo._id,
    });

    await ItemClaim.create({
      itemDonationId: item3._id,
      ngoId: smileNgo._id,
      requestedQuantity: 80,
      status: 'completed',
      receivedAt: new Date(Date.now() - 5 * 86400000),
      notes: 'Received in perfect condition. Children in our library are ecstatic!',
    });

    console.log('[Seed] Created items. Creating sample monetary donations and receipts...');

    // 7. Monetary Donations with Receipts
    await MonetaryDonation.create({
      donorId: donor1._id,
      donorName: 'Vikram Aditya',
      donorEmail: 'donor@servex.org',
      donorPhone: '9811223344',
      ngoId: goonjNgo._id,
      campaignId: campaign1._id,
      amount: 15000,
      currency: 'INR',
      razorpayOrderId: 'order_test_seeded_001',
      razorpayPaymentId: 'pay_test_seeded_001',
      razorpaySignature: 'simulated_test_signature',
      paymentStatus: 'successful',
      receiptNumber: 'SRVX-20261021-VKA1',
      donorMessage: 'Hope this helps flood relief efforts in Bihar. More power to the Goonj ground volunteers!',
      isAnonymous: false,
    });

    await MonetaryDonation.create({
      donorId: donor1._id,
      donorName: 'Vikram Aditya',
      donorEmail: 'donor@servex.org',
      donorPhone: '9811223344',
      ngoId: smileNgo._id,
      campaignId: campaign2._id,
      amount: 5000,
      currency: 'INR',
      razorpayOrderId: 'order_test_seeded_002',
      razorpayPaymentId: 'pay_test_seeded_002',
      razorpaySignature: 'simulated_test_signature',
      paymentStatus: 'successful',
      receiptNumber: 'SRVX-20261021-VKA2',
      donorMessage: 'For the young girls’ education!',
      isAnonymous: false,
    });

    await MonetaryDonation.create({
      donorId: donor2._id,
      donorName: 'Priya Sharma',
      donorEmail: 'priya.sharma@example.com',
      donorPhone: '9822334455',
      ngoId: akshayaNgo._id,
      campaignId: campaign3._id,
      amount: 25000,
      currency: 'INR',
      razorpayOrderId: 'order_test_seeded_003',
      razorpayPaymentId: 'pay_test_seeded_003',
      razorpaySignature: 'simulated_test_signature',
      paymentStatus: 'successful',
      receiptNumber: 'SRVX-20261021-PSA1',
      donorMessage: 'In memory of my grandparents. Every child deserves food and dignity.',
      isAnonymous: false,
    });

    // 8. Notifications
    await Notification.create({
      userId: donor1._id,
      title: 'Item Claimed & Confirmed',
      message: 'Smile Foundation confirmed pickup and receipt of your 80 Children Books! Thank you!',
      type: 'success',
      link: '/donor/history',
      isRead: false,
    });

    await Notification.create({
      userId: goonjUser._id,
      title: 'New Donation Received',
      message: 'Vikram Aditya donated ₹15,000 for "Flood Relief & Emergency Food Kits 2026".',
      type: 'donation',
      link: '/ngo/donations',
      isRead: true,
    });

    console.log('[Seed] Database successfully seeded with demo accounts and rich data!');
    console.log('----------------------------------------------------');
    console.log('Seed Credentials Summary:');
    console.log('Admin: admin@servex.org / Admin@123');
    console.log('Donor: donor@servex.org / Donor@123');
    console.log('Verified NGOs: goonj@servex.org, akshayapatra@servex.org, smile@servex.org / Ngo@123');
    console.log('Pending NGO: hopeforstrays@example.com / Ngo@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
