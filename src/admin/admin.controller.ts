import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  async getDashboard(@GetUser() user: any) {
    return {
      message: 'Welcome to the admin dashboard',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalUsers: 10,
        totalPackages: 5,
        totalBookings: 15,
      },
    };
  }

  @Get('users')
  @Roles(UserRole.ADMIN)
  async getUsers() {
    return {
      message: 'List of all users',
      users: [
        { id: '1', email: 'admin@tourer.com', role: 'ADMIN' },
        { id: '2', email: 'demo@example.com', role: 'USER' },
      ],
    };
  }
}
