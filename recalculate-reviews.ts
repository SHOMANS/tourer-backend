import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recalculateReviewCounts() {
  console.log('🔄 Starting review count recalculation...');

  try {
    // Get all packages
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        title: true,
        reviewCount: true,
      },
    });

    console.log(`📦 Found ${packages.length} packages to update`);

    let updatedCount = 0;

    for (const pkg of packages) {
      // Calculate actual review count from database
      const actualReviewCount = await prisma.review.count({
        where: {
          packageId: pkg.id,
          isApproved: true,
        },
      });

      // Calculate actual average rating
      const reviews = await prisma.review.findMany({
        where: {
          packageId: pkg.id,
          isApproved: true,
        },
        select: { rating: true },
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      // Update the package if the review count or rating is different
      const currentReviewCount = pkg.reviewCount || 0;

      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          reviewCount: actualReviewCount,
          rating: averageRating,
        },
      });

      console.log(
        `✅ Updated "${pkg.title}": ${currentReviewCount} → ${actualReviewCount} reviews, rating: ${averageRating.toFixed(1)}`,
      );
      updatedCount++;
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} packages!`);
    console.log('✅ All review counts are now based on actual database data');
  } catch (error) {
    console.error('❌ Error recalculating review counts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
recalculateReviewCounts().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
