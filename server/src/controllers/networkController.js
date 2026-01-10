import { supabase } from '../config/supabase.js';

// Get all people in the network with filters
export const getExplorePeople = async (req, res) => {
    try {
        const { role, industry, searchQuery, currentUserId } = req.query;

        let query = supabase
            .from('users')
            .select(`
                id,
                full_name,
                avatar_url,
                role,
                investor_profiles(bio, interested_industries),
                professional_profiles(skills, experience_years),
                startups(name, industry, tagline)
            `);

        if (role) {
            query = query.eq('role', role);
        }

        if (searchQuery) {
            query = query.ilike('full_name', `%${searchQuery}%`);
        }

        const { data, error } = await query.limit(50);

        if (error) throw error;

        // Fetch existing matches for the current user to show 'pending' or 'connected'
        let existingMatches = [];
        if (currentUserId) {
            const { data: matches } = await supabase
                .from('matches')
                .select('target_id, source_id, status')
                .or(`source_id.eq.${currentUserId},target_id.eq.${currentUserId}`)
                .order('created_at', { ascending: false });
            existingMatches = matches || [];
        }

        // Simplify data structure for frontend
        const people = data.map(person => {
            if (person.id === currentUserId) return null; // Don't show self

            let details = '';
            if (person.role === 'founder' && person.startups?.length > 0) {
                details = person.startups[0].name + ' • ' + person.startups[0].industry;
            } else if (person.role === 'investor' && person.investor_profiles) {
                details = person.investor_profiles.bio || 'Investor';
            } else if (person.role === 'professional' && person.professional_profiles) {
                details = (person.professional_profiles.skills?.slice(0, 2).join(', ')) || 'Professional';
            }

            const match = existingMatches.find(m => m.source_id === person.id || m.target_id === person.id);
            const status = match ? match.status : null;

            return {
                id: person.id,
                full_name: person.full_name,
                avatar_url: person.avatar_url,
                role: person.role,
                details,
                pending: status === 'pending',
                connected: status === 'accepted'
            };
        }).filter(Boolean);

        res.json(people);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send a connection request
export const sendConnectionRequest = async (req, res) => {
    const { source_id, target_id, match_type: requestedType } = req.body;

    try {
        // Check for existing pending/accepted request
        const { data: existingMatches } = await supabase
            .from('matches')
            .select('id, status')
            .or(`and(source_id.eq.${source_id},target_id.eq.${target_id}),and(source_id.eq.${target_id},target_id.eq.${source_id})`);

        if (existingMatches?.length > 0) {
            const active = existingMatches.find(m => m.status === 'pending' || m.status === 'accepted');
            if (active) {
                return res.status(400).json({ error: active.status === 'pending' ? 'Connection request already pending' : 'Already connected' });
            }
        }

        // Fetch source and target roles to determine correct match_type if not provided
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id, role')
            .in('id', [source_id, target_id]);

        if (userError) throw userError;

        const source = users.find(u => u.id === source_id);
        const target = users.find(u => u.id === target_id);

        let finalType = requestedType;
        if (!finalType || (finalType !== 'investor_startup' && finalType !== 'candidate_job')) {
            // Logic to determine type based on roles
            if ((source?.role === 'investor' && target?.role === 'founder') ||
                (source?.role === 'founder' && target?.role === 'investor')) {
                finalType = 'investor_startup';
            } else if ((source?.role === 'professional' && target?.role === 'founder') ||
                (source?.role === 'founder' && target?.role === 'professional')) {
                finalType = 'candidate_job';
            } else {
                // Default to investor_startup as it's the most common "match" type in this system
                finalType = 'investor_startup';
            }
        }

        const { data, error } = await supabase
            .from('matches')
            .insert([
                {
                    source_id,
                    target_id,
                    match_type: finalType,
                    status: 'pending'
                }
            ])
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's network connections
export const getMyNetwork = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find matches where user is source OR target and status is accepted
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .or(`source_id.eq.${userId},target_id.eq.${userId}`)
            .eq('status', 'accepted');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get pending connection requests (received by user)
export const getPendingRequests = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Get the pending matches first
        const { data: matches, error: matchError } = await supabase
            .from('matches')
            .select('*')
            .eq('target_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (matchError) throw matchError;

        if (!matches || matches.length === 0) {
            return res.json([]);
        }

        // Step 2: Get the user details for the source_ids
        const sourceIds = matches.map(m => m.source_id);

        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id, full_name, avatar_url, role')
            .in('id', sourceIds);

        if (userError) throw userError;

        // Step 3: Map users back to matches
        const requests = matches.map(match => {
            const sender = users.find(u => u.id === match.source_id);
            if (!sender) return null; // Should not happen if data integrity is good

            return {
                id: match.id,
                from: {
                    id: sender.id,
                    full_name: sender.full_name,
                    avatar_url: sender.avatar_url,
                    role: sender.role
                },
                match_type: match.match_type,
                created_at: match.created_at
            };
        }).filter(Boolean); // Filter out any nulls if user wasn't found

        res.json(requests);
    } catch (error) {
        console.error("Pending requests error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Accept or reject a connection request
export const respondToRequest = async (req, res) => {
    const { matchId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    try {
        const newStatus = action === 'accept' ? 'accepted' : 'rejected';

        const { data, error } = await supabase
            .from('matches')
            .update({ status: newStatus })
            .eq('id', matchId)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
