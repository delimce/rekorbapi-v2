import compression from '@fastify/compress';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.enableCors();
  // await app.listen(3000); only localhost
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
