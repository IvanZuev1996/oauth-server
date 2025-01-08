import { SetMetadata } from '@nestjs/common';
import { SCOPES_METADATA } from 'src/constants';

export const Scopes = (...scopes: string[]) =>
  SetMetadata(SCOPES_METADATA, scopes);
