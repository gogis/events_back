import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  });
  app.setGlobalPrefix("api");

  app.set('trust proxy', true);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
