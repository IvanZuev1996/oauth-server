import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const TokensResponse: SchemaObject = {
  type: '',
  properties: {
    type: { type: 'string' },
    access_token: { type: 'string' },
    refresh_token: { type: 'string' },
  },
  example: {
    type: 'Bearer',
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibG9naW4iOiJuaWNrbmFtZSIsImlhdCI6MTY4ODUzODA5OSwiZXhwIjoxNjg4NTM5ODk5fQ.1bKzIyaXArJf_-IxKiwQD4JVX5XX2GEayz5RsVJ7eM8',
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibG9naW4iOiJuaWNrbmFtZSIsImlhdCI6MTY4ODUzODA5OSwiZXhwIjoxNjg4NTM5ODk5fQ.1bKzIyaXArJf_-IxKiwQD4JVX5XX2GEayz5RsVJ7eM8',
  },
};

export const GetConfirmCodesResponse: SchemaObject = {
  type: 'object',
  properties: {
    request_id: { type: 'string' },
    user_id: { type: 'number' },
  },
  example: {
    request_id: 'qweqR%25Qf',
    user_id: 1,
  },
};

export const ConfirmCodeResponse: SchemaObject = {
  type: 'object',
  properties: {
    is_confirmed: { type: 'boolean' },
    code: { type: 'string' },
  },
  example: {
    is_confirmed: true,
  },
};

export const ChangePasswordResponse: SchemaObject = {
  type: 'object',
  properties: {
    is_password_changed: { type: 'boolean' },
  },
  example: {
    is_password_changed: true,
  },
};

export const ChangeTelegramResponse: SchemaObject = {
  type: 'object',
  properties: {
    telegram: { type: 'string' },
  },
  example: {
    telegram: 'some_tg',
  },
};

export const GetMeResponse: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    login: { type: 'string' },
    telegram: { type: 'string' },
    is_migrated: { type: 'boolean' },
    created_at: { type: 'string' },
  },
  example: {
    id: 11,
    login: 'kolegov',
    telegram: 'kolegov',
    is_migrated: true,
    created_at: '2023-09-07T09:37:45.003Z',
  },
};

export const LogoutResponse: SchemaObject = {
  type: 'object',
  properties: {
    is_logout: { type: 'boolean' },
  },
  example: {
    is_logout: true,
  },
};

export const BalanceResponse: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    balance: { type: 'number' },
    ref_balance: { type: 'number' },
    user_id: { type: 'number' },
  },
  example: {
    id: 1,
    balance: 4000,
    ref_balance: 879,
    user_id: 11,
  },
};

export const GetMoneyMovementRecordsResponse: SchemaObject = {
  type: 'object',
  properties: {
    count: { type: 'number' },
    rows: {
      type: 'array',
      properties: {
        id: { type: 'number' },
        sum: { type: 'number' },
        description: { type: 'string' },
        type: { type: 'string' },
        status: { type: 'string' },
        card_or_account: { type: 'string' },
        created_at: { type: 'string' },
      },
    },
  },
  example: {
    count: 100,
    rows: [
      {
        id: 1,
        sum: 1000,
        description: 'Пополнение общего баланса',
        status: 'success',
        type: 'add_to_balance',
        card_or_account: null,
        created_at: '2023-09-11T09:09:57.272Z',
      },
      {
        id: 2,
        sum: 1000,
        description: 'Пополнение общего баланса',
        status: 'success',
        type: 'add_to_balance',
        card_or_account: null,
        created_at: '2023-09-11T09:10:10.551Z',
      },
    ],
  },
};

export const NotifyResponse: SchemaObject = {
  type: 'object',
  properties: {
    status: { type: 'boolean' },
  },
  example: {
    status: true,
  },
};
