import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './utils/http-exception.filter';
import * as bodyParser from 'body-parser';
// import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.PORT;
process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // app.use(json({ limit: '100mb' }));
  // app.use(urlencoded({ extended: true, limit: '100mb' }));
  // the next two lines did the trick
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  console.log(__dirname);
  // app.useStaticAssets('/public');
  await app.listen(port, '0.0.0.0');
  console.log(`listening ${port}`, new Date());
}
bootstrap();
