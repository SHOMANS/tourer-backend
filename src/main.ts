import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS for frontend applications
  app.enableCors({
    origin: [
      'http://localhost:3001', // Next.js admin dashboard
      'http://localhost:3000', // In case frontend runs on 3000
      'http://localhost:19006', // Expo development server
      'exp://192.168.*', // Expo Go app on physical device
      'http://10.0.2.2:3000', // Android emulator
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true, // Allow cookies and auth headers
  });

  // Bind to all network interfaces to allow mobile device access
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(
    `Backend is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(`Network access: http://10.0.0.169:${process.env.PORT ?? 3000}`);
}
bootstrap();
