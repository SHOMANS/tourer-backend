import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { Booking, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    try {
      // Validate package exists
      const packageExists = await this.prisma.package.findUnique({
        where: { id: createBookingDto.packageId },
      });

      if (!packageExists) {
        throw new NotFoundException('Package not found');
      }

      // Validate guest names count matches guests count
      if (createBookingDto.guestNames.length !== createBookingDto.guests) {
        throw new BadRequestException(
          'Number of guest names must match number of guests',
        );
      }

      // Calculate total price if not provided
      let totalPrice = createBookingDto.totalPrice;
      if (!totalPrice) {
        totalPrice =
          parseFloat(packageExists.price.toString()) * createBookingDto.guests;
      }

      // Calculate end date if not provided
      let endDate = createBookingDto.endDate;
      if (!endDate && createBookingDto.startDate) {
        const startDate = new Date(createBookingDto.startDate);
        const durationDays = packageExists.duration;
        endDate = new Date(
          startDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000,
        ).toISOString();
      }

      const booking = await this.prisma.booking.create({
        data: {
          ...createBookingDto,
          userId,
          totalPrice,
          endDate,
          currency: createBookingDto.currency || packageExists.currency,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          package: {
            select: {
              id: true,
              title: true,
              locationName: true,
              duration: true,
              coverImage: true,
            },
          },
        },
      });

      return booking;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Booking conflict detected');
        }
      }
      throw error;
    }
  }

  async findAll(query: QueryBookingsDto) {
    const {
      search,
      status,
      paymentStatus,
      userId,
      packageId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: Prisma.BookingWhereInput = {};

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { package: { title: { contains: search, mode: 'insensitive' } } },
        { guestNames: { hasSome: [search] } },
      ];
    }

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (userId) where.userId = userId;
    if (packageId) where.packageId = packageId;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          package: {
            select: {
              id: true,
              title: true,
              locationName: true,
              duration: true,
              coverImage: true,
              price: true,
              currency: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            description: true,
            locationName: true,
            duration: true,
            coverImage: true,
            images: true,
            price: true,
            currency: true,
            includes: true,
            excludes: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // If userId is provided (non-admin request), check ownership
    if (userId && booking.userId !== userId) {
      throw new ForbiddenException('You can only access your own bookings');
    }

    return booking;
  }

  async findUserBookings(userId: string, query: QueryBookingsDto) {
    return this.findAll({ ...query, userId });
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId?: string,
    userRole?: string,
  ): Promise<Booking> {
    try {
      // Check if booking exists
      const existingBooking = await this.findOne(id);

      // Check permissions - only booking owner or admin can update
      if (userId && userRole !== 'ADMIN' && existingBooking.userId !== userId) {
        throw new ForbiddenException('You can only update your own bookings');
      }

      // Prevent non-admin users from updating certain fields
      if (userRole !== 'ADMIN') {
        const restrictedFields = ['status', 'paymentStatus', 'paymentId'];
        for (const field of restrictedFields) {
          if (updateBookingDto[field] !== undefined) {
            throw new ForbiddenException(
              `Only administrators can update ${field}`,
            );
          }
        }
      }

      // Validate guest names count if being updated
      if (updateBookingDto.guestNames && updateBookingDto.guests) {
        if (updateBookingDto.guestNames.length !== updateBookingDto.guests) {
          throw new BadRequestException(
            'Number of guest names must match number of guests',
          );
        }
      }

      const booking = await this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          package: {
            select: {
              id: true,
              title: true,
              locationName: true,
              duration: true,
              coverImage: true,
            },
          },
        },
      });

      return booking;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Booking with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string, userId?: string, userRole?: string): Promise<void> {
    // Check if booking exists
    const existingBooking = await this.findOne(id);

    // Check permissions - only booking owner or admin can delete
    if (userId && userRole !== 'ADMIN' && existingBooking.userId !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    // Only allow deletion if booking is not confirmed or completed
    if (['CONFIRMED', 'COMPLETED'].includes(existingBooking.status)) {
      throw new BadRequestException(
        'Cannot delete confirmed or completed bookings',
      );
    }

    await this.prisma.booking.delete({
      where: { id },
    });
  }

  async cancel(
    id: string,
    userId?: string,
    userRole?: string,
  ): Promise<Booking> {
    return this.update(id, { status: 'CANCELLED' }, userId, userRole);
  }

  async confirm(id: string): Promise<Booking> {
    return this.update(id, { status: 'CONFIRMED' }, undefined, 'ADMIN');
  }

  async complete(id: string): Promise<Booking> {
    return this.update(id, { status: 'COMPLETED' }, undefined, 'ADMIN');
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: string,
    paymentId?: string,
  ): Promise<Booking> {
    return this.update(
      id,
      {
        paymentStatus: paymentStatus as
          | 'PENDING'
          | 'PAID'
          | 'FAILED'
          | 'REFUNDED',
        paymentId,
      },
      undefined,
      'ADMIN',
    );
  }

  // Get booking statistics for admin dashboard
  async getBookingStats() {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.booking.aggregate({
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  }
}
