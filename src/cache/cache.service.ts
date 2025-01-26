import { Inject, Injectable } from '@nestjs/common';
import type { Cacheable } from 'cacheable';
import { CACHE_PROVIDER } from 'src/configs/cache';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_PROVIDER) private readonly cache: Cacheable) {}

  async get<T>(key: string): Promise<T> {
    return await this.cache.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number | string): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }
}
