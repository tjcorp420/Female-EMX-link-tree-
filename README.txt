FEMALE EMX ADMIN CONTROL UPGRADE

WHAT THIS ZIP ADDS
- Public Female EMX site stays at index.html
- New admin control panel at admin.html
- Same Supabase project controls both
- Admin can edit site colors/background mode, links, creator code, pinned message, comments on/off, reactions on/off
- Admin can view comments, filter reported/hidden, hide/unhide, reset reports, pin comment as message, and delete any comment
- Users can still delete only their own comments
- Report still hides comments from public after 3 reports

FILES TO UPLOAD TO GITHUB/VERCEL ROOT
index.html
styles.css
script.js
admin.html
admin.css
admin.js
manifest.json
sw.js
image.png
icon-192.png
icon-512.png
supabase.sql

SUPABASE SETUP
1. Supabase > Authentication > Providers > enable Email provider if needed.
2. Supabase > Authentication > Providers > Anonymous Sign-Ins should stay enabled.
3. Supabase > SQL Editor > New Query > paste and run supabase.sql.
4. Add your admin email by running this in SQL Editor:

insert into public.admin_users (email)
values ('YOUR_EMAIL_HERE')
on conflict (email) do nothing;

Replace YOUR_EMAIL_HERE with the email you will use to log into the admin page.

HOW TO USE ADMIN
Open:
https://YOUR-VERCEL-SITE.vercel.app/admin.html

Enter your admin email.
Tap Send Login Link.
Open the email from Supabase.
After login, you can control the public site.

VERCEL SETTINGS
Framework Preset: Other
Build Command: blank
Output Directory: blank
Root Directory: blank

TEST LINKS
Public site:
https://YOUR-VERCEL-SITE.vercel.app/?v=admin-control1

Admin panel:
https://YOUR-VERCEL-SITE.vercel.app/admin.html?v=admin-control1

IMPORTANT
Do not paste service_role keys into any website file.
The anon public key is okay because RLS policies protect the database.
