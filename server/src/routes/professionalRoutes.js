import express from 'express';
import multer from 'multer';
import { parseResume, getAllProfessionals } from '../controllers/resumeController.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/', getAllProfessionals);

router.post('/upload-resume', upload.single('resume'), parseResume);

export default router;
