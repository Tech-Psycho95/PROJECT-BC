import express from 'express';
import { uploadResumeController } from '../controllers/skillController.js';

const router = express.Router();

// Maps to /upload-resume from server.js
router.post('/', uploadResumeController);

export default router;
