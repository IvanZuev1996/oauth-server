/* MAIN */
export const ACCESS_DENIED = 'Доступ запрещен';
export const UNAUTHORIZED = 'Вы не авторизованы';
export const SOMETHING_WRONG = 'Что-то пошло не так';
export const WRONG_API_KEY = 'Неверный АПИ ключ';

/* USER */
export const USER_LOGIN_ERROR = 'Некорретный логин';
export const WRONG_SIGNIN_DATA = 'Неверные данные';
export const USER_TELEGRAM_ERROR = 'Некорретный телеграм';
export const USER_PASSWORD_STRING_ERROR = 'Пароль должен быть строкой';
export const USER_PASSWORD_LENGTH_ERROR = 'Длина пароля должна быть от 8 до 50';
export const USER_LOGIN_EXIST = 'Логин уже зарегистрирован';
export const USER_TELEGRAM_EXIST = 'Телеграм уже зарегистрирован';
export const USER_EMAIL_EXIST = 'Почта уже зарегистрирована';
export const USER_NOT_FOUND = 'Пользователь не найден';
export const CHANGE_PASSWORD_ERROR = 'Пароль совпадает с предыдущим';
export const EMAIL_ALREADY_EXIST = 'Почта уже занята';
export const EMAIL_EQUAL_CURRENT = 'Вы ввели текущую почту';
export const TG_EQUAL_CURRENT = 'Вы ввели текущий телеграм';

/* CLIENT */
export const CLIENT_NOT_FOUND = 'Приложение не найдено';
export const CLIENT_NOT_AVAILABLE = 'Приложение не доступно';

/* OAUTH */
export const CODE_CHALLENGE_METHOD_INCORRECT = 'Поддерживается только S256';
export const RESPONSE_TYPE_INCORRECT =
  'Тип возвращаемого значения должен быть code';
export const OAUTH_CODE_EXPIRED = 'Код устарел, запросите его снова';
export const SERVICE_NOT_FOUND = 'Сервис не найден';
export const SCOPE_NOT_FOUND = 'Такое разрешение не найдено';
export const TOKEN_NOT_FOUND = 'Такой токен найден';

/* TELEGRAM */
export const TG_CONFIRM_CODE = 'Код подтверждения - ';
export const TG_SEND_LOGIN = 'Ваш логин - ';
export const TG_NOT_CONFIRMED = 'Телеграм не подтверждён';
export const TG_ALREADY_EXIST = 'Телеграм уже занят';

/* UPLOAD */
export const UNSUPPORTED_FILE = 'Файл не поддерживается';
export const FILE_NOT_FOUND = 'Файл не найден';

/* SCOPES */
export const TIME_OF_DAY_BLOCKED = 'У приложения нет доступа к API в это время';
export const DAY_OF_WEEK_BLOCKED = 'У приложения нет доступа к API в этот день';
export const DAY_OF_MONTH_BLOCKED =
  'У приложения нет доступа к API в этот день';
export const REQUESTS_PER_MINUTE_BLOCKED = 'Превышен лимит запросов';
export const DEPENDENT_SCOPES_BLOCKED = 'Отсутствуют необходимые доступы';
export const IP_WHITELIST_BLOCKED = 'Не валидный IP-адрес';
export const IP_BLACKLIST_BLOCKED = 'Не валидный IP-адрес';
export const USER_ROLES_BLOCKED = 'У пользователя нет доступа к этому API';
export const PROJECTS_BLOCKED = 'У пользователя нет доступа к этому API';
export const GEO_ALLOWED_COUNTRIES_BLOCKED =
  'Доступ из текущей страны запрещен';
export const GEO_DENIED_COUNTRIES_BLOCKED = 'Доступ из текущей страны запрещен';

/* PROXY */
export const PROXY_ROUTE_NOT_FOUND = 'Маршрут не найден';
export const PROXY_ROUTE_EXIST = 'Маршрут с таким именем уже существует';
