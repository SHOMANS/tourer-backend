import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if data already exists
  const existingPackages = await prisma.package.count();
  if (existingPackages > 0) {
    console.log('✅ Database already seeded, skipping...');
    return;
  }

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
        pricingType: 'PER_PERSON',
        duration: 3,
        maxGuests: 8,
        minAge: 12,
        difficulty: 'EASY',
        category: 'CITY',
        locationName: 'New York City',
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
        pricingType: 'PER_PERSON',
        duration: 5,
        maxGuests: 6,
        minAge: 16,
        difficulty: 'CHALLENGING',
        category: 'ADVENTURE',
        locationName: 'Rocky Mountains',
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
        pricingType: 'PER_PERSON',
        duration: 4,
        maxGuests: 12,
        minAge: 8,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Kyoto',
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

  // Create additional users for reviews
  const reviewUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah.johnson@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.chen@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Mike',
        lastName: 'Chen',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'elena.rodriguez@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Elena',
        lastName: 'Rodriguez',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.wilson@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'James',
        lastName: 'Wilson',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.brown@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Lisa',
        lastName: 'Brown',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
    }),
  ]);

  console.log(`✅ Created ${reviewUsers.length} review users`);

  // Get packages for reviews
  const createdPackages = await prisma.package.findMany();

  // Create reviews for City Explorer Package
  await prisma.review.createMany({
    data: [
      {
        userId: reviewUsers[0].id,
        packageId: createdPackages[0].id,
        rating: 5,
        title: 'Amazing city tour!',
        comment:
          'Had the most wonderful time exploring NYC with this tour. The guide was incredibly knowledgeable and showed us hidden gems I never would have found on my own. Times Square was spectacular, and the walk through Central Park was so peaceful. Highly recommend!',
        images: [
          'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 12,
        createdAt: new Date('2024-11-15'),
      },
      {
        userId: reviewUsers[1].id,
        packageId: createdPackages[0].id,
        rating: 4,
        title: 'Great experience overall',
        comment:
          'Really enjoyed this tour! The transportation was comfortable and the guide was friendly. Only minor complaint is that we felt a bit rushed at some locations, especially the Statue of Liberty. But overall, great value for money!',
        images: [
          'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 8,
        createdAt: new Date('2024-12-02'),
      },
      {
        userId: reviewUsers[2].id,
        packageId: createdPackages[0].id,
        rating: 5,
        title: 'Perfect for first-time visitors',
        comment:
          'This was exactly what we needed for our first trip to New York. Saw all the major attractions in just 3 days. The lunch included was delicious and the Brooklyn Bridge walk at sunset was magical. Will definitely book with them again!',
        isVerified: false,
        isApproved: true,
        helpfulVotes: 15,
        createdAt: new Date('2024-12-10'),
      },
      {
        userId: reviewUsers[3].id,
        packageId: createdPackages[0].id,
        rating: 4,
        title: 'Good tour, some improvements needed',
        comment:
          'The tour covered all the main attractions as promised. Guide was knowledgeable but could have been more engaging. Transportation was good but pickup was delayed by 20 minutes. Still a decent experience overall.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 5,
        createdAt: new Date('2024-12-18'),
      },
    ],
  });

  // Create reviews for Adventure Mountain Tour
  await prisma.review.createMany({
    data: [
      {
        userId: reviewUsers[1].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Life-changing adventure!',
        comment:
          'This 5-day mountain adventure was absolutely incredible! The views from the peaks were breathtaking, and camping under the stars was a once-in-a-lifetime experience. Our guide was very experienced and made sure everyone felt safe during the rock climbing sections. The wildlife viewing was a bonus - we saw eagles and mountain goats! Definitely challenging but so worth it.',
        images: [
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 23,
        createdAt: new Date('2024-10-20'),
      },
      {
        userId: reviewUsers[4].id,
        packageId: createdPackages[1].id,
        rating: 4,
        title: 'Challenging but amazing',
        comment:
          "This trek really pushed my limits but in the best way possible. The camping equipment provided was high quality and the meals were surprisingly good for mountain cooking. Only issue was the weather on day 3 - quite cold and rainy, but the guide handled it well. Make sure you're in good physical shape before attempting this!",
        isVerified: true,
        isApproved: true,
        helpfulVotes: 11,
        createdAt: new Date('2024-11-05'),
      },
      {
        userId: reviewUsers[0].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Best adventure tour ever!',
        comment:
          'Cannot recommend this enough! The rocky mountains are stunning and this tour really lets you experience them fully. The star gazing on clear nights was phenomenal - you can see the Milky Way clearly. Rock climbing section was well-organized with proper safety measures. Meals were hearty and perfect after long days of hiking.',
        images: [
          'https://images.unsplash.com/photo-1464822759844-d150ad6fbeb4?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 18,
        createdAt: new Date('2024-11-25'),
      },
    ],
  });

  // Create reviews for Cultural Heritage Journey
  await prisma.review.createMany({
    data: [
      {
        userId: reviewUsers[2].id,
        packageId: createdPackages[2].id,
        rating: 5,
        title: 'Immersive cultural experience',
        comment:
          "What an incredible journey through Kyoto's rich culture! The ancient temples were absolutely stunning, and our guide provided such deep insights into the history and traditions. The traditional tea ceremony was a highlight - so peaceful and enlightening. Walking through the bamboo forest felt like stepping into another world. The geisha district tour in the evening was magical.",
        images: [
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 19,
        createdAt: new Date('2024-09-15'),
      },
      {
        userId: reviewUsers[3].id,
        packageId: createdPackages[2].id,
        rating: 4,
        title: 'Beautiful cultural tour',
        comment:
          'Kyoto is absolutely beautiful and this tour does a great job showcasing its cultural heritage. The temples are magnificent and the tea ceremony was a unique experience. Our guide was very knowledgeable about Japanese history and customs. The traditional lunch was delicious. Only wish we had more time at each location.',
        isVerified: false,
        isApproved: true,
        helpfulVotes: 7,
        createdAt: new Date('2024-10-08'),
      },
      {
        userId: reviewUsers[4].id,
        packageId: createdPackages[2].id,
        rating: 5,
        title: 'Perfect introduction to Japanese culture',
        comment:
          'This tour exceeded all expectations! As someone who had never been to Japan before, this was the perfect introduction to the culture. The bamboo forest is even more beautiful in person than in photos. The temple visits were very respectful and informative. The geisha district was fascinating - learned so much about this traditional art form. Highly recommended for culture enthusiasts!',
        images: [
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 14,
        createdAt: new Date('2024-11-30'),
      },
      {
        userId: reviewUsers[1].id,
        packageId: createdPackages[2].id,
        rating: 4,
        title: 'Wonderful cultural immersion',
        comment:
          'Great tour for understanding Japanese culture and history. The temples are absolutely stunning and the guide provided excellent historical context. Tea ceremony was meditative and beautiful. Would have liked more free time to explore on our own, but overall a very enriching experience.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 9,
        createdAt: new Date('2024-12-05'),
      },
    ],
  });

  console.log('✅ Created comprehensive review data for all tours');

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
