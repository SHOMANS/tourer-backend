import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @GetUser() user: any) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: QueryBookingsDto) {
    return this.bookingsService.findAll(query);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.bookingsService.getBookingStats();
  }

  @Get('user-bookings')
  async findMyBookings(@Query() query: QueryBookingsDto, @GetUser() user: any) {
    console.log('=== CONTROLLER user-bookings START ===');
    console.log('User from @GetUser():', user);
    console.log('Query params:', query);
    try {
      const result = await this.bookingsService.findUserBookings(
        user.id,
        query,
      );
      console.log('=== CONTROLLER user-bookings SUCCESS ===');
      return result;
    } catch (error) {
      console.error('=== CONTROLLER user-bookings ERROR ===');
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Get('test-my-bookings')
  testMyBookings(@GetUser() user: any) {
    console.log('Test endpoint called with user:', user?.id);
    return {
      message: 'Test endpoint working',
      userId: user?.id,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    // For non-admin users, pass userId to check ownership
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.bookingsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: any,
  ) {
    return this.bookingsService.update(
      id,
      updateBookingDto,
      user.id,
      user.role,
    );
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.cancel(id, user.id, user.role);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  confirm(@Param('id') id: string) {
    return this.bookingsService.confirm(id);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  complete(@Param('id') id: string) {
    return this.bookingsService.complete(id);
  }

  @Patch(':id/payment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: string; paymentId?: string },
  ) {
    return this.bookingsService.updatePaymentStatus(
      id,
      body.paymentStatus,
      body.paymentId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.bookingsService.remove(id, user.id, user.role);
  }
}
