
/**
 * Analyzes resume using Hugging Face Inference API
 * Model: mistralai/Mistral-7B-Instruct-v0.3 (Reliable for JSON)
 */
export const analyzeResume = async (resumeText, portfolioUrl = "", apiKey) => {
    if (!apiKey) {
        throw new Error("Hugging Face API Token is missing.");
    }

    const model = "microsoft/Phi-3-mini-4k-instruct";
    const apiUrl = `/api/hf/models/${model}`;

    const prompt = `<|user|> You are an expert technical recruiter. Analyze the resume below.
  
  Resume:
  "${resumeText ? resumeText.substring(0, 6000) : "No resume text provided."}"
  
  ${portfolioUrl ? `Portfolio: ${portfolioUrl}` : "No portfolio."}

  Output STRICT JSON (no markdown, no explanations) following this schema:
  {
      "score": 0-100,
      "score_breakdown": { "impact": 0-100, "skills_match": 0-100, "formatting": 0-100, "brevity": 0-100 },
      "summary": "Professional summary...",
      "persona_feedback": "Direct recruiter quote...",
      "sections": [
          { "name": "Experience", "score": 0-100, "feedback": "...", "improvements": ["tip1", "tip2"] }
      ],
      "rewrites": [
          { "original": "weak point", "improved": "strong point", "reason": "why" }
      ]
  }
  <|end|>
  <|assistant|>`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 2000,
                    temperature: 0.7,
                    return_full_text: false
                }
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `Hugging Face API Error: ${response.status}`);
        }

        const result = await response.json();
        let text = result[0]?.generated_text || "";

        // Clean potential markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Attempt to find the first '{' and last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse HF response:", text);
            throw new Error("AI returned invalid format. Please try again.");
        }

    } catch (error) {
        console.error("Hugging Face Analysis Error:", error);
        throw new Error("Failed to analyze. Please check your HF Token or try again.");
    }
};
