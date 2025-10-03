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
    'http://localhost:8081', // Expo development server (Metro)
    'http://localhost:19000', // Expo development server
    'http://localhost:19006', // Expo development server
    'exp://localhost:19000', // Expo Go local
    'exp://10.0.0.121:19000', // Expo Go on network
    'exp://192.168.*', // Expo Go app on physical device
    'http://10.0.2.2:3000', // Android emulator
    'http://10.0.2.2:3006', // Android emulator to backend
    'http://10.0.0.121:*', // Your machine's IP for mobile devices
  ];

  // Add production origins from environment variables
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  if (process.env.ADMIN_URL) {
    allowedOrigins.push(process.env.ADMIN_URL);
  }

  // CORS configuration that handles both web and mobile app requests
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // In development, be more permissive
      if (process.env.NODE_ENV === 'development') {
        // Allow localhost on any port and the machine's IP
        if (
          origin.includes('localhost') ||
          origin.includes('10.0.0.121') ||
          origin.startsWith('exp://')
        ) {
          return callback(null, true);
        }
      }

      // In production, filter out localhost origins for web browsers
      // but still allow mobile app origins
      if (process.env.NODE_ENV === 'production') {
        const productionOrigins = allowedOrigins.filter(
          (allowedOrigin) =>
            !allowedOrigin.includes('localhost') ||
            allowedOrigin.includes('exp://'),
        );

        // Check if the origin is allowed
        if (
          productionOrigins.some((allowedOrigin) => {
            if (allowedOrigin.includes('*')) {
              // Handle wildcard patterns like exp://192.168.*
              const pattern = allowedOrigin.replace(/\*/g, '.*');
              return new RegExp(pattern).test(origin);
            }
            return origin === allowedOrigin;
          })
        ) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
      } else {
        // Development: check configured origins
        if (
          allowedOrigins.some((allowedOrigin) => {
            if (allowedOrigin.includes('*')) {
              const pattern = allowedOrigin.replace(/\*/g, '.*');
              return new RegExp(pattern).test(origin);
            }
            return origin === allowedOrigin;
          })
        ) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
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
