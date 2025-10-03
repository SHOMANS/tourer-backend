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
    try {
      console.log('findAll called with query:', query);
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

      // Ensure page and limit are numbers
      const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
      const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;

      console.log('Converted values:', {
        pageNum,
        limitNum,
        originalPage: page,
        originalLimit: limit,
      });

      // Build where clause
      const where: Prisma.BookingWhereInput = {};

      if (search) {
        where.OR = [
          {
            user: {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            package: {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ];
      }

      if (status) where.status = status;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      if (userId) where.userId = userId;
      if (packageId) where.packageId = packageId;

      console.log('findAll where clause:', JSON.stringify(where, null, 2));

      // Calculate pagination
      const skip = (pageNum - 1) * limitNum;

      console.log('findAll pagination:', { pageNum, limitNum, skip });

      // Execute queries with better error handling
      let bookings: any[] = [];
      let total: number = 0;

      try {
        [bookings, total] = await Promise.all([
          this.prisma.booking.findMany({
            where,
            skip,
            take: limitNum,
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
      } catch (prismaError: unknown) {
        console.error('Prisma query error:', prismaError);
        const errorMessage =
          prismaError instanceof Error
            ? prismaError.message
            : 'Unknown database error';
        throw new Error(`Database query failed: ${errorMessage}`);
      }

      console.log('findAll results:', {
        bookingsCount: bookings.length,
        total,
      });

      return {
        data: bookings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      };
    } catch (error: unknown) {
      console.error('findAll error:', error);
      // Re-throw with more context
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Database query failed')) {
        throw error;
      }
      throw new Error(`Booking query failed: ${errorMessage}`);
    }
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
    console.log('=== findUserBookings SERVICE START ===');
    console.log('userId:', userId);
    console.log('query:', query);
    try {
      console.log('About to call this.findAll...');
      const result = await this.findAll({ ...query, userId });
      console.log('findUserBookings result:', {
        dataCount: result.data?.length,
        pagination: result.pagination,
      });
      console.log('=== findUserBookings SERVICE SUCCESS ===');
      return result;
    } catch (error) {
      console.error('=== findUserBookings SERVICE ERROR ===');
      console.error('findUserBookings error:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error.constructor.name);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      console.error('=== END findUserBookings SERVICE ERROR ===');
      throw error;
    }
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
        const restrictedFields = ['paymentStatus', 'paymentId'];

        // Users can only set status to 'CANCELLED' for their own bookings
        if (updateBookingDto.status !== undefined) {
          if (
            updateBookingDto.status !== 'CANCELLED' ||
            existingBooking.userId !== userId
          ) {
            throw new ForbiddenException(
              'Only administrators can update status, except users can cancel their own bookings',
            );
          }
        }

        // Check other restricted fields
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
