import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ensure uploads directory exists
  const uploadsPath = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }

  // Serve static files from uploads directory
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Enable CORS for frontend applications
  const allowedOrigins = [
    // Development origins
    'http://localhost:3001', // Next.js admin dashboard
    'http://localhost:3000', // In case frontend runs on 3000
    'http://localhost:19006', // Expo development server
    'exp://192.168.*', // Expo Go app on physical device
    'http://10.0.2.2:3000', // Android emulator
  ];

  // Add production origins from environment variables
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  if (process.env.ADMIN_URL) {
    allowedOrigins.push(process.env.ADMIN_URL);
  }
  
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? allowedOrigins.filter((origin) => !origin.includes('localhost'))
        : allowedOrigins,
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
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
