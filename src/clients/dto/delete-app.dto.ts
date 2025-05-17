import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteAppDto {
  @ApiProperty()
  @IsString()
  clientId: string;
}
