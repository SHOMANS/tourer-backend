import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, HealthController, AdminController],
  providers: [AppService],
})
export class AppModule {}
