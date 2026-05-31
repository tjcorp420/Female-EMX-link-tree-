Female EMX Fans & Comments Upgrade

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

What this upgrade adds:
- More stable iPhone-safe design with heavy animations disabled.
- Fans & Comments section instead of Neon Wall naming.
- Public Supabase comments.
- Own-comment delete: users can delete only comments posted from their own device/session.
- Report button: comments disappear from the public site after 3 reports.
- More reactions: 💜 ⚡ 🔥 👑 W 🎮.
- Card styles and vibe/topic pickers.

Required Supabase setup:
1. Open Supabase.
2. Go to Authentication > Providers.
3. Enable Anonymous Sign-Ins.
4. Go to SQL Editor > New Query.
5. Paste/run supabase.sql.
6. Deploy all files to Vercel.

Important:
- Old comments that existed before owner_id was added may not show a Delete button because the site cannot know who owns them.
- You can still delete any comment manually in Supabase > Table Editor > fan_wall.
- In SPCK preview, the comments use Demo mode. Test public comments on the live Vercel link.
- After deploying, open your live site with ?v=delete-report1 once to force the newest files.
- Delete the old Home Screen app icon from her phone and add it again after the update.
