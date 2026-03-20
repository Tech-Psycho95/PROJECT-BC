import { generateLearningRoadmap } from '../services/roadmapGenerator.js';

export const generateRoadmapController = async (req, res) => {
    try {
        // missingSkills list would come from req.body typically
        const missingSkills = ['System Design', 'React Performance'];
        const roadmap = await generateLearningRoadmap(missingSkills);
        res.status(200).json({ message: 'Roadmap generated', roadmap });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate roadmap' });
    }
};
