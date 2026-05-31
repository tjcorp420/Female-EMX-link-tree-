Female EMX Full Upgrade Project

Files:
- index.html
- styles.css
- script.js
- manifest.json
- sw.js
- image.png
- icon-192.png
- icon-512.png
- supabase.sql

SPCK / Vercel setup:
1. Keep all files in the root folder of your repo.
2. Your Vercel settings should be Framework Preset: Other, Build Command blank, Output Directory blank.
3. The page works in demo mode immediately.
4. For a public comments wall, create a Supabase project, run supabase.sql in SQL Editor, then paste your Project URL and anon public key into CONFIG in script.js.
5. Never put a service_role key into script.js.
