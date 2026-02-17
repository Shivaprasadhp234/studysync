const { createClient } = require('@supabase/supabase-js');

// Load env vars manually for this script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing env vars. Please run with `dotenv -e .env.local node verify-bucket.js` or set them manually.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkBucket() {
    console.log("Checking bucket 'academic-resources'...");
    const { data, error } = await supabase
        .storage
        .getBucket('academic-resources');

    if (error) {
        console.error("Error getting bucket:", error.message);
        if (error.message.includes("The resource was not found")) {
            console.log("Bucket does not exist. Please create it.");
        }
    } else {
        console.log("Bucket found:", data);
        console.log("Is public?", data.public);
    }
}

checkBucket();
