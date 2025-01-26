import { FromToOptions } from 'src/types';

export interface ClientScopesOptions {
  /* Время дня в которое будет разрешен доступ */
  timeOfDay?: FromToOptions;

  /* Дни недели в которые будет разрешен доступ */
  dayOfWeek?: FromToOptions;

  /* Дни месяца в которые будет выдан доступ */
  dayOfMonth?: FromToOptions;

  /* Количество запросов в минуту */
  requestsPerMinute?: number;

  /* Скоупы, которые должны быть выданы */
  dependentScopes?: string[];

  /* Список разрешённых IP-адресов */
  ipWhitelist?: string[];

  /* Список запрещённых IP-адресов */
  ipBlacklist?: string[];

  /* Список ролей разрешённых пользователей */
  userRoles?: number[];

  /* Список проектов, к которым должен иметь доступ юзер */
  projects?: string[];

  /* Список разрешённых / запрещённых стран */
  geo?: {
    allowedCountries?: string[];
    deniedCountries?: string[];
  };
}
