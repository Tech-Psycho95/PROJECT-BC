import { buildSkillExtractionPrompt } from '../llm/promptBuilder.js';
import { callLLM } from '../llm/llmClient.js';

export const extractSkills = async (textContext) => {
    const prompt = buildSkillExtractionPrompt(textContext);
    const result = await callLLM(prompt);
    
    console.log('Skill extraction complete');
    return ['JavaScript', 'React', 'Node.js', 'Express']; // Mock return data
};
