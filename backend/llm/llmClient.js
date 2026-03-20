import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order (fallback chain)
const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.5-pro"];

async function callWithRetryMultimodal(parts, maxRetries = 3) {
    for (const modelName of MODELS) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                console.log(`Trying model: ${modelName} (attempt ${attempt + 1})`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent({
                    contents: [{ role: "user", parts }],
                    generationConfig: { responseMimeType: "application/json" }
                });

                const rawText = result.response.text();
                console.log("LLM RESPONSE:", rawText);
                const cleanedJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
                return JSON.parse(cleanedJson);
            } catch (error) {
                const is429 = error.message?.includes('429') || error.message?.includes('quota');
                console.error(`Error with ${modelName} (attempt ${attempt + 1}):`, error.message);

                if (is429) {
                    console.log(`Quota exceeded for ${modelName}, trying next model...`);
                    break;
                }

                if (attempt < maxRetries - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
    }
    throw new Error("All Gemini models failed. Please try again in a minute.");
}

export const callLLM = async (promptText) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    const fullPrompt = "You are an expert logic engine. Return strictly valid JSON arrays or objects based on the user format constraint.\n\n" + promptText;
    return callWithRetryMultimodal([{ text: fullPrompt }]);
};

const ANALYSIS_PROMPT = `Extract the FULL profile from the provided resume and job description.

Evaluate the candidate for the given job description and calculate an Employability Score from 0 to 100 based on:
- Skill match
- Experience relevance
- Project quality

Return STRICT JSON only, exactly matching this structure:

{
  "name": "",
  "education": "",
  "experience": [
    { "role": "", "company": "", "duration": "" }
  ],
  "projects": [
    { "title": "", "description": "" }
  ],
  "employabilityScore": 0,
  "extractedSkills": [
    { "name": "", "level": "beginner|intermediate|advanced" }
  ],
  "requiredSkills": [
    { "name": "" }
  ],
  "gapAnalysis": {
    "toSkip": [
      { "name": "", "reason": "e.g. Mastered, Proficient, Not heavily required" }
    ],
    "toLearn": [
      { "name": "", "reason": "e.g. Missing requirement, Needs advanced knowledge" }
    ]
  }
}

Rules:
- READ the resume PDF/text very carefully to extract ALL skills the candidate has
- READ the job description text carefully — it may be plain text or a PDF; extract ALL required skills from it
- extractedSkills must contain EVERY skill found in the resume — NEVER return an empty array
- requiredSkills must contain ALL skills mentioned in the job description — NEVER return an empty array if a JD is provided
- gapAnalysis.toLearn must only contain skills that are in requiredSkills but NOT in extractedSkills — NEVER return an empty array if there are missing skills
- gapAnalysis.toSkip must only contain skills that are in BOTH requiredSkills AND extractedSkills
- For extractedSkills level, STRICTLY use one of: "beginner", "intermediate", "advanced"
- Normalize skill names
- Avoid duplicates
- Be precise`;

/**
 * Extract skills by sending the resume (as PDF binary or text) and JD directly to Gemini.
 * Supports multimodal input so scanned/image-based PDFs are read by Gemini's vision.
 *
 * @param {Buffer|null} resumeBuffer - Raw PDF buffer (if resume is a PDF)
 * @param {string} resumeText - Extracted text from non-PDF resume files
 * @param {string} jobDescriptionText - Job description text
 */
export async function extractSkills(resumeBuffer, resumeText, jobDescriptionText) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    // Build the multimodal parts array
    const parts = [];

    // Add the instruction prompt
    parts.push({ text: ANALYSIS_PROMPT });

    // Add resume as either inline PDF data or text
    if (resumeBuffer) {
        console.log("Sending resume as inline PDF data to Gemini (multimodal)...");
        parts.push({
            inlineData: {
                mimeType: "application/pdf",
                data: resumeBuffer.toString('base64')
            }
        });
    } else if (resumeText) {
        parts.push({ text: `\n\nResume:\n${resumeText}` });
    }

    // Add job description as text
    parts.push({ text: `\n\nJob Description:\n${jobDescriptionText}` });

    return callWithRetryMultimodal(parts);
}
