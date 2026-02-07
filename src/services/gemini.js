import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeResume = async (resumeText, portfolioUrl = "", apiKey) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is provided. Please enter it to proceed.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert technical recruiter and hiring manager at a top-tier tech company. 
    Analyze the following resume text and optional portfolio URL to provide critical, actionable feedback.
    
    ${resumeText ? `Resume Text:\n"${resumeText.substring(0, 10000)}"` : "Resume Text: Not provided - analyze based on Portfolio URL only."}
    
    ${portfolioUrl ? `Portfolio URL: ${portfolioUrl}` : "Portfolio URL: Not provided."}

    Your analysis must be returned in strict JSON format with the following structure:
    {
      "score": number (0-100),
      "score_breakdown": {
        "impact": number (0-100),
        "skills_match": number (0-100),
        "formatting": number (0-100),
        "brevity": number (0-100)
      },
      "summary": "2-3 sentence professional summary of the candidate's standing.",
      "persona_feedback": "A direct quote representing what a recruiter would think immediately upon seeing this.",
      "sections": [
        {
          "name": "Experience", 
          "score": number, 
          "feedback": "Specific feedback...", 
          "improvements": ["Actionable tip 1", "Actionable tip 2"]
        },
        // MANDATORY: You must include objects for: "Experience", "Education", "Skills", "Formatting".
        // The "name" field is REQUIRED.
        // ... include Experience, Projects, Skills, Education
      ],
      "rewrites": [
        {
          "original": "The exact bullet point from the resume that is weak",
          "improved": "A rewritten, high-impact version using action verbs and metrics",
          "reason": "Why the change was made"
        },
        // Provide 3 rewrites
      ]
    }

    Validation Rules:
    - Be strict but constructive. 
    - Focus on quantifyable impact (metrics).
    - If the resume lacks metrics, lower the Impact score.
    - Return ONLY the JSON string, no markdown formatting.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Locate the JSON block
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        if (error.message.includes('429')) {
            throw new Error("You're analyzing too fast! Please wait a minute before trying again (Gemini Free Tier Limit).");
        }
        throw new Error("Failed to analyze resume. Please try again.");
    }
};
