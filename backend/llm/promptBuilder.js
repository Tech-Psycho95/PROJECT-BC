export const buildSkillExtractionPrompt = (resumeText) => {
    return `Extract all technical and soft skills from the following unstructured resume text:\n\n${resumeText}\n\nReturn the skills as a comma-separated list.`;
};

export const buildRoadmapPrompt = (missingSkills) => {
    return `Create a detailed, step-by-step learning roadmap to acquire the following missing skills: ${missingSkills.join(', ')}.\n\nStructure the roadmap by weeks and actionable topics.`;
};
