import { getDay, getHours, getDate } from 'date-fns';
import { CacheService } from 'src/cache/cache.service';
import { ClientScopesOptions } from 'src/clients/interfaces';
import { ForbiddenException } from 'src/common/exceptions';
import {
  DAY_OF_MONTH_BLOCKED,
  DAY_OF_WEEK_BLOCKED,
  DEPENDENT_SCOPES_BLOCKED,
  IP_BLACKLIST_BLOCKED,
  IP_WHITELIST_BLOCKED,
  PROJECTS_BLOCKED,
  REQUESTS_PER_MINUTE_BLOCKED,
  TIME_OF_DAY_BLOCKED,
  USER_ROLES_BLOCKED,
} from 'src/constants';
import { FromToOptions } from 'src/types';

export class ScopesValidator {
  constructor(private readonly cacheService: CacheService) {}

  async validate(
    options: ClientScopesOptions,
    clientScopes: string[],
    clientId: string,
    request: any,
  ) {
    // 1. Validate timeOfDay
    if (options.timeOfDay) {
      this.validateTimeOfDay(options.timeOfDay);
    }

    // 2. Validate dayOfWeek
    if (options.dayOfWeek) {
      this.validateDayOfWeek(options.dayOfWeek);
    }

    // 3. Validate dayOfMonth
    if (options.dayOfMonth) {
      this.validateDayOfMonth(options.dayOfMonth);
    }

    // 4. Validate requestsPerMinute
    if (options.requestsPerMinute) {
      await this.validateRequestsPerMinute(clientId, options.requestsPerMinute);
    }

    // 5. Validate dependentScopes
    if (options.dependentScopes) {
      this.validateDependentScopes(options.dependentScopes, clientScopes);
    }

    // 6. Validate IP whitelist/blacklist
    const clientIp = request.ip || request.headers['x-forwarded-for'];
    this.validateIpAddress(clientIp, options.ipWhitelist, options.ipBlacklist);

    // 7. Validate userRoles
    if (options.userRoles) {
      this.validateUserRoles(options.userRoles, -1);
    }

    // 8. Validate projects
    if (options.projects) {
      this.validateUserProjects(options.projects, []);
    }

    // TODO: 9. Validate geo (countries)
  }

  private validateTimeOfDay(options: FromToOptions) {
    const now = new Date();
    const currentHour = getHours(now);
    if (currentHour < options.from || currentHour >= options.to) {
      throw new ForbiddenException('timeOfDay', TIME_OF_DAY_BLOCKED);
    }
  }

  private validateDayOfWeek(options: FromToOptions) {
    const now = new Date();
    const currentDay = getDay(now);
    if (currentDay < options.from || currentDay > options.to) {
      throw new ForbiddenException('dayOfWeek', DAY_OF_WEEK_BLOCKED);
    }
  }

  private validateDayOfMonth(options: FromToOptions) {
    const now = new Date();
    const currentDate = getDate(now);
    if (currentDate < options.from || currentDate > options.to) {
      throw new ForbiddenException('dayOfMonth', DAY_OF_MONTH_BLOCKED);
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

  private validateUserRoles(userRoles: number[], userRole: number) {
    if (!userRoles.includes(userRole)) {
      throw new ForbiddenException('userRoles', USER_ROLES_BLOCKED);
    }
  }

  private validateUserProjects(projects: string[], userProjects: string[]) {
    const isHasAllProjects = projects.every((project) =>
      userProjects.includes(project),
    );
    if (!isHasAllProjects) {
      throw new ForbiddenException('projects', PROJECTS_BLOCKED);
    }
  }
}
