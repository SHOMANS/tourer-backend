import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCarousel() {
  console.log('🎠 Seeding carousel items...');

  // Delete existing carousel items
  await prisma.carouselItem.deleteMany();

  // Create sample carousel items
  const carouselItems = await prisma.carouselItem.createMany({
    data: [
      {
        title: 'Special Offer: 50% Off Mountain Tours',
        description: 'Limited time offer on all mountain adventure packages',
        imageUrl:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        actionType: 'INTERNAL',
        actionValue: 'Tours',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'New Beach Paradise Packages Available',
        description: 'Discover our latest beach destinations',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
        actionType: 'EXTERNAL',
        actionValue: 'https://example.com/beach-tours',
        isActive: true,
        sortOrder: 2,
      },
      {
        title: 'Discover Cultural Heritage Tours',
        description: 'Explore rich cultural experiences worldwide',
        imageUrl:
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop',
        actionType: 'INTERNAL',
        actionValue: 'Tours',
        isActive: true,
        sortOrder: 3,
      },
    ],
  });

  console.log(`✅ Created ${carouselItems.count} carousel items`);
}

seedCarousel()
  .catch((e) => {
    console.error('❌ Carousel seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
