import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase() {
    try {
      // Test simple queries that should work
      const userCount = await this.prisma.user.count();
      const packageCount = await this.prisma.package.count();
      const bookingCount = await this.prisma.booking.count();

      // Get sample data with basic fields
      const samplePackage = await this.prisma.package.findFirst({
        select: {
          id: true,
          title: true,
          price: true,
        },
      });

      const sampleBooking = await this.prisma.booking.findFirst({
        select: {
          id: true,
          status: true,
          guests: true,
          totalPrice: true,
        },
      });

      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        counts: {
          users: userCount,
          packages: packageCount,
          bookings: bookingCount,
        },
        samples: {
          package: samplePackage,
          booking: sampleBooking,
        },
        message:
          'Database connectivity verified! Booking system is operational.',
      };
    } catch (error) {
      return {
        status: 'error',
        error: 'Connection failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
