import { FromToOptions } from 'src/types';

export enum ClientStatus {
  ACTIVE = 'active',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export interface ClientScopesOptions {
  /* Только рабочие дни */
  workingDaysOnly?: boolean;

  /* Время дня в которое будет разрешен доступ */
  timeOfDay?: FromToOptions;

  /* Дни недели в которые будет разрешен доступ */
  dayOfWeek?: number[];

  /* Дни месяца в которые будет выдан доступ */
  dayOfMonth?: number[];

  /* Количество запросов в минуту */
  requestsPerMinute?: number;

  /* Скоупы, которые должны быть выданы */
  dependentScopes?: string[];

  /* Список разрешённых IP-адресов */
  ipWhitelist?: string[];

  /* Список запрещённых IP-адресов */
  ipBlacklist?: string[];

  /* Список разрешённых / запрещённых стран */
  geo?: {
    allowedCountries?: string[];
    deniedCountries?: string[];
  };
}
