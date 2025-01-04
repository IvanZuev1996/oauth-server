import { PickType } from '@nestjs/swagger';
import { UpdateAppDto } from './update-app.dto';

export class GetAppByIdDto extends PickType(UpdateAppDto, ['id']) {}
