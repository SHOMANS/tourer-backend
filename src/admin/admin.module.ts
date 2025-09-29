import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { PackagesModule } from '../packages/packages.module';

@Module({
  imports: [AuthModule, PackagesModule],
  controllers: [AdminController],
})
export class AdminModule {}
