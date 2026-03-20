import { callLLM } from '../llm/llmClient.js';

export const analyzeGaps = async (currentSkills, targetRole) => {
    console.log(`Analyzing skill gaps dynamically for role: ${targetRole}`);
    const prompt = `Given these current skills: ${JSON.stringify(currentSkills)}, and a target role of: ${targetRole}. Find missing crucial skills. Return a STRICT JSON array of objects: [{"name": "Skill Name", "reason": "Short reason why"}]. Make it exactly an array.`;
    const result = await callLLM(prompt);
    return result;
};
