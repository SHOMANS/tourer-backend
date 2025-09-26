import { PrismaClient } from '@prisma/client';

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

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      // Note: No password for now (will be added in Phase 1 - Auth)
    },
  });

  console.log(`✅ Created sample user: ${user.email}`);

  // Create a sample booking
  const packagesList = await prisma.package.findMany();
  if (packagesList.length > 0) {
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
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
