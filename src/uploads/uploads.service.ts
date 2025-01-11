import { BadRequestException, Injectable } from '@nestjs/common';
import { FILE_NOT_FOUND, UNSUPPORTED_FILE } from 'src/constants';
import { DeleteImageDto } from './dto';
import { join, normalize, resolve } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class UploadsService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file', UNSUPPORTED_FILE);
    return {
      status: 'success',
      path: `/uploads/${file.filename}`,
    };
  }

  async deleteImage(dto: DeleteImageDto) {
    const uploadsDir = resolve(__dirname, '..', '..');
    const filePath = resolve(normalize(join(uploadsDir, dto.path)));

    if (!filePath.startsWith(uploadsDir)) {
      throw new BadRequestException('file', FILE_NOT_FOUND);
    }

    try {
      await unlink(filePath);
      return { status: 'success' };
    } catch (err) {
      throw new BadRequestException('file', FILE_NOT_FOUND);
    }
  }
}
