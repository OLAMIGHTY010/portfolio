require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Creating 'documents' bucket...");
  const { data, error } = await supabase.storage.createBucket('documents', {
    public: true,
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    fileSizeLimit: 10485760 // 10MB
  });

  if (error) {
    if (error.message.includes("already exists")) {
       console.log("Bucket 'documents' already exists.");
    } else {
       console.error("Error creating bucket:", error);
    }
  } else {
    console.log("Bucket 'documents' created successfully!", data);
  }
}
run();
