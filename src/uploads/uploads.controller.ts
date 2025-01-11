import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { multerConfig } from 'src/configs/multer';
import { DeleteImageDto } from './dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Post()
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadImage(file);
  }

  @ApiBearerAuth()
  @Delete()
  deleteImage(@Body() dto: DeleteImageDto) {
    return this.uploadsService.deleteImage(dto);
  }
}
