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
          'Explore the vibrant city with guided tours and local experiences. Perfect for first-time visitors who want to see the main attractions.',
        shortDescription: 'Explore the vibrant city with guided tours',
        price: 299.99,
        originalPrice: 349.99,
        currency: 'USD',
        duration: 3,
        maxGuests: 8,
        minAge: 12,
        difficulty: 'EASY',
        category: 'CITY',
        location: 'New York City',
        country: 'USA',
        coordinates: '{"lat": 40.7128, "lng": -74.0060}',
        images: [
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
          'https://images.unsplash.com/photo-1514565131-fce0801e5785',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
        highlights: [
          'Times Square',
          'Central Park',
          'Statue of Liberty',
          'Brooklyn Bridge',
        ],
        includes: ['Transportation', 'Tour Guide', 'Entry Fees', 'Lunch'],
        excludes: ['Hotel Accommodation', 'Personal Expenses', 'Tips'],
        tags: ['city', 'urban', 'sightseeing', 'culture'],
        isActive: true,
        isAvailable: true,
        rating: 4.5,
        reviewCount: 127,
        slug: 'city-explorer-package-nyc',
      },
      {
        title: 'Adventure Mountain Tour',
        description:
          'Experience thrilling mountain adventures and scenic views. This multi-day trek includes camping under the stars.',
        shortDescription: 'Thrilling mountain adventures and scenic views',
        price: 599.99,
        originalPrice: 699.99,
        currency: 'USD',
        duration: 5,
        maxGuests: 6,
        minAge: 16,
        difficulty: 'CHALLENGING',
        category: 'ADVENTURE',
        location: 'Rocky Mountains',
        country: 'USA',
        coordinates: '{"lat": 40.3428, "lng": -105.6836}',
        images: [
          'https://images.unsplash.com/photo-1464822759844-d150ad6fbeb4',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1604763655221-b98ebdac6ddf?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFibGUlMjBtb3VudGFpbiUyQyUyMGNhcGUlMjB0b3duJTJDJTIwc291dGglMjBhZnJpY2F8ZW58MHx8MHx8fDA%3D',
        highlights: [
          'Mountain Peaks',
          'Wildlife Viewing',
          'Star Gazing',
          'Rock Climbing',
        ],
        includes: [
          'Camping Equipment',
          'Meals',
          'Professional Guide',
          'Safety Equipment',
        ],
        excludes: ['Personal Gear', 'Travel Insurance', 'Alcoholic Beverages'],
        tags: ['adventure', 'mountains', 'hiking', 'camping'],
        isActive: true,
        isAvailable: true,
        rating: 4.8,
        reviewCount: 89,
        slug: 'adventure-mountain-tour-rocky',
      },
      {
        title: 'Cultural Heritage Journey',
        description:
          'Immerse yourself in local culture and historical sites. Visit ancient temples, museums, and traditional markets.',
        shortDescription: 'Immerse in local culture and historical sites',
        price: 399.99,
        currency: 'USD',
        duration: 4,
        maxGuests: 12,
        minAge: 8,
        difficulty: 'EASY',
        category: 'CULTURAL',
        location: 'Kyoto',
        country: 'Japan',
        coordinates: '{"lat": 35.0116, "lng": 135.7681}',
        images: [
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
        ],
        coverImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9',
        highlights: [
          'Ancient Temples',
          'Traditional Tea Ceremony',
          'Bamboo Forest',
          'Geisha District',
        ],
        includes: [
          'Cultural Guide',
          'Tea Ceremony',
          'Temple Entrance',
          'Traditional Lunch',
        ],
        excludes: ['Flights', 'Hotel', 'Shopping', 'Personal Expenses'],
        tags: ['culture', 'history', 'temples', 'traditional'],
        isActive: true,
        isAvailable: true,
        rating: 4.7,
        reviewCount: 156,
        slug: 'cultural-heritage-journey-kyoto',
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

  // Create sample carousel items
  const carouselItems = await prisma.carouselItem.createMany({
    data: [
      {
        title: 'Special Offer: 50% Off Mountain Tours',
        description: 'Limited time offer on all mountain adventure packages',
        imageUrl:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
        actionType: 'INTERNAL',
        actionValue: 'Tours',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'New Beach Paradise Packages Available',
        description: 'Discover our latest beach destinations',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop',
        actionType: 'EXTERNAL',
        actionValue: 'https://example.com/beach-tours',
        isActive: true,
        sortOrder: 2,
      },
      {
        title: 'Discover Cultural Heritage Tours',
        description: 'Explore rich cultural experiences worldwide',
        imageUrl:
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop',
        actionType: 'INTERNAL',
        actionValue: 'Tours',
        isActive: true,
        sortOrder: 3,
      },
    ],
  });

  console.log(`✅ Created ${carouselItems.count} carousel items`);

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
