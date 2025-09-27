import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample packages
  const packages = await prisma.package.createMany({
    data: [
      {
        title: 'City Explorer Package',
        description:
          'Explore the vibrant city with guided tours and local experiences',
        price: 299.99,
      },
      {
        title: 'Adventure Mountain Tour',
        description:
          'Experience thrilling mountain adventures and scenic views',
        price: 599.99,
      },
      {
        title: 'Cultural Heritage Journey',
        description: 'Immerse yourself in local culture and historical sites',
        price: 399.99,
      },
    ],
  });

  console.log(`✅ Created ${packages.count} sample packages`);

  // Create sample users with hashed passwords

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tourer.com',
      password: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: await bcrypt.hash('demo123', 12),
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);
  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Create a sample booking
  const packagesList = await prisma.package.findMany();
  if (packagesList.length > 0) {
    const booking = await prisma.booking.create({
      data: {
        userId: demoUser.id,
        packageId: packagesList[0].id,
        status: 'CONFIRMED',
      },
    });

    console.log(`✅ Created sample booking: ${booking.id}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
