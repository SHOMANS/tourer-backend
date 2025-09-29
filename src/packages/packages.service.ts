import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { QueryPackageDto } from './dto/query-package.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { Package, Prisma } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    try {
      // Generate slug if not provided
      if (!createPackageDto.slug) {
        createPackageDto.slug = this.generateSlug(createPackageDto.title);
      }

      // Ensure slug is unique
      await this.ensureUniqueSlug(createPackageDto.slug);

      return await this.prisma.package.create({
        data: createPackageDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Package with this slug already exists',
          );
        }
      }
      throw error;
    }
  }

  async findAll(query: QueryPackageDto) {
    const {
      search,
      category,
      difficulty,
      locationName,
      country,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: Prisma.PackageWhereInput = {
      isActive: true,
      isAvailable: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { locationName: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (locationName)
      where.locationName = { contains: locationName, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (minDuration || maxDuration) {
      where.duration = {};
      if (minDuration) where.duration.gte = minDuration;
      if (maxDuration) where.duration.lte = maxDuration;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [packages, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.package.count({ where }),
    ]);

    return {
      data: packages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Package> {
    const package_ = await this.prisma.package.findUnique({
      where: { id },
    });

    if (!package_) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return package_;
  }

  async findBySlug(slug: string): Promise<Package> {
    const package_ = await this.prisma.package.findUnique({
      where: { slug },
    });

    if (!package_) {
      throw new NotFoundException(`Package with slug ${slug} not found`);
    }

    return package_;
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    try {
      // Check if package exists
      await this.findOne(id);

      // If slug is being updated, ensure it's unique
      if (updatePackageDto.slug) {
        await this.ensureUniqueSlug(updatePackageDto.slug, id);
      }

      return await this.prisma.package.update({
        where: { id },
        data: updatePackageDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Package with this slug already exists',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    // Check if package exists
    await this.findOne(id);

    // Soft delete by setting isActive to false
    await this.prisma.package.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getCategories() {
    const categories = await this.prisma.package.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { isActive: true },
    });

    return categories.map((p) => p.category);
  }

  async getPopular(limit: number = 6) {
    return this.prisma.package.findMany({
      where: { isActive: true, isAvailable: true },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async ensureUniqueSlug(
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.package.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Package with this slug already exists');
    }
  }

  // Review methods
  async getReviews(packageId: string, query: any) {
    const { page = 1, limit = 10, rating, verified } = query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      packageId,
      isApproved: true,
    };

    if (rating) {
      where.rating = rating;
    }

    if (verified !== undefined) {
      where.isVerified = verified;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async createReview(packageId: string, createReviewDto: any, userId: string) {
    // Check if package exists
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    // Check if user has already reviewed this package
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        packageId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this package');
    }

    // Check if user has booked this package (for verified reviews)
    const booking = await this.prisma.booking.findFirst({
      where: {
        userId,
        packageId,
        status: 'COMPLETED',
      },
    });

    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
        packageId,
        isVerified: !!booking,
        bookingId: booking?.id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
    });

    // Update package rating
    await this.updatePackageRating(packageId);

    return review;
  }

  async approveReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return await this.prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
  }

  async deleteReview(reviewId: string, userId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only allow user to delete their own review or admin to delete any
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new BadRequestException('Not authorized to delete this review');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update package rating after deletion
    await this.updatePackageRating(review.packageId);

    return { message: 'Review deleted successfully' };
  }

  private async updatePackageRating(packageId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        packageId,
        isApproved: true,
      },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    await this.prisma.package.update({
      where: { id: packageId },
      data: {
        rating: averageRating,
        reviewCount: totalReviews,
      },
    });
  }

  // Admin-specific method to get all reviews
  async getAllReviewsForAdmin(query: any) {
    const {
      page = 1,
      limit = 10,
      isApproved,
      isVerified,
      rating,
      packageId,
    } = query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true';
    }

    if (rating) {
      where.rating = parseInt(rating);
    }

    if (packageId) {
      where.packageId = packageId;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              photoUrl: true,
            },
          },
          package: {
            select: {
              id: true,
              title: true,
              locationName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }
}
