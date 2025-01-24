import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes';
import { swaggerConfig } from './configs/swagger';
import { Logger } from '@nestjs/common';

const port = process.env.PORT;
const isDev = process.env.NODE_ENV === 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.getHttpAdapter().getInstance().disable('x-powered-by', 'X-Powered-By');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  if (isDev) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/docs', app, document);
  }

  await app.listen(port, () => {
    Logger.log(`Server is running on http://localhost:${port}`);
    if (isDev) {
      Logger.log(`Swagger is running on http://localhost:${port}/docs`);
    }
  });
}

bootstrap();
