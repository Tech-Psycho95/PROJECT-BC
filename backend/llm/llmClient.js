export const callLLM = async (promptText) => {
    const apiKey = process.env.TRINITY_API_KEY;
    if (!apiKey) throw new Error("TRINITY_API_KEY is not defined in environment variables");

    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const payload = {
        model: "trinity-large-preview",
        messages: [
            { role: "system", content: "You are an expert logic engine. Return strictly valid JSON arrays or objects based on the user format constraint." },
            { role: "user", content: promptText }
        ]
    };

    console.log("Sending request to LLM");

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API error! Status: ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data?.message?.content || '{}';
    
    console.log("LLM RESPONSE:", content);

    return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
};

export async function extractSkills(resumeText, jobDescriptionText) {
    const apiKey = process.env.TRINITY_API_KEY;
    
    if (!apiKey) {
        throw new Error("TRINITY_API_KEY is not defined in environment variables");
    }

    const endpoint = 'https://openrouter.ai/api/v1/chat/completions'; 

    const payload = {
        model: "trinity-large-preview",
        messages: [
            {
                role: "system",
                content: "You are an expert skill analysis engine. Always return strictly valid JSON."
            },
            {
                role: "user",
                content: `Extract the FULL profile from the provided resume and job description.

Evaluate the candidate for the given job description and calculate an Employability Score from 0 to 100 based on:
- Skill match
- Experience relevance
- Project quality

Extract:
- Name
- Education (college, degree)
- Experience (role, company, duration)
- Projects (title + description)
- Skills (with level 0-1)
- Employability Score (0-100)

Rules:
- Infer missing info if needed
- Normalize skill names
- Avoid duplicates
- Be precise

Return STRICT JSON only:

{
  "name": "",
  "education": "",
  "experience": [
    { "role": "", "company": "", "duration": "" }
  ],
  "projects": [
    { "title": "", "description": "" }
  ],
  "skills": [
    { "name": "", "level": 0 }
  ],
  "employabilityScore": 0
}

Resume:
${resumeText}

Job Description:
${jobDescriptionText}`
            }
        ]
    };

    try {
        console.log("Sending request to LLM");
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        const rawText = data.choices?.[0]?.message?.content || data?.message?.content || '{}';
        
        console.log("LLM RESPONSE:", rawText);
        
        const cleanedJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
        
        return JSON.parse(cleanedJson);
    } catch (error) {
        throw error;
    }
}
