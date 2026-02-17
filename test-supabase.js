const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testFetch() {
    console.log("Testing fetch with EXPLICIT reviews join...");
    const { data, error } = await supabase
        .from('resources')
        .select('*, reviews!resource_id(rating)')
        .limit(1);

    if (error) {
        console.error("Explicit Join Error:", error);
    } else {
        console.log("SUCCESS! Data fetched with reviews:", JSON.stringify(data));
    }
}

testFetch();
