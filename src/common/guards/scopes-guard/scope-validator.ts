import { getDay, getHours, getDate, isBefore } from 'date-fns';
import { ClientScopesOptions } from 'src/clients/interfaces';
import { ForbiddenException } from 'src/common/exceptions';
import {
  DAY_OF_MONTH_BLOCKED,
  DAY_OF_WEEK_BLOCKED,
  DEPENDENT_SCOPES_BLOCKED,
  GEO_ALLOWED_COUNTRIES_BLOCKED,
  GEO_DENIED_COUNTRIES_BLOCKED,
  IP_BLACKLIST_BLOCKED,
  IP_WHITELIST_BLOCKED,
  PROJECTS_BLOCKED,
  TIME_OF_DAY_BLOCKED,
  USER_ROLES_BLOCKED,
} from 'src/constants';

export class ScopesValidator {
  static validate(
    options: ClientScopesOptions,
    clientScopes: string,
    request: any,
  ) {
    const now = new Date();

    /* 1. Validate timeOfDay */
    if (options.timeOfDay) {
      const currentHour = getHours(now);
      if (
        currentHour < options.timeOfDay.from ||
        currentHour >= options.timeOfDay.to
      ) {
        throw new ForbiddenException('timeOfDay', TIME_OF_DAY_BLOCKED);
      }
    }

    /* 2. Validate dayOfWeek */
    if (options.dayOfWeek) {
      const currentDay = getDay(now); // 0 = Sunday, 6 = Saturday
      if (
        currentDay < options.dayOfWeek.from ||
        currentDay > options.dayOfWeek.to
      ) {
        throw new ForbiddenException('dayOfWeek', DAY_OF_WEEK_BLOCKED);
      }
    }

    /* 3. Validate dayOfMonth */
    if (options.dayOfMonth) {
      const currentDate = getDate(now);
      if (
        currentDate < options.dayOfMonth.from ||
        currentDate > options.dayOfMonth.to
      ) {
        throw new ForbiddenException('dayOfMonth', DAY_OF_MONTH_BLOCKED);
      }
    }

    /* TODO: 4. Validate requestsPerMinute (requires tracking requests) */
    if (options.requestsPerMinute) {
      // Реализация подсчета запросов в минуту должна быть добавлена
      // Например, использование Redis для хранения количества запросов
    }

    /* 5. Validate dependentScopes */
    if (options.dependentScopes) {
      const hasDependentScopes = options.dependentScopes.every((scope) =>
        clientScopes.includes(scope),
      );
      if (!hasDependentScopes) {
        throw new ForbiddenException(
          'dependentScopes',
          DEPENDENT_SCOPES_BLOCKED,
        );
      }
    }

    /* 6. Validate IP whitelist/blacklist */
    const clientIp = request.ip || request.headers['x-forwarded-for'];
    if (options.ipWhitelist && !options.ipWhitelist.includes(clientIp)) {
      throw new ForbiddenException('ipWhitelist', IP_WHITELIST_BLOCKED);
    }
    if (options.ipBlacklist && options.ipBlacklist.includes(clientIp)) {
      throw new ForbiddenException('ipBlacklist', IP_BLACKLIST_BLOCKED);
    }

    /* 7. Validate userRoles */
    if (options.userRoles && !options.userRoles.includes(request.user?.role)) {
      throw new ForbiddenException('userRoles', USER_ROLES_BLOCKED);
    }

    /* 8. Validate projects */
    if (
      options.projects &&
      !options.projects.some((project) =>
        request.user?.projects?.includes(project),
      )
    ) {
      throw new ForbiddenException('projects', PROJECTS_BLOCKED);
    }

    /* TODO: 9. Validate geo (countries) */
    const userCountry = request.user?.country;
    if (
      options.geo?.allowedCountries &&
      !options.geo.allowedCountries.includes(userCountry)
    ) {
      throw new ForbiddenException('country', GEO_ALLOWED_COUNTRIES_BLOCKED);
    }
    if (
      options.geo?.deniedCountries &&
      options.geo.deniedCountries.includes(userCountry)
    ) {
      throw new ForbiddenException('country', GEO_DENIED_COUNTRIES_BLOCKED);
    }
  }
}
