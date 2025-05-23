import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig = (configService: ConfigService) => {
  const config: SequelizeModuleOptions = {
    dialect: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    autoLoadModels: true,
    define: {
      underscored: true,
    },
  };

  const isProproduction = configService.get('NODE_ENV') === 'production';
  if (isProproduction) config.logging = false;

  return config;
};
