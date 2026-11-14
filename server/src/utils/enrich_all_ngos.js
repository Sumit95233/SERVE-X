import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { NGO } from '../models/NGO.js';
import { Campaign } from '../models/Campaign.js';
import { ItemRequirement } from '../models/ItemRequirement.js';

// Category-based curated high-res logos
const CATEGORY_LOGOS = {
  'Education & Literacy': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=240&h=240&fit=crop',
  'Education': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=240&h=240&fit=crop',
  'Health & Healthcare': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=240&h=240&fit=crop',
  'Healthcare': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=240&h=240&fit=crop',
  'Women Empowerment': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop',
  'Child Protection & Welfare': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=240&h=240&fit=crop',
  'Child Welfare': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=240&h=240&fit=crop',
  'Hunger Relief & Food Security': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=240&h=240&fit=crop',
  'Food Security': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=240&h=240&fit=crop',
  'Environment & Climate': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=240&h=240&fit=crop',
  'Environment': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=240&h=240&fit=crop',
  'Rural & Village Development': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=240&h=240&fit=crop',
  'Rural Development': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=240&h=240&fit=crop',
  'Disability Support & Inclusion': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=240&h=240&fit=crop',
  'Disability Inclusion': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=240&h=240&fit=crop',
  'Elderly & Senior Care': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=240&h=240&fit=crop',
  'Elderly Care': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=240&h=240&fit=crop',
  'Animal Welfare': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=240&h=240&fit=crop',
  'Disaster Relief': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=240&h=240&fit=crop',
  'Clothing & Dignity': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=240&h=240&fit=crop',
  'Community Development': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=240&h=240&fit=crop',
};

// Campaign templates per category
const CAMPAIGN_TEMPLATES = {
  'Education & Literacy': {
    titlePrefix: 'Sponsor Education & Digital Classrooms for Children in',
    desc: 'Providing textbooks, digital tablets, and certified after-school tutoring for underprivileged children from slum and rural clusters.',
    causeCategory: 'Education',
    goalAmount: 350000,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&fit=crop',
  },
  'Health & Healthcare': {
    titlePrefix: 'Life-Saving Medical Care & Mobile Screening Vans for',
    desc: 'Bringing diagnostic screenings, essential medicines, and prenatal care directly to doorsteps of marginalized communities.',
    causeCategory: 'Healthcare',
    goalAmount: 500000,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&fit=crop',
  },
  'Women Empowerment': {
    titlePrefix: 'Vocational Sewing & Micro-Enterprise Training for Women in',
    desc: 'Empowering marginalized women through professional tailoring, financial literacy, and small business starter kits.',
    causeCategory: 'Women Empowerment',
    goalAmount: 400000,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&fit=crop',
  },
  'Child Protection & Welfare': {
    titlePrefix: 'Safe Shelter, Warm Meals & Holistic Care for Vulnerable Kids in',
    desc: 'Protecting at-risk children from child labor and neglect with 24/7 care, nutritious diets, and counselling.',
    causeCategory: 'Child Welfare',
    goalAmount: 450000,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&fit=crop',
  },
  'Hunger Relief & Food Security': {
    titlePrefix: 'Community Kitchens & Monthly Dry Ration Kits Distribution in',
    desc: 'Ensuring zero hunger across daily wage families, destitute elders, and migrant workers through wholesome daily meals.',
    causeCategory: 'Hunger Relief',
    goalAmount: 600000,
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&fit=crop',
  },
  'Environment & Climate': {
    titlePrefix: 'Community Native Afforestation & Clean Water Harvesting in',
    desc: 'Planting thousands of indigenous saplings and rejuvenating local water bodies for resilient climate ecosystems.',
    causeCategory: 'Environment',
    goalAmount: 300000,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&fit=crop',
  },
  'Rural & Village Development': {
    titlePrefix: 'Solar Electrification & Sustainable Clean Sanitation in',
    desc: 'Setting up community solar streetlights, clean drinking water filtration, and household bio-toilets.',
    causeCategory: 'Community Development',
    goalAmount: 420000,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop',
  },
  'Disability Support & Inclusion': {
    titlePrefix: 'Customized Wheelchairs & Assistive Hearing Aids for Specially-Abled in',
    desc: 'Providing high-quality assistive devices, physical therapy, and accessible skill development to enable self-reliance.',
    causeCategory: 'Healthcare',
    goalAmount: 380000,
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&fit=crop',
  },
  'Elderly & Senior Care': {
    titlePrefix: 'Geriatric Healthcare, Medicines & Compassionate Living for Elders in',
    desc: 'Supporting abandoned and destitute senior citizens with free geriatric checkups, chronic medicines, and dignity kits.',
    causeCategory: 'Elderly Care',
    goalAmount: 320000,
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&fit=crop',
  },
  'Animal Welfare': {
    titlePrefix: '24x7 Animal Rescue Ambulance & Emergency Shelter Care in',
    desc: 'Providing emergency trauma rescue, anti-rabies vaccination, and compassionate shelter care for injured stray animals.',
    causeCategory: 'Animal Welfare',
    goalAmount: 280000,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&fit=crop',
  },
};

const STATE_CODES = {
  'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS', 'Bihar': 'BR',
  'Chhattisgarh': 'CG', 'Goa': 'GA', 'Gujarat': 'GJ', 'Haryana': 'HR',
  'Himachal Pradesh': 'HP', 'Jharkhand': 'JH', 'Karnataka': 'KA', 'Kerala': 'KL',
  'Madhya Pradesh': 'MP', 'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
  'Mizoram': 'MZ', 'Nagaland': 'NL', 'Odisha': 'OD', 'Punjab': 'PB',
  'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN', 'Telangana': 'TS',
  'Tripura': 'TR', 'Uttar Pradesh': 'UP', 'Uttarakhand': 'UK', 'West Bengal': 'WB',
  'Andaman and Nicobar Islands': 'AN', 'Chandigarh': 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD', 'Delhi': 'DL',
  'Jammu and Kashmir': 'JK', 'Ladakh': 'LA', 'Lakshadweep': 'LD', 'Puducherry': 'PY',
};

async function enrichAllNgos() {
  try {
    await connectDB();
    console.log('[Enrich] Connected to MongoDB');

    const ngos = await NGO.find({}).sort({ createdAt: 1 });
    console.log(`[Enrich] Found ${ngos.length} NGOs in database to verify and enrich`);

    let enrichedCount = 0;
    let campaignsCreated = 0;
    let requirementsCreated = 0;

    for (let i = 0; i < ngos.length; i++) {
      const ngo = ngos[i];
      const primaryCategory = ngo.causeCategories?.[0] || 'Community Development';
      const cleanSlug = ngo.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 16);

      const stCode = STATE_CODES[ngo.state] || 'IN';

      // 1. Enrich NGO profile fields
      const logoUrl =
        CATEGORY_LOGOS[primaryCategory] ||
        CATEGORY_LOGOS['Community Development'] ||
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=240&h=240&fit=crop';

      const phone = ngo.phone || `+91 98${String(10000000 + ((i * 7919) % 89999999))}`;
      const email = ngo.email || `contact@${cleanSlug}.org.in`;
      const website = ngo.website || `https://${cleanSlug}.servex-partner.org`;
      const darpanId = ngo.darpanId || `${stCode}/2021/${String(100000 + i).padStart(7, '0')}`;
      const establishedYear = ngo.establishedYear || (2012 + (i % 10));
      const mission =
        ngo.mission ||
        `To pioneer sustainable grassroots development in ${ngo.city} and throughout ${ngo.state}, ensuring equal access to dignity, basic rights, and empowerment for every vulnerable individual.`;
      const beneficiaries =
        ngo.beneficiariesSupported || `${(12000 + ((i * 853) % 45000)).toLocaleString('en-IN')}+ Lives Impacted`;

      // Update fields
      ngo.logo = ngo.logo || logoUrl;
      ngo.phone = phone;
      ngo.email = email;
      ngo.website = website;
      ngo.darpanId = darpanId;
      ngo.establishedYear = establishedYear;
      ngo.taxExemption80G = true;
      ngo.section12A = true;
      ngo.mission = mission;
      ngo.beneficiariesSupported = beneficiaries;
      ngo.verificationStatus = 'verified';

      await ngo.save();
      enrichedCount++;

      // 2. Check if Campaign exists for this NGO
      const existingCampaign = await Campaign.findOne({ ngoId: ngo._id });
      if (!existingCampaign) {
        const tmpl = CAMPAIGN_TEMPLATES[primaryCategory] || CAMPAIGN_TEMPLATES['Education & Literacy'];
        const goalAmount = tmpl.goalAmount + ((i % 5) * 50000);
        const percentRaised = 0.4 + ((i * 7) % 45) / 100; // 40% to 85%
        const amountRaised = Math.round(goalAmount * percentRaised);
        const donorCount = Math.round(amountRaised / 1250);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30 + (i % 60));

        await Campaign.create({
          ngoId: ngo._id,
          title: `${tmpl.titlePrefix} ${ngo.city}`,
          description: `${tmpl.desc} Led by ${ngo.organizationName} with direct on-ground verification and zero administrative deduction.`,
          causeCategory: tmpl.causeCategory,
          goalAmount: goalAmount,
          amountRaised: amountRaised,
          donorCount: donorCount,
          images: [tmpl.image],
          city: ngo.city,
          startDate: new Date(),
          endDate: endDate,
          beneficiaryDescription: `Over ${Math.round(goalAmount / 400)} vulnerable community members and children across ${ngo.city}, ${ngo.state}.`,
          fundUsagePlan: '85% Direct program materials & essential aids, 10% On-ground logistics & distribution, 5% Monitoring & field verification.',
          status: 'active',
        });
        campaignsCreated++;
      }

      // 3. Check if Item Requirements exist for this NGO
      const existingReqs = await ItemRequirement.countDocuments({ ngoId: ngo._id });
      if (existingReqs === 0) {
        // Requirement 1
        await ItemRequirement.create({
          ngoId: ngo._id,
          title: primaryCategory.includes('Food')
            ? `Dry Ration Grocery Kits for Families in ${ngo.city}`
            : primaryCategory.includes('Education')
            ? `School Backpacks & Textbooks for Children in ${ngo.city}`
            : primaryCategory.includes('Health')
            ? `First Aid & Hygiene Care Packs for Elderly in ${ngo.city}`
            : `Essential Clothing & Blanket Distribution in ${ngo.city}`,
          category: primaryCategory.includes('Food')
            ? 'Food'
            : primaryCategory.includes('Education')
            ? 'Books'
            : primaryCategory.includes('Health')
            ? 'Medicine'
            : 'Clothes',
          quantityRequired: 200 + ((i * 15) % 300),
          quantityFulfilled: 50 + ((i * 7) % 120),
          unit: 'kits',
          description: `Urgent community distribution by ${ngo.organizationName} for marginalized households residing in peri-urban ${ngo.city}.`,
          intendedRecipients: ['Low-income Families', 'Children', 'Seniors'],
          urgency: (i % 3 === 0) ? 'urgent' : (i % 2 === 0) ? 'high' : 'medium',
          city: ngo.city,
          state: ngo.state,
          status: 'active',
        });

        // Requirement 2
        await ItemRequirement.create({
          ngoId: ngo._id,
          title: `Warm Winter Blankets & Clothes for Community Center in ${ngo.city}`,
          category: 'Clothes',
          quantityRequired: 150 + ((i * 20) % 200),
          quantityFulfilled: 40 + ((i * 9) % 80),
          unit: 'pieces',
          description: `High-quality winter protection blankets and warm wear for shelter residents supported by ${ngo.organizationName}.`,
          intendedRecipients: ['Shelter Inmates', 'Underprivileged Children'],
          urgency: 'high',
          city: ngo.city,
          state: ngo.state,
          status: 'active',
        });

        requirementsCreated += 2;
      }
    }

    console.log(`[Enrich] Successfully enriched ${enrichedCount} NGOs!`);
    console.log(`[Enrich] Created ${campaignsCreated} Active Campaigns!`);
    console.log(`[Enrich] Created ${requirementsCreated} Active Item Requirements!`);

    process.exit(0);
  } catch (err) {
    console.error('[Enrich] Error:', err);
    process.exit(1);
  }
}

enrichAllNgos();

