import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(config.publicPath, 'images');
    const destDirQuiz = path.join(destDir, 'quiz');
    const destDirQuestion = path.join(destDir, 'question');

    await fs.mkdir(destDir, { recursive: true });
    await fs.mkdir(destDirQuiz, { recursive: true });
    await fs.mkdir(destDirQuestion, { recursive: true });

    if (_file.fieldname === 'quizImage') {
      cb(null, destDirQuiz);
    } else if (_file.fieldname === 'questionImage') {
      cb(null, destDirQuestion);
    }
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, randomUUID() + extension);
  },
});

export const imagesUpload = multer({ storage: imageStorage });
