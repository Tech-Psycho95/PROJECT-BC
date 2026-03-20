import express from 'express';
import { analyzeSkillsController } from '../controllers/skillController.js';

const router = express.Router();

// Maps to /analyze-skills from server.js
router.post('/', analyzeSkillsController);

export default router;
