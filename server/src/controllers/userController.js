import { supabase } from '../config/supabase.js';

// Get detailed user profile
export const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select(`
                *,
                investor_profiles(*),
                professional_profiles(*),
                startups(*, startup_analysis(*))
            `)
            .eq('id', id)
            .single();

        if (userError) throw userError;

        res.json(user);
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
};

// Get user suggestions
export const getUserSuggestions = async (req, res) => {
    const { excludeId, limit = 5 } = req.query;
    try {
        let query = supabase
            .from('users')
            .select('id, full_name, avatar_url, role');

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data, error } = await query.limit(limit);
        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get who liked a startup
export const getStartupLikes = async (req, res) => {
    const { id } = req.params; // startup_id
    try {
        const { data, error } = await supabase
            .from('startup_likes')
            .select('user_id, users(id, full_name, avatar_url, role)')
            .eq('startup_id', id);

        if (error) throw error;

        // Flatten the structure
        const likedBy = data.map(item => item.users);
        res.json(likedBy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
