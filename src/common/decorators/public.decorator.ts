import { SetMetadata } from '@nestjs/common';
import { PUBLIC_METADATA } from 'src/constants';

export const Public = () => SetMetadata(PUBLIC_METADATA, true);
