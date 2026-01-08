import { supabase } from '../config/supabase.js';
import { generateEmbedding } from '../utils/ai.js';
import { ensureUserExists } from '../utils/userSync.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import fs from 'fs';
import OpenAI from 'openai';

// Configure OpenAI for parsing
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
});

export const parseResume = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        // 1. Extract Text from PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;

        // 2. AI Extract Skills & Exp
        const systemPrompt = `You are an expert technical recruiter. Extract structured data from the resume text. Return JSON only.`;
        const userPrompt = `Resume Text:
    ${resumeText.substring(0, 3000)}... (truncated)

    Extract:
    - skills: Array of strings.
    - experience_years: Integer (total).
    - current_role: String.
    - summary: 2 sentence professional summary.
    `;

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });

        const parsedData = JSON.parse(completion.choices[0].message.content);

        // 3. Save to Supabase
        const { id } = req.body; // User ID passed from frontend
        await ensureUserExists(id);

        // Cleanup file
        fs.unlinkSync(req.file.path);

        const { data, error } = await supabase
            .from('professional_profiles')
            .upsert([
                {
                    id,
                    skills: parsedData.skills,
                    experience_years: parsedData.experience_years,
                    parsed_resume_data: parsedData
                }
            ])
            .select();

        if (error) throw error;

        res.json({ success: true, data: parsedData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
export const getAllProfessionals = async (req, res) => {
    const { data, error } = await supabase
        .from('professional_profiles')
        .select('*, users(full_name, avatar_url)');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};
