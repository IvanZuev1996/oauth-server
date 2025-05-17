import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { ConfigService } from '@nestjs/config';
import { CACHE_PROVIDER } from 'src/configs/cache';

@Module({
  providers: [
    {
      provide: CACHE_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const secondary = createKeyv(redisUrl);
        return new Cacheable({ secondary, ttl: '1h' });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [CACHE_PROVIDER, CacheService],
})
export class CacheModule {}
