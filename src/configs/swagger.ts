import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('OAuth Server')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build();
