-- FEMALE EMX PATCH: comment auth, delete ownership, video cleanup, dark theme support
-- Safe to run multiple times.

-- Allow the public/admin site to save "dark" background mode too.
alter table public.site_settings drop constraint if exists site_settings_background_mode_check;

alter table public.site_settings add constraint site_settings_background_mode_check
check (background_mode in ('neon', 'pink', 'royal', 'green', 'lowlag', 'dark'));

-- Clear TikTok page links from Clip Video URL.
-- The video modal needs a direct Supabase MP4/WebM/MOV file URL, not a TikTok page URL.
update public.site_settings
set
  clip_video_url = '',
  updated_at = now()
where id = 'main'
and (
  clip_video_url ilike '%tiktok.com%'
  or clip_video_url ilike '%tiktok.com/t/%'
);

-- Make sure fan_wall has owner/auth columns needed for "delete my own comment".
alter table public.fan_wall
add column if not exists owner_id uuid;

alter table public.fan_wall
alter column owner_id set default auth.uid();

alter table public.fan_wall
add column if not exists reports integer not null default 0;

alter table public.fan_wall
add column if not exists hidden boolean not null default false;

alter table public.fan_wall enable row level security;

-- Clean old policy names from previous versions.
drop policy if exists "Anyone can read fan wall" on public.fan_wall;
drop policy if exists "Anyone can post fan wall" on public.fan_wall;
drop policy if exists "Anyone can react to fan wall" on public.fan_wall;
drop policy if exists "Authenticated users can post comments" on public.fan_wall;
drop policy if exists "Anyone can react/report comments" on public.fan_wall;
drop policy if exists "Anyone can read visible comments" on public.fan_wall;
drop policy if exists "Admins can read all comments" on public.fan_wall;
drop policy if exists "Signed in visitors can post comments" on public.fan_wall;
drop policy if exists "Signed in visitors can react or report" on public.fan_wall;
drop policy if exists "Users can delete their own comments" on public.fan_wall;
drop policy if exists "Admins can update comment moderation" on public.fan_wall;
drop policy if exists "Admins can delete any comment" on public.fan_wall;

-- Public visitors can only read visible, non-reported comments.
create policy "Anyone can read visible comments"
on public.fan_wall
for select
to anon, authenticated
using (hidden = false and reports < 3);

-- Admins can read every comment, including hidden/reported.
create policy "Admins can read all comments"
on public.fan_wall
for select
to authenticated
using (public.is_admin());

-- Anonymous signed-in visitors can post comments.
create policy "Signed in visitors can post comments"
on public.fan_wall
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and char_length(username) between 2 and 24
  and char_length(message) between 1 and 140
  and vibe in ('💜', '💚', '⚡', '🎮', '🔥', '👑', '🦋', '🌸')
  and topic in ('shoutout', 'map', 'clip', 'question', 'duo', 'wmoment')
  and theme in ('neon', 'royal', 'tryhard', 'cozy', 'pink')
  and hidden = false
  and reports >= 0
);

-- Visitors can react/report visible comments.
create policy "Signed in visitors can react or report"
on public.fan_wall
for update
to authenticated
using (hidden = false)
with check (
  hidden = false
  and hearts >= 0
  and bolts >= 0
  and fires >= 0
  and crowns >= 0
  and wins >= 0
  and controllers >= 0
  and reports >= 0
);

-- Visitors can delete only comments from their own anonymous session/device.
create policy "Users can delete their own comments"
on public.fan_wall
for delete
to authenticated
using (owner_id = auth.uid());

-- Admins can hide/unhide/reset reports.
create policy "Admins can update comment moderation"
on public.fan_wall
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admins can delete any comment.
create policy "Admins can delete any comment"
on public.fan_wall
for delete
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;

grant select on public.fan_wall to anon, authenticated;
grant insert on public.fan_wall to authenticated;

revoke update on public.fan_wall from anon, authenticated;
grant update (hearts, bolts, fires, crowns, wins, controllers, reports, hidden)
on public.fan_wall
to authenticated;

grant delete on public.fan_wall to authenticated;