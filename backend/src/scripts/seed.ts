import { connectDatabase, disconnectDatabase } from '../config/database';
import { Region } from '../models/Region';
import { Service } from '../models/Service';
import { Pricing } from '../models/Pricing';
import regionsData from '../data/regions.json';
import servicesData from '../data/services.json';
import pricingEc2UsEast1 from '../data/pricing-ec2-us-east-1.json';
import pricingEc2UsEast1Transfer from '../data/pricing-ec2-us-east-1-transfer.json';
import pricingS3UsEast1 from '../data/pricing-s3-us-east-1.json';
import pricingS3UsEast1Transfer from '../data/pricing-s3-us-east-1-transfer.json';
import pricingLambdaUsEast1 from '../data/pricing-lambda-us-east-1.json';
import pricingRdsUsEast1 from '../data/pricing-rds-us-east-1.json';

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Region.deleteMany({});
    await Service.deleteMany({});
    await Pricing.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed regions
    console.log('📍 Seeding regions...');
    await Region.insertMany(regionsData);
    console.log(`✅ ${regionsData.length} regions seeded\n`);

    // Seed services
    console.log('🔧 Seeding services...');
    await Service.insertMany(servicesData);
    console.log(`✅ ${servicesData.length} services seeded\n`);

    // Seed pricing data
    console.log('💰 Seeding pricing data...');
    const pricingDocs = [
      pricingEc2UsEast1,
      pricingEc2UsEast1Transfer,
      pricingS3UsEast1,
      pricingS3UsEast1Transfer,
      pricingLambdaUsEast1,
      pricingRdsUsEast1,
    ];

    await Pricing.insertMany(pricingDocs);
    console.log(`✅ ${pricingDocs.length} pricing documents seeded\n`);

    // Summary
    console.log('╔════════════════════════════════════════╗');
    console.log('║                                        ║');
    console.log('║   ✅ Database seeded successfully!     ║');
    console.log('║                                        ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('Summary:');
    console.log(`  - Regions: ${regionsData.length}`);
    console.log(`  - Services: ${servicesData.length}`);
    console.log(`  - Pricing documents: ${pricingDocs.length}`);
    console.log();

    console.log('Services available:');
    servicesData.forEach((service) => {
      console.log(`  - ${service.name} (${service.code}): ${service.fullName}`);
    });
    console.log();

    // Disconnect
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

// Run seed
seedDatabase();
