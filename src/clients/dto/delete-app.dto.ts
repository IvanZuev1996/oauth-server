import { PickType } from '@nestjs/swagger';
import { UpdateAppDto } from './update-app.dto';

export class DeleteAppDto extends PickType(UpdateAppDto, ['id']) {}
