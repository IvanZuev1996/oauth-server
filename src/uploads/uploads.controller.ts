import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { multerConfig } from 'src/configs/multer';
import { UNSUPPORTED_FILE } from 'src/constants';

@Controller('uploads')
export class UploadsController {
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Post()
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file', UNSUPPORTED_FILE);
    return {
      status: 'success',
      path: `/uploads/${file.filename}`,
    };
  }
}
