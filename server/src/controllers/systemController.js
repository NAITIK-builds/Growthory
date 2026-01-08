import { supabase } from '../config/supabase.js';

export const getSystemStats = async (req, res) => {
    try {
        // Fetch counts for total startups, investors, and professionals
        const { count: startupCount, error: sError } = await supabase
            .from('startups')
            .select('*', { count: 'exact', head: true });

        const { count: investorCount, error: iError } = await supabase
            .from('investor_profiles')
            .select('*', { count: 'exact', head: true });

        const { count: professionalCount, error: pError } = await supabase
            .from('professional_profiles')
            .select('*', { count: 'exact', head: true });

        if (sError || iError || pError) throw new Error("Error fetching counts");

        // Mock some volume data if database is empty for MVP feel
        const stats = {
            totalStartups: startupCount || 0,
            totalInvestors: investorCount || 0,
            totalProfessionals: professionalCount || 0,
            totalVolume: "$124.5M", // Placeholder for actual financial data if tracked
            activeMatches: 450, // Placeholder
            globalNodes: 12, // Placeholder
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
