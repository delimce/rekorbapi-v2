import { NestFactory } from '@nestjs/core';
import compression from '@fastify/compress';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(compression, { encodings: ['gzip', 'deflate'] });
  // await app.listen(3000); only localhost
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
