import { getDay, getHours } from 'date-fns';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';
import { ClientScopesOptions } from 'src/clients/interfaces';
import { ForbiddenException } from 'src/common/exceptions';
import {
  DAY_OF_MONTH_BLOCKED,
  DAY_OF_WEEK_BLOCKED,
  DEPENDENT_SCOPES_BLOCKED,
  IP_BLACKLIST_BLOCKED,
  IP_WHITELIST_BLOCKED,
  REQUESTS_PER_MINUTE_BLOCKED,
  TIME_OF_DAY_BLOCKED,
} from 'src/constants';
import { FromToOptions } from 'src/types';

type ValidateScopesParams = {
  options: ClientScopesOptions;
  clientScopes: string[];
  clientId: string;
  request: Request;
};

export class ScopesValidator {
  constructor(private readonly cacheService: CacheService) {}

  async validate(params: ValidateScopesParams) {
    const { clientId, options, clientScopes, request } = params;

    // 1. Validate only working days
    if (options.workingDaysOnly) {
      this.validateWorkingDaysOnly();
    }

    // 2. Validate timeOfDay
    if (options.timeOfDay) {
      this.validateTimeOfDay(options.timeOfDay);
    }

    // 3. Validate dayOfWeek
    if (options.dayOfWeek) {
      this.validateDayOfWeek(options.dayOfWeek);
    }

    // 5. Validate requestsPerMinute
    if (options.requestsPerMinute) {
      await this.validateRequestsPerMinute(clientId, options.requestsPerMinute);
    }

    // 6. Validate dependentScopes
    if (options.dependentScopes) {
      this.validateDependentScopes(options.dependentScopes, clientScopes);
    }

    // 7. Validate IP whitelist/blacklist
    const clientIp = request.ip || request.headers['x-forwarded-for'][0];
    this.validateIpAddress(clientIp, options.ipWhitelist, options.ipBlacklist);

    // TODO: 8. Validate geo (countries)
  }

  private validateWorkingDaysOnly() {
    const now = new Date();
    const day = getDay(now);
    if (day === 0 || day === 6) {
      throw new ForbiddenException('timeOfDay', TIME_OF_DAY_BLOCKED);
    }
  }

  private validateTimeOfDay(options: FromToOptions) {
    const now = new Date();
    const currentHour = getHours(now);
    if (currentHour < options.from || currentHour >= options.to) {
      throw new ForbiddenException('timeOfDay', TIME_OF_DAY_BLOCKED);
    }
  }

  private validateDayOfWeek(allowedDays: number[]) {
    const currentDay = new Date().getDay();

    if (!allowedDays.includes(currentDay)) {
      throw new ForbiddenException('dayOfWeek', DAY_OF_WEEK_BLOCKED);
    }
  }

  private async validateRequestsPerMinute(
    clientId: string,
    requestsPerMinute: number,
  ) {
    const key = `requests:${clientId}`;

    const requestsCount = (await this.cacheService.get<number>(key)) || 0;

    if (requestsCount >= requestsPerMinute) {
      throw new ForbiddenException(
        'requestsPerMinute',
        REQUESTS_PER_MINUTE_BLOCKED,
      );
    }

    // Set TTL to 1 hour (60 * 60 * 1000 milliseconds)
    await this.cacheService.set(key, requestsCount + 1, 60 * 60 * 1000);
  }

  private validateDependentScopes(options: string[], clientScopes: string[]) {
    const hasDependentScopes = options.every((scope) =>
      clientScopes.includes(scope),
    );
    if (!hasDependentScopes) {
      throw new ForbiddenException('dependentScopes', DEPENDENT_SCOPES_BLOCKED);
    }
  }

  private validateIpAddress(
    clientIp: string,
    ipWhitelist?: string[],
    ipBlacklist?: string[],
  ) {
    if (ipWhitelist && !ipWhitelist.includes(clientIp)) {
      throw new ForbiddenException('ipWhitelist', IP_WHITELIST_BLOCKED);
    }
    if (ipBlacklist && ipBlacklist.includes(clientIp)) {
      throw new ForbiddenException('ipBlacklist', IP_BLACKLIST_BLOCKED);
    }
  }
}
