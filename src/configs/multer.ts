import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from 'src/common/exceptions';
import { UNSUPPORTED_FILE } from 'src/constants';

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestException('file', UNSUPPORTED_FILE), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};
