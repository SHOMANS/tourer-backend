import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Backend is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
