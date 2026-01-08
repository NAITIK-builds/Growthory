import { supabase } from '../config/supabase.js';

/**
 * Ensures a user exists in the public.users table.
 * If not, it fetches data from auth.users and creates the record.
 * @param {string} userId - The unique ID of the user.
 */
export const ensureUserExists = async (userId) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();

        if (error || !user) {
            console.log(`User ${userId} missing from public.users. Attempting sync...`);

            // Fetch from auth.users (as admin)
            const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(userId);

            if (authError || !authUser) {
                console.warn(`Could not find auth user for sync: ${userId}`);
                return false;
            }

            const { error: insertError } = await supabase
                .from('users')
                .upsert([
                    {
                        id: userId,
                        email: authUser.email,
                        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Unknown User',
                        role: authUser.user_metadata?.role || 'founder',
                        avatar_url: authUser.user_metadata?.avatar_url || null
                    }
                ]);

            if (insertError) {
                console.error(`Failed to sync user ${userId}:`, insertError);
                return false;
            }

            console.log(`Successfully synced user ${userId} to public.users`);
        }
        return true;
    } catch (err) {
        console.error("ensureUserExists error:", err);
        return false;
    }
};
