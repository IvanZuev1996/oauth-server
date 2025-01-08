import { SetMetadata } from '@nestjs/common';
import { OAUTH_METADATA } from 'src/constants';

export const OAuth = () => SetMetadata(OAUTH_METADATA, true);
