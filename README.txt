FEMALE EMX ADMIN V3 LIVE APPLY UPGRADE

WHAT THIS ZIP ADDS
- Admin Dashboard tabs: Dashboard, Settings, Comments, Voting, Preview
- Apply Changes Live button
- Public site reads site_settings and can update live while open
- Dashboard stats: comments, reports, hidden, reactions, votes, top fan, latest comment
- Announcement bar controls
- Featured clip controls
- Top fans leaderboard controls
- Map voting controls with reset votes
- Moderation: hide/unhide, reset reports, delete, pin as message
- Password login admin page, no magic-link email rate limits
- Stable phone-friendly public page

UPLOAD TO GITHUB/VERCEL ROOT
index.html
styles.css
script.js
admin.html
admin.css
manifest.json
sw.js
image.png
icon-192.png
icon-512.png
supabase.sql

admin.js is included only as a placeholder. Admin V3 uses inline JavaScript inside admin.html so the login button works reliably on iPhone.

SUPABASE SETUP
1. Supabase > Authentication > Providers > Email enabled.
2. Supabase > Authentication > Providers > Anonymous Sign-Ins enabled.
3. Supabase > Authentication > Users > create user:
   Email: jordantj333@gmail.com
   Password: your admin password
   Auto Confirm: ON
4. Supabase > SQL Editor > New Query > paste/run supabase.sql.
5. If needed, run:
   insert into public.admin_users (email)
   values ('jordantj333@gmail.com')
   on conflict (email) do nothing;

VERCEL SETTINGS
Framework Preset: Other
Build Command: blank
Output Directory: blank
Root Directory: blank

TEST LINKS
Public:
https://female-emx-link-tree.vercel.app/?v=adminv3-live1

Admin:
https://female-emx-link-tree.vercel.app/admin.html?v=adminv3-live1

IMPORTANT
Do not paste a service_role key into any website file. The anon key is okay because RLS protects the database.
