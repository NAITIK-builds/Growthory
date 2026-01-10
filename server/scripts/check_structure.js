
import { supabase } from '../src/config/supabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkQueryStructure = async () => {
    console.log('Checking query structure...');

    const { data, error } = await supabase
        .from('users')
        .select(`
            id,
            role,
            professional_profiles(skills, experience_years)
        `)
        .eq('role', 'professional')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', JSON.stringify(data, null, 2));

        if (data.length > 0) {
            const profile = data[0].professional_profiles;
            console.log('Type of professional_profiles:', Array.isArray(profile) ? 'Array' : typeof profile);
        }
    }
};

checkQueryStructure();
