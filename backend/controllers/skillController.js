import { parseResume } from '../services/resumeParser.js';
import { extractSkills } from '../services/skillExtractor.js';
import { analyzeGaps } from '../services/gapAnalysis.js';

export const uploadResumeController = async (req, res) => {
    try {
        const resumeText = await parseResume('demo.pdf'); // Placeholder filename
        res.status(200).json({ message: 'Resume uploaded and parsed', data: resumeText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process resume' });
    }
};

export const analyzeSkillsController = async (req, res) => {
    try {
        const skills = await extractSkills('mock resume text');
        const gaps = await analyzeGaps(skills, 'Senior Developer'); // Target role
        res.status(200).json({ message: 'Skills analyzed', skills, gaps });
    } catch (error) {
        res.status(500).json({ error: 'Failed to analyze skills' });
    }
};
