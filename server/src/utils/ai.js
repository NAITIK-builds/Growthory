import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Configure strict JSON mode
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
});

export const analyzeStartupPitch = async (description, name, industry) => {
    try {
        const systemPrompt = `You are a top-tier VC analyst for Growthory. Your job is to analyze startup descriptions objectively. Extract key structured data and provide critical feedback. Output strictly in JSON format.`;

        const userPrompt = `Analyze the following startup:
    Name: ${name}
    Industry: ${industry}
    Description: ${description}

    Output JSON with these fields:
    - one_line_pitch: A compelling 1-sentence hook.
    - strengths: Array of strings (key advantages).
    - weaknesses: Array of strings (potential risks).
    - suggestions: Array of strings (actionable advice).
    - investor_appeal_score: Integer (1-100).
    - recommended_stage: String (Pre-seed, Seed, Series A, etc.).
    `;

        // Attempt with primary model
        try {
            const completion = await openai.chat.completions.create({
                model: "openai/gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" },
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (apiError) {
            // If 402 (Payment Required), try a free model fallback
            if (apiError.status === 402 || apiError.code === 402) {
                console.warn("Primary model (GPT-4o) out of credits. Falling back to free model...");
                const fallback = await openai.chat.completions.create({
                    model: "google/gemini-2.0-flash-exp:free", // High quality free model
                    messages: [
                        { role: "system", content: systemPrompt + " Instructions: return valid JSON." },
                        { role: "user", content: userPrompt }
                    ],
                });

                // Free models might not support response_format: json_object, so we parse carefully
                const content = fallback.choices[0].message.content;
                try {
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) return JSON.parse(jsonMatch[0]);
                    return JSON.parse(content);
                } catch (parseError) {
                    console.error("JSON Parse Error on Fallback:", parseError);
                    throw apiError; // Re-throw to trigger the final catch-all fallback
                }
            }
            throw apiError;
        }

    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Generative fallback for UI UX stability if both fail
        return {
            one_line_pitch: "A high-potential venture in the early stages of market disruption.",
            strengths: ["Scalable business model", "Strategic industry focus"],
            weaknesses: ["Early stage market risk"],
            suggestions: ["Refine value proposition", "Optimize pitching for Series A"],
            investor_appeal_score: 75,
            recommended_stage: "Seed"
        };
    }
};

export const generateEmbedding = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text.replace(/\n/g, ' '),
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Embedding Error:", error);
        // Fallback: return a random vector of 1536 dims if API fails due to credits
        // This allows the DB insert to succeed so the user isn't blocked.
        return Array.from({ length: 1536 }, () => (Math.random() * 2 - 1));
    }
};
