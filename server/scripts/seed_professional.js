
import { supabase } from '../src/config/supabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedProfessional = async () => {
    console.log('Seeding professional user...');

    const email = `pro_${Date.now()}@growthory.ai`;
    const password = 'password123';

    // 1. Create Auth User
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'Dr. Sarah Expert',
            role: 'professional'
        }
    });

    if (authError) {
        console.error('Error creating auth user:', authError);
        return;
    }

    console.log(`Auth user created: ${user.id}`);

    // 2. Insert into public.users (if trigger didn't do it)
    // We'll calculate it just in case, using upsert to be safe
    const { error: userError } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: email,
            full_name: 'Dr. Sarah Expert',
            role: 'professional',
            avatar_url: null
        });

    if (userError) {
        console.error('Error syncing to public.users:', userError);
    } else {
        console.log('Synced to public.users');
    }

    // 3. Insert into professional_profiles
    const { error: profileError } = await supabase
        .from('professional_profiles')
        .upsert({
            id: user.id,
            skills: ['Strategic Planning', 'AI Consulting'],
            experience_years: 12
        });

    if (profileError) {
        console.error('Error creating profile:', profileError);
    } else {
        console.log('Professional profile created.');
    }
};

seedProfessional();
