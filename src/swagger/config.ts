import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('R profile')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build();
