import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { QueryPackageDto } from './dto/query-package.dto';
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
          throw new BadRequestException('Package with this slug already exists');
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
      location,
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
        { location: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (location) where.location = { contains: location, mode: 'insensitive' };
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

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
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
          throw new BadRequestException('Package with this slug already exists');
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
    
    return categories.map(p => p.category);
  }

  async getPopular(limit: number = 6) {
    return this.prisma.package.findMany({
      where: { isActive: true, isAvailable: true },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: limit,
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.package.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Package with this slug already exists');
    }
  }
}