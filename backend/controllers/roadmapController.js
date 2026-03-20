import { generateLearningRoadmap } from '../services/roadmapGenerator.js';

export const generateRoadmapController = async (req, res) => {
    try {
        const { missingSkills } = req.body;

        if (!missingSkills || !Array.isArray(missingSkills) || missingSkills.length === 0) {
            return res.status(400).json({ error: 'missingSkills array is required in the request body' });
        }

        console.log("Generating roadmap for skills:", missingSkills);
        const roadmap = await generateLearningRoadmap(missingSkills);
        res.status(200).json({ message: 'Roadmap generated', roadmap });
    } catch (error) {
        console.error("Roadmap generation error:", error.message);
        res.status(500).json({ error: 'Failed to generate roadmap: ' + error.message });
    }
};
