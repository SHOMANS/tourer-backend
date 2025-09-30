import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PackagesModule } from './packages/packages.module';
import { UploadModule } from './upload/upload.module';
import { CarouselModule } from './carousel/carousel.module';
import { BookingsModule } from './bookings/bookings.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    PackagesModule,
    UploadModule,
    CarouselModule,
    BookingsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
