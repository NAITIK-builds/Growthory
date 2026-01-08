import { supabase } from '../config/supabase.js';
import { analyzeStartupPitch } from '../utils/ai.js';
import { ensureUserExists } from '../utils/userSync.js';

export const createStartup = async (req, res) => {
    try {
        const { founder_id, name, tagline, description, industry, stage, website } = req.body;

        // 1. Ensure User exists in public.users (Lazy sync)
        await ensureUserExists(founder_id);

        // 2. Create Startup Record
        const { data: startup, error: dbError } = await supabase
            .from('startups')
            .insert([
                { founder_id, name, tagline, description_raw: description, industry, stage, website }
            ])
            .select()
            .single();

        if (dbError) throw dbError;

        // 2. Trigger AI Analysis (Async)
        // In production, use a queue. For MVP, we await or fire-and-forget (but user wants results).
        // Let's await it for the "Wow" factor immediately.
        const analysis = await analyzeStartupPitch(description, name, industry);

        // 3. Save Analysis
        const { error: analysisError } = await supabase
            .from('startup_analysis')
            .insert([
                {
                    startup_id: startup.id,
                    one_line_pitch: analysis.one_line_pitch,
                    strengths: analysis.strengths,
                    weaknesses: analysis.weaknesses,
                    suggestions: analysis.suggestions,
                    investor_appeal_score: analysis.investor_appeal_score
                }
            ]);

        if (analysisError) console.error("Error saving analysis:", analysisError);

        res.status(201).json({
            success: true,
            startup,
            analysis
        });

    } catch (error) {
        console.error("Create Startup Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStartup = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('startups')
        .select('*, startup_analysis(*)')
        .eq('id', id)
        .single();

    if (error) return res.status(404).json({ error: "Not found" });
    res.json(data);
};

export const getAllStartups = async (req, res) => {
    const { data, error } = await supabase
        .from('startups')
        .select(`
            *,
            startup_analysis(one_line_pitch, investor_appeal_score),
            founder:users!founder_id(full_name, avatar_url),
            likes:startup_likes(count),
            comments:startup_comments(count)
        `)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Transform counts to simple numbers
    const transformed = data.map(s => ({
        ...s,
        like_count: s.likes?.[0]?.count || 0,
        comment_count: s.comments?.[0]?.count || 0
    }));

    res.json(transformed);
};

export const toggleLike = async (req, res) => {
    const { startup_id, user_id } = req.body;
    try {
        // Check if already liked
        const { data: existing } = await supabase
            .from('startup_likes')
            .select('*')
            .eq('startup_id', startup_id)
            .eq('user_id', user_id)
            .single();

        if (existing) {
            await supabase
                .from('startup_likes')
                .delete()
                .eq('startup_id', startup_id)
                .eq('user_id', user_id);
            return res.json({ liked: false });
        } else {
            await supabase
                .from('startup_likes')
                .insert([{ startup_id, user_id }]);
            return res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addComment = async (req, res) => {
    const { startup_id, user_id, content } = req.body;
    try {
        const { data, error } = await supabase
            .from('startup_comments')
            .insert([{ startup_id, user_id, content }])
            .select('*, users(full_name, avatar_url)')
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getComments = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('startup_comments')
            .select('*, users(full_name, avatar_url)')
            .eq('startup_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
