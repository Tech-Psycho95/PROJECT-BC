import { callLLM } from '../llm/llmClient.js';

export const generateLearningRoadmap = async (missingSkills) => {
    const prompt = `Generate a sequential learning roadmap curriculum for these exact missing skills: ${JSON.stringify(missingSkills)}. Combine them into logical sequential modules if appropriate. Return STRICT JSON array of objects, formatting exactly: [{"id": 1, "title": "Module Title", "description": "Short explanation", "status": "active", "timeframe": "Week 1"}]. Do not add markdown or extra text.`;
    const result = await callLLM(prompt);
    console.log('Roadmap generation strictly returned from LLM', result);
    return result;
};
