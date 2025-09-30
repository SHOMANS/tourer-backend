import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Always seed fresh data (remove the check)
  console.log('🔄 Clearing existing data and seeding fresh...');

  // Clear existing data in the correct order (due to foreign key constraints)
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.carouselItem.deleteMany({});

  console.log('✅ Existing data cleared');

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
        slug: 'cultural-heritage-journey-kyoto',
      },
      // Cape Town Tours - 20 New Tours
      {
        title: 'Table Mountain Cable Car Adventure',
        description:
          'Take the iconic cable car to the top of Table Mountain and enjoy breathtaking panoramic views of Cape Town, the Atlantic Ocean, and surrounding mountains.',
        shortDescription: 'Cable car to Table Mountain with panoramic views',
        price: 89.99,
        originalPrice: 99.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 15,
        minAge: 5,
        difficulty: 'EASY',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9628, "lng": 18.4098}',
        images: [
          'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          'https://images.unsplash.com/photo-1604763655221-b98ebdac6ddf',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
        highlights: [
          'Cable Car Ride',
          'Panoramic Views',
          'Table Mountain Summit',
          'Photo Opportunities',
        ],
        includes: [
          'Return Cable Car Tickets',
          'Professional Guide',
          'Safety Briefing',
        ],
        excludes: ['Meals', 'Personal Expenses', 'Hiking Equipment'],
        tags: ['table mountain', 'cable car', 'views', 'landmark'],
        isActive: true,
        isAvailable: true,
        rating: 4.8,
        slug: 'table-mountain-cable-car-cape-town',
      },
      {
        title: 'Robben Island Historical Tour',
        description:
          'Visit the historic Robben Island where Nelson Mandela was imprisoned. This UNESCO World Heritage site offers a powerful journey through South African history.',
        shortDescription: "Historical tour of Nelson Mandela's former prison",
        price: 65.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 20,
        minAge: 8,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.8067, "lng": 18.3700}',
        images: [
          'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5',
        highlights: [
          "Mandela's Prison Cell",
          'Former Political Prison',
          'UNESCO Heritage Site',
          'Historical Commentary',
        ],
        includes: [
          'Return Ferry Transfer',
          'Island Tour',
          'Ex-Political Prisoner Guide',
          'Museum Entry',
        ],
        excludes: ['Meals', 'Gratuities', 'Personal Expenses'],
        tags: ['history', 'mandela', 'prison', 'unesco', 'heritage'],
        isActive: true,
        isAvailable: true,
        rating: 4.9,
        slug: 'robben-island-historical-tour-cape-town',
      },
      {
        title: 'Cape Peninsula Full Day Safari',
        description:
          "Explore the stunning Cape Peninsula including Chapman's Peak, Boulders Beach penguins, and Cape of Good Hope. A full day of breathtaking coastal scenery.",
        shortDescription: 'Full day Cape Peninsula with penguins and coast',
        price: 149.99,
        originalPrice: 179.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 12,
        minAge: 6,
        difficulty: 'EASY',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.3587, "lng": 18.4777}',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
          'https://images.unsplash.com/photo-1578489758854-f134a358f08b',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        highlights: [
          "Chapman's Peak Drive",
          'Boulders Beach Penguins',
          'Cape of Good Hope',
          'Coastal Scenery',
        ],
        includes: [
          'Transportation',
          'Professional Guide',
          'Penguin Colony Visit',
          'Lunch',
        ],
        excludes: ['Personal Expenses', 'Optional Activities', 'Gratuities'],
        tags: ['peninsula', 'penguins', 'coast', 'nature', 'scenic drive'],
        isActive: true,
        isAvailable: true,
        rating: 4.7,
        slug: 'cape-peninsula-full-day-safari-cape-town',
      },
      {
        title: 'Stellenbosch Wine Tasting Experience',
        description:
          'Discover world-class wines in the beautiful Stellenbosch region. Visit premium wineries and enjoy tastings paired with local cuisine.',
        shortDescription: 'Wine tasting in Stellenbosch wine region',
        price: 129.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 10,
        minAge: 18,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9321, "lng": 18.8602}',
        images: [
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
        highlights: [
          'Premium Wine Tastings',
          'Vineyard Tours',
          'Local Cuisine Pairing',
          'Scenic Wine Estates',
        ],
        includes: [
          'Transportation',
          'Wine Tastings',
          'Cellar Tours',
          'Lunch Pairing',
        ],
        excludes: [
          'Additional Wine Purchases',
          'Personal Expenses',
          'Gratuities',
        ],
        tags: ['wine', 'stellenbosch', 'vineyards', 'tasting', 'culinary'],
        isActive: true,
        isAvailable: true,
        rating: 4.6,
        slug: 'stellenbosch-wine-tasting-cape-town',
      },
      {
        title: "Lion's Head Sunrise Hike",
        description:
          "Start early and hike to the summit of Lion's Head for a spectacular sunrise over Cape Town and Table Mountain. A moderate hike with incredible rewards.",
        shortDescription: "Sunrise hike to Lion's Head summit",
        price: 79.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 8,
        minAge: 12,
        difficulty: 'MODERATE',
        category: 'ADVENTURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9249, "lng": 18.4241}',
        images: [
          'https://images.unsplash.com/photo-1464822759844-d150ad6fbeb4',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1464822759844-d150ad6fbeb4',
        highlights: [
          'Sunrise Views',
          'City Panorama',
          'Table Mountain Views',
          'Hiking Challenge',
        ],
        includes: [
          'Professional Guide',
          'Safety Equipment',
          'Headlamps',
          'Light Breakfast',
        ],
        excludes: ['Transportation', 'Hiking Boots', 'Personal Expenses'],
        tags: ['hiking', 'sunrise', 'lions head', 'adventure', 'views'],
        isActive: true,
        isAvailable: true,
        rating: 4.8,
        slug: 'lions-head-sunrise-hike-cape-town',
      },
      {
        title: 'V&A Waterfront Shopping & Dining',
        description:
          'Explore the vibrant V&A Waterfront with its shops, restaurants, and entertainment. Enjoy harbor views and visit the Two Oceans Aquarium.',
        shortDescription: 'Waterfront shopping, dining and aquarium visit',
        price: 69.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 15,
        minAge: 5,
        difficulty: 'EASY',
        category: 'CITY',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9030, "lng": 18.4194}',
        images: [
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
        highlights: [
          'Two Oceans Aquarium',
          'Harbor Views',
          'Shopping Mall',
          'Dining Options',
        ],
        includes: [
          'Aquarium Entry',
          'Walking Tour',
          'Shopping Guide',
          'Harbor Cruise',
        ],
        excludes: ['Meals', 'Shopping Purchases', 'Personal Expenses'],
        tags: ['waterfront', 'shopping', 'aquarium', 'harbor', 'leisure'],
        isActive: true,
        isAvailable: true,
        rating: 4.4,
        slug: 'va-waterfront-shopping-dining-cape-town',
      },
      {
        title: 'Kirstenbosch Botanical Gardens Tour',
        description:
          "Discover one of the world's most beautiful botanical gardens at the foot of Table Mountain. Explore indigenous South African plants and stunning landscapes.",
        shortDescription: 'World-renowned botanical gardens exploration',
        price: 45.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 20,
        minAge: 5,
        difficulty: 'EASY',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9884, "lng": 18.4319}',
        images: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
        highlights: [
          'Indigenous Flora',
          'Canopy Walkway',
          'Sculpture Garden',
          'Mountain Views',
        ],
        includes: [
          'Garden Entry',
          'Guided Tour',
          'Botanical Information',
          'Walking Maps',
        ],
        excludes: ['Transportation', 'Meals', 'Personal Expenses'],
        tags: ['botanical', 'gardens', 'nature', 'flora', 'kirstenbosch'],
        isActive: true,
        isAvailable: true,
        rating: 4.5,
        slug: 'kirstenbosch-botanical-gardens-cape-town',
      },
      {
        title: 'Bo-Kaap Cultural Walking Tour',
        description:
          'Explore the colorful Bo-Kaap neighborhood and learn about Cape Malay culture, history, and cuisine. Visit the museum and traditional spice shops.',
        shortDescription: 'Colorful Bo-Kaap cultural neighborhood tour',
        price: 55.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 12,
        minAge: 8,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9176, "lng": 18.4145}',
        images: [
          'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
          'https://images.unsplash.com/photo-1605713288999-73e4bb8ad408',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
        highlights: [
          'Colorful Houses',
          'Cape Malay Culture',
          'Historical Museum',
          'Traditional Spices',
        ],
        includes: [
          'Walking Tour',
          'Cultural Guide',
          'Museum Entry',
          'Spice Tasting',
        ],
        excludes: ['Transportation', 'Meals', 'Personal Purchases'],
        tags: ['bo-kaap', 'culture', 'colorful', 'malay', 'heritage'],
        isActive: true,
        isAvailable: true,
        rating: 4.6,
        slug: 'bo-kaap-cultural-walking-tour-cape-town',
      },
      {
        title: 'Hermanus Whale Watching Day Trip',
        description:
          'Travel to Hermanus for the best land-based whale watching in the world. Spot Southern Right whales during season (June-November).',
        shortDescription: 'Best whale watching from Hermanus coastal cliffs',
        price: 169.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 14,
        minAge: 6,
        difficulty: 'EASY',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.4187, "lng": 19.2345}',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
        ],
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        highlights: [
          'Southern Right Whales',
          'Cliff Path Walking',
          'Coastal Views',
          'Marine Wildlife',
        ],
        includes: [
          'Transportation',
          'Professional Guide',
          'Whale Watching',
          'Lunch',
        ],
        excludes: ['Personal Expenses', 'Binoculars Rental', 'Gratuities'],
        tags: ['whales', 'hermanus', 'marine', 'nature', 'wildlife'],
        isActive: true,
        isAvailable: true,
        rating: 4.7,
        slug: 'hermanus-whale-watching-day-trip-cape-town',
      },
      {
        title: "Chapman's Peak Scenic Drive",
        description:
          "Experience one of the world's most spectacular coastal drives along Chapman's Peak with stunning ocean and mountain views.",
        shortDescription: "World's most scenic coastal mountain drive",
        price: 99.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 6,
        minAge: 5,
        difficulty: 'EASY',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.1386, "lng": 18.3595}',
        images: [
          'https://images.unsplash.com/photo-1578489758854-f134a358f08b',
          'https://images.unsplash.com/photo-1505142468610-359e7d316be0',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1578489758854-f134a358f08b',
        highlights: [
          'Scenic Coastal Drive',
          'Mountain Views',
          'Ocean Panoramas',
          'Photo Stops',
        ],
        includes: [
          'Private Vehicle',
          'Professional Driver',
          'Photo Stops',
          'Commentary',
        ],
        excludes: ['Meals', 'Personal Expenses', 'Road Tolls'],
        tags: ['scenic drive', 'chapmans peak', 'coastal', 'photography'],
        isActive: true,
        isAvailable: true,
        rating: 4.8,
        slug: 'chapmans-peak-scenic-drive-cape-town',
      },
      {
        title: 'Great White Shark Cage Diving',
        description:
          "Experience the ultimate adrenaline rush with great white shark cage diving in Gansbaai. Face-to-face with nature's apex predator.",
        shortDescription: 'Cage diving with great white sharks',
        price: 299.99,
        originalPrice: 349.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 8,
        minAge: 12,
        difficulty: 'CHALLENGING',
        category: 'ADVENTURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.5843, "lng": 19.3518}',
        images: [
          'https://images.unsplash.com/photo-1591025207163-942350e47db2',
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1591025207163-942350e47db2',
        highlights: [
          'Great White Sharks',
          'Cage Diving',
          'Marine Adventure',
          'Professional Safety',
        ],
        includes: [
          'Boat Transfer',
          'Cage Diving Equipment',
          'Safety Briefing',
          'Light Breakfast',
        ],
        excludes: ['Wetsuit Rental', 'Personal Expenses', 'Underwater Camera'],
        tags: ['sharks', 'diving', 'adventure', 'marine', 'adrenaline'],
        isActive: true,
        isAvailable: true,
        rating: 4.9,
        slug: 'great-white-shark-cage-diving-cape-town',
      },
      {
        title: 'Cape Winelands Helicopter Tour',
        description:
          'Soar above the stunning Cape Winelands in a helicopter. See vineyards, mountains, and valleys from a unique aerial perspective.',
        shortDescription: 'Helicopter tour over Cape Winelands',
        price: 449.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 4,
        minAge: 8,
        difficulty: 'EASY',
        category: 'LUXURY',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.8823, "lng": 18.8970}',
        images: [
          'https://images.unsplash.com/photo-1541963463532-d68292c34d19',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1541963463532-d68292c34d19',
        highlights: [
          'Helicopter Flight',
          'Aerial Vineyards',
          'Mountain Views',
          'Luxury Experience',
        ],
        includes: [
          'Helicopter Flight',
          'Professional Pilot',
          'Safety Equipment',
          'Champagne Toast',
        ],
        excludes: [
          'Transportation to Helipad',
          'Personal Expenses',
          'Photography',
        ],
        tags: ['helicopter', 'aerial', 'winelands', 'luxury', 'scenic'],
        isActive: true,
        isAvailable: true,
        rating: 4.9,
        slug: 'cape-winelands-helicopter-tour-cape-town',
      },
      {
        title: 'Township Cultural Experience',
        description:
          'Visit local townships and experience authentic South African culture. Learn about history, meet locals, and enjoy traditional music and food.',
        shortDescription: 'Authentic township culture and community visit',
        price: 89.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 10,
        minAge: 8,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9857, "lng": 18.6418}',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
          'https://images.unsplash.com/photo-1605713288999-73e4bb8ad408',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        highlights: [
          'Township Life',
          'Cultural Exchange',
          'Traditional Music',
          'Local Cuisine',
        ],
        includes: [
          'Cultural Guide',
          'Community Visit',
          'Traditional Meal',
          'Music Performance',
        ],
        excludes: [
          'Transportation',
          'Personal Expenses',
          'Additional Donations',
        ],
        tags: ['township', 'culture', 'community', 'authentic', 'traditional'],
        isActive: true,
        isAvailable: true,
        rating: 4.7,
        slug: 'township-cultural-experience-cape-town',
      },
      {
        title: 'Constantia Wine Valley Tour',
        description:
          "Explore the historic Constantia wine valley, South Africa's oldest wine region. Visit premium estates and taste world-class wines.",
        shortDescription: 'Historic Constantia wine valley exploration',
        price: 119.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 12,
        minAge: 18,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.0345, "lng": 18.4241}',
        images: [
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        highlights: [
          'Historic Wine Estates',
          'Premium Tastings',
          'Wine Education',
          'Scenic Vineyards',
        ],
        includes: [
          'Transportation',
          'Wine Tastings',
          'Estate Tours',
          'Wine Education',
        ],
        excludes: ['Meals', 'Wine Purchases', 'Personal Expenses'],
        tags: ['constantia', 'wine', 'historic', 'premium', 'estates'],
        isActive: true,
        isAvailable: true,
        rating: 4.6,
        slug: 'constantia-wine-valley-tour-cape-town',
      },
      {
        title: 'Signal Hill Sunset Experience',
        description:
          'Watch the spectacular sunset from Signal Hill overlooking Cape Town and the Atlantic Ocean. Perfect spot for romantic evening views.',
        shortDescription: 'Spectacular sunset views from Signal Hill',
        price: 39.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 20,
        minAge: 5,
        difficulty: 'EASY',
        category: 'ROMANTIC',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9249, "lng": 18.4094}',
        images: [
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
          'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
        highlights: [
          'Sunset Views',
          'City Panorama',
          'Atlantic Ocean',
          'Romantic Setting',
        ],
        includes: [
          'Transportation',
          'Professional Guide',
          'Sunset Photography',
          'Light Refreshments',
        ],
        excludes: ['Meals', 'Personal Expenses', 'Alcohol'],
        tags: ['sunset', 'signal hill', 'romantic', 'views', 'photography'],
        isActive: true,
        isAvailable: true,
        rating: 4.5,
        slug: 'signal-hill-sunset-experience-cape-town',
      },
      {
        title: 'Cape Town City Bowl Walking Tour',
        description:
          "Explore the heart of Cape Town on foot. Visit historic sites, modern attractions, and learn about the city's fascinating history.",
        shortDescription: 'Historic walking tour through Cape Town center',
        price: 49.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 15,
        minAge: 8,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9249, "lng": 18.4241}',
        images: [
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
          'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
        highlights: [
          'Historic Buildings',
          'City Center',
          'Cultural Sites',
          'Local Stories',
        ],
        includes: [
          'Walking Tour',
          'Professional Guide',
          'Historical Commentary',
          'Photo Stops',
        ],
        excludes: ['Transportation', 'Meals', 'Personal Expenses'],
        tags: ['walking tour', 'city center', 'historic', 'cultural', 'urban'],
        isActive: true,
        isAvailable: true,
        rating: 4.4,
        slug: 'cape-town-city-bowl-walking-tour',
      },
      {
        title: 'Boulders Beach Penguin Colony',
        description:
          'Visit the famous African penguin colony at Boulders Beach. Walk among these charming birds in their natural habitat.',
        shortDescription: 'African penguin colony at pristine beach',
        price: 59.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 16,
        minAge: 5,
        difficulty: 'EASY',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.1975, "lng": 18.4504}',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
          'https://images.unsplash.com/photo-1578489758854-f134a358f08b',
        ],
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        highlights: [
          'African Penguins',
          'Natural Habitat',
          'Beach Setting',
          'Wildlife Photography',
        ],
        includes: [
          'Conservation Fee',
          'Boardwalk Access',
          'Professional Guide',
          'Educational Commentary',
        ],
        excludes: ['Transportation', 'Meals', 'Personal Expenses'],
        tags: ['penguins', 'wildlife', 'beach', 'conservation', 'nature'],
        isActive: true,
        isAvailable: true,
        rating: 4.6,
        slug: 'boulders-beach-penguin-colony-cape-town',
      },
      {
        title: 'Franschhoek Wine Tram Experience',
        description:
          'Hop on the iconic wine tram through Franschhoek valley. Visit multiple wine estates and enjoy tastings in this picturesque setting.',
        shortDescription: 'Wine tram through Franschhoek wine valley',
        price: 159.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 14,
        minAge: 18,
        difficulty: 'EASY',
        category: 'CULTURAL',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -33.9036, "lng": 19.1306}',
        images: [
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
          'https://images.unsplash.com/photo-1541963463532-d68292c34d19',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
        highlights: [
          'Wine Tram Ride',
          'Multiple Estates',
          'Valley Views',
          'Gourmet Tastings',
        ],
        includes: [
          'Wine Tram Tickets',
          'Wine Tastings',
          'Estate Visits',
          'Tram Commentary',
        ],
        excludes: ['Transportation to Franschhoek', 'Meals', 'Wine Purchases'],
        tags: ['wine tram', 'franschhoek', 'valley', 'estates', 'gourmet'],
        isActive: true,
        isAvailable: true,
        rating: 4.8,
        slug: 'franschhoek-wine-tram-experience-cape-town',
      },
      {
        title: 'Cape Point and Two Oceans Discovery',
        description:
          'Journey to Cape Point where the Atlantic and Indian Oceans meet. Visit the lighthouse and explore the dramatic coastal landscape.',
        shortDescription: "Where two oceans meet at Africa's tip",
        price: 139.99,
        currency: 'USD',
        pricingType: 'PER_PERSON',
        duration: 1,
        maxGuests: 12,
        minAge: 6,
        difficulty: 'MODERATE',
        category: 'NATURE',
        locationName: 'Cape Town',
        country: 'South Africa',
        coordinates: '{"lat": -34.3587, "lng": 18.4777}',
        images: [
          'https://images.unsplash.com/photo-1505142468610-359e7d316be0',
          'https://images.unsplash.com/photo-1578489758854-f134a358f08b',
        ],
        coverImage:
          'https://images.unsplash.com/photo-1505142468610-359e7d316be0',
        highlights: [
          'Cape Point Lighthouse',
          'Two Oceans Meeting',
          'Dramatic Cliffs',
          'Coastal Hiking',
        ],
        includes: [
          'Transportation',
          'Park Entry',
          'Lighthouse Visit',
          'Professional Guide',
        ],
        excludes: ['Meals', 'Funicular Ride', 'Personal Expenses'],
        tags: ['cape point', 'lighthouse', 'oceans', 'dramatic', 'coastal'],
        isActive: true,
        isAvailable: true,
        rating: 4.7,
        slug: 'cape-point-two-oceans-discovery-cape-town',
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

  // Create additional users for more diverse reviews
  const moreReviewUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'david.kim@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'David',
        lastName: 'Kim',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.garcia@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.thompson@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Alex',
        lastName: 'Thompson',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jennifer.lee@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Jennifer',
        lastName: 'Lee',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'robert.williams@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Robert',
        lastName: 'Williams',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sophia.martinez@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Sophia',
        lastName: 'Martinez',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'thomas.anderson@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Thomas',
        lastName: 'Anderson',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma.davis@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'kevin.brown@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Kevin',
        lastName: 'Brown',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'natalie.white@email.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Natalie',
        lastName: 'White',
        role: 'USER',
        photoUrl:
          'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face',
      },
    }),
  ]);

  // Combine all review users
  const allReviewUsers = [...reviewUsers, ...moreReviewUsers];

  console.log(`✅ Created ${allReviewUsers.length} review users`);

  // Get packages for reviews
  const createdPackages = await prisma.package.findMany();

  // Create reviews for City Explorer Package
  await prisma.review.createMany({
    data: [
      {
        userId: allReviewUsers[0].id,
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
        userId: allReviewUsers[1].id,
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
        userId: allReviewUsers[2].id,
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
        userId: allReviewUsers[3].id,
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
      {
        userId: allReviewUsers[4].id,
        packageId: createdPackages[0].id,
        rating: 5,
        title: 'Exceeded expectations!',
        comment:
          'This tour was absolutely fantastic! Our guide Maria was entertaining and informative. The pace was just right - not too rushed but we saw everything we wanted. Central Park in the fall was breathtaking. The included lunch was much better than expected. Highly recommend for families!',
        images: [
          'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 22,
        createdAt: new Date('2024-11-08'),
      },
      {
        userId: allReviewUsers[5].id,
        packageId: createdPackages[0].id,
        rating: 3,
        title: 'Average experience',
        comment:
          'The tour was okay but nothing special. We visited all the main attractions but felt like we were being herded around. The guide was knowledgeable but not very engaging. Transportation was clean and on time. For the price, I expected a bit more personalized experience.',
        isVerified: false,
        isApproved: true,
        helpfulVotes: 3,
        createdAt: new Date('2024-12-01'),
      },
      {
        userId: allReviewUsers[6].id,
        packageId: createdPackages[0].id,
        rating: 5,
        title: 'Best NYC tour ever!',
        comment:
          'Amazing experience from start to finish! The guide was funny and knew so many interesting stories about each location. Times Square at night was incredible, and the Statue of Liberty ferry ride was smooth. The Brooklyn Bridge walk was a highlight - amazing views! Worth every penny.',
        images: [
          'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 28,
        createdAt: new Date('2024-10-25'),
      },
      {
        userId: allReviewUsers[7].id,
        packageId: createdPackages[0].id,
        rating: 4,
        title: 'Great value for money',
        comment:
          "Solid tour that covers all the NYC must-sees. The guide was professional and the transportation was comfortable. Only complaint is that some stops felt rushed, especially at the 9/11 Memorial. But for the price and what you get, it's a good deal. Would recommend to budget-conscious travelers.",
        isVerified: true,
        isApproved: true,
        helpfulVotes: 11,
        createdAt: new Date('2024-11-22'),
      },
      {
        userId: allReviewUsers[8].id,
        packageId: createdPackages[0].id,
        rating: 5,
        title: 'Unforgettable NYC adventure',
        comment:
          'This tour made our NYC trip memorable! The guide shared fascinating history and local insights at each stop. Central Park was gorgeous, and seeing the Statue of Liberty up close was emotional. The lunch spot was a local favorite with amazing views. Small group size made it feel more personal.',
        images: [
          'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=400&h=300&fit=crop',
        ],
        isVerified: false,
        isApproved: true,
        helpfulVotes: 17,
        createdAt: new Date('2024-09-30'),
      },
      {
        userId: allReviewUsers[9].id,
        packageId: createdPackages[0].id,
        rating: 4,
        title: 'Comprehensive city tour',
        comment:
          "Well-organized tour that efficiently covers NYC's top attractions. The guide was knowledgeable about history and current events. Transportation was punctual and comfortable. Would have liked more free time at each location, but understand the time constraints. Good introduction to the city.",
        isVerified: true,
        isApproved: true,
        helpfulVotes: 9,
        createdAt: new Date('2024-12-05'),
      },
      {
        userId: allReviewUsers[10].id,
        packageId: createdPackages[0].id,
        rating: 5,
        title: 'Perfect family experience',
        comment:
          'Traveled with kids (8 and 12) and this tour was perfect for the whole family. The guide kept everyone engaged with fun facts and stories. Kids loved the ferry ride to the Statue of Liberty. Central Park playground break was a nice touch. Great photos at every stop!',
        images: [
          'https://images.unsplash.com/photo-1520637836862-4d197d17c82a?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1484242857719-4b9144542727?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 25,
        createdAt: new Date('2024-10-15'),
      },
      {
        userId: allReviewUsers[11].id,
        packageId: createdPackages[0].id,
        rating: 3,
        title: 'Tourist trap feeling',
        comment:
          "While the tour covered all major attractions, it felt very touristy and rushed. Large group size made it impersonal. Guide was professional but felt scripted. Transportation was good. For first-time visitors it's fine, but if you want a more authentic NYC experience, might want to explore other options.",
        isVerified: false,
        isApproved: true,
        helpfulVotes: 7,
        createdAt: new Date('2024-11-18'),
      },
    ],
  });

  // Create reviews for Adventure Mountain Tour
  await prisma.review.createMany({
    data: [
      {
        userId: allReviewUsers[1].id,
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
        userId: allReviewUsers[4].id,
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
        userId: allReviewUsers[0].id,
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
      {
        userId: allReviewUsers[6].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Epic mountain adventure!',
        comment:
          'This was hands down the best outdoor experience of my life! The scenery was absolutely stunning - every day brought new breathtaking views. The guides were professional and safety-conscious. Equipment was top-notch. The rock climbing portions were thrilling but felt completely safe. Would do this again in a heartbeat!',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 31,
        createdAt: new Date('2024-09-12'),
      },
      {
        userId: allReviewUsers[8].id,
        packageId: createdPackages[1].id,
        rating: 4,
        title: 'Great adventure with minor issues',
        comment:
          'Overall fantastic experience! The mountain views were incredible and the guide was knowledgeable about the local flora and fauna. Camping under the stars was magical. Only complaints: the hiking boots rental selection was limited, and we had to wait quite a bit on day 2 for weather to clear. But these are minor issues in an otherwise amazing trip.',
        isVerified: false,
        isApproved: true,
        helpfulVotes: 8,
        createdAt: new Date('2024-10-03'),
      },
      {
        userId: allReviewUsers[10].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Physically demanding but rewarding',
        comment:
          'This tour pushed me to my physical limits and I loved every minute of it! The daily hikes were challenging but the payoff at each summit was incredible. The guide team was excellent at motivating everyone while ensuring safety. The camping meals were surprisingly delicious. Best part was definitely the sunrise view from the final peak!',
        images: [
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 19,
        createdAt: new Date('2024-08-28'),
      },
      {
        userId: allReviewUsers[12].id,
        packageId: createdPackages[1].id,
        rating: 3,
        title: 'Beautiful but tough conditions',
        comment:
          'The mountain scenery was absolutely gorgeous and the guides were knowledgeable. However, the weather during our trip was challenging - rain for 3 out of 5 days made everything more difficult. The equipment held up well in wet conditions. Would recommend checking weather forecasts carefully before booking.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 6,
        createdAt: new Date('2024-11-12'),
      },
      {
        userId: allReviewUsers[7].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Adventure of a lifetime!',
        comment:
          'Absolutely incredible experience! Every day brought new challenges and rewards. The rock climbing sections were expertly guided and felt safe even for beginners. The wildlife sightings were amazing - saw deer, eagles, and even a bear from a safe distance. The night sky without light pollution was mind-blowing. Highly recommend!',
        images: [
          'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1455391264869-c05255115315?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 27,
        createdAt: new Date('2024-09-05'),
      },
      {
        userId: allReviewUsers[3].id,
        packageId: createdPackages[1].id,
        rating: 4,
        title: 'Well-organized mountain expedition',
        comment:
          'Great organization and safety protocols throughout the trip. The guides were experienced and the equipment was high quality. The daily hiking distances were well-planned to build up stamina. Food was better than expected for camping meals. Only wish there was more time for photography at the scenic viewpoints.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 12,
        createdAt: new Date('2024-10-18'),
      },
      {
        userId: allReviewUsers[5].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Perfect adventure for thrill seekers',
        comment:
          'This tour delivered everything I was hoping for and more! The adrenaline rush from rock climbing combined with the peaceful moments stargazing created the perfect balance. The guides shared fascinating information about the local ecosystem. Physical preparation is definitely important, but the experience is worth every sore muscle!',
        images: [
          'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop',
        ],
        isVerified: false,
        isApproved: true,
        helpfulVotes: 21,
        createdAt: new Date('2024-08-15'),
      },
      {
        userId: allReviewUsers[9].id,
        packageId: createdPackages[1].id,
        rating: 4,
        title: 'Memorable mountain experience',
        comment:
          'Fantastic way to experience the Rocky Mountains! The daily hikes offered stunning views and the camping experience was well-managed. Guide team was professional and safety-focused. The rock climbing was thrilling but felt completely safe. Would definitely recommend to anyone looking for an active outdoor adventure.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 14,
        createdAt: new Date('2024-09-22'),
      },
      {
        userId: allReviewUsers[11].id,
        packageId: createdPackages[1].id,
        rating: 5,
        title: 'Exceeded all expectations!',
        comment:
          'This mountain adventure was absolutely phenomenal! From the moment we started hiking to the final descent, every aspect was perfectly planned. The guides were not only knowledgeable about safety but also about the natural history of the area. The camping meals were surprisingly gourmet. This trip will stay with me forever!',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 33,
        createdAt: new Date('2024-07-20'),
      },
    ],
  });

  // Create reviews for Cultural Heritage Journey
  await prisma.review.createMany({
    data: [
      {
        userId: allReviewUsers[2].id,
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
        userId: allReviewUsers[3].id,
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
        userId: allReviewUsers[4].id,
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
        userId: allReviewUsers[1].id,
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
      {
        userId: allReviewUsers[6].id,
        packageId: createdPackages[2].id,
        rating: 5,
        title: 'Authentic Japanese experience',
        comment:
          'This cultural tour was absolutely phenomenal! Every temple visit felt deeply spiritual and our guide explained the significance beautifully. The traditional tea ceremony was a highlight - so peaceful and mindful. The bamboo grove was ethereal, and the geisha district evening walk was like stepping back in time. Perfect blend of education and beauty!',
        images: [
          'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 26,
        createdAt: new Date('2024-08-22'),
      },
      {
        userId: allReviewUsers[8].id,
        packageId: createdPackages[2].id,
        rating: 4,
        title: 'Rich cultural insights',
        comment:
          'Fantastic tour that really opened my eyes to Japanese culture and history. The temple architecture was breathtaking and the guide was incredibly knowledgeable. The tea ceremony was a unique experience that I will remember forever. Traditional lunch was delicious and authentic. Small group size made it feel more personal.',
        isVerified: false,
        isApproved: true,
        helpfulVotes: 11,
        createdAt: new Date('2024-09-30'),
      },
      {
        userId: allReviewUsers[5].id,
        packageId: createdPackages[2].id,
        rating: 5,
        title: 'Breathtaking temples and traditions',
        comment:
          'Every moment of this tour was magical! The ancient temples were absolutely stunning - the attention to detail in the architecture was incredible. Our guide was passionate about Japanese culture and shared fascinating stories. The bamboo forest walk was like entering a fairy tale. The tea ceremony taught me so much about mindfulness and tradition.',
        images: [
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 22,
        createdAt: new Date('2024-10-12'),
      },
      {
        userId: allReviewUsers[10].id,
        packageId: createdPackages[2].id,
        rating: 4,
        title: 'Educational and beautiful',
        comment:
          'Well-organized cultural tour with excellent educational content. The temples were magnificent and the guide provided great historical context. Tea ceremony was a peaceful and enlightening experience. The traditional market visit was interesting. Would recommend comfortable walking shoes as there is quite a bit of walking involved.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 8,
        createdAt: new Date('2024-11-02'),
      },
      {
        userId: allReviewUsers[7].id,
        packageId: createdPackages[2].id,
        rating: 5,
        title: 'Unforgettable Japanese journey',
        comment:
          'This tour was absolutely perfect for experiencing authentic Japanese culture! The temple visits were deeply moving and educational. The bamboo forest was incredibly serene and beautiful. The tea ceremony was a highlight - so peaceful and meaningful. Our guide was passionate and knowledgeable. Cannot recommend this enough!',
        images: [
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1493797142888-9ba7ad2b3a98?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 29,
        createdAt: new Date('2024-07-18'),
      },
      {
        userId: allReviewUsers[0].id,
        packageId: createdPackages[2].id,
        rating: 3,
        title: 'Good but could be improved',
        comment:
          'The cultural sites were beautiful and the guide was knowledgeable. However, the tour felt a bit rushed at times - would have liked more time to appreciate each temple. The tea ceremony was interesting but brief. The traditional lunch was okay but not exceptional. Overall decent but room for improvement in pacing.',
        isVerified: false,
        isApproved: true,
        helpfulVotes: 5,
        createdAt: new Date('2024-11-20'),
      },
      {
        userId: allReviewUsers[9].id,
        packageId: createdPackages[2].id,
        rating: 5,
        title: 'Cultural masterpiece tour',
        comment:
          'Absolutely extraordinary cultural experience! Every temple we visited had its own unique character and beauty. The guide was incredibly knowledgeable about Buddhist traditions and Japanese history. The tea ceremony was a profound experience that taught me about mindfulness. The bamboo forest was otherworldly. Perfect for culture lovers!',
        images: [
          'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop',
        ],
        isVerified: true,
        isApproved: true,
        helpfulVotes: 24,
        createdAt: new Date('2024-08-05'),
      },
      {
        userId: allReviewUsers[11].id,
        packageId: createdPackages[2].id,
        rating: 4,
        title: 'Wonderful introduction to Kyoto',
        comment:
          'Great tour for first-time visitors to Kyoto! The temples were absolutely stunning and the guide provided excellent historical background. The tea ceremony was a unique cultural experience. Bamboo forest was beautiful but quite crowded. Overall very educational and enjoyable - would recommend to anyone interested in Japanese culture.',
        isVerified: true,
        isApproved: true,
        helpfulVotes: 13,
        createdAt: new Date('2024-09-08'),
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
