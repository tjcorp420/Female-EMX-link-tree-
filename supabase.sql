-- Female EMX public comments + admin control panel setup
-- Run this in Supabase SQL Editor.
-- After it succeeds, add your admin email near the bottom where shown.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Admins can read admin users" on public.admin_users;
drop policy if exists "Users can check their own admin record" on public.admin_users;

create policy "Users can check their own admin record"
on public.admin_users
for select
to authenticated
using (
  public.is_admin()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  brand_name text not null default 'Female EMX',
  creator_code text not null default 'MEDUSAA',
  tiktok_url text not null default 'https://www.tiktok.com/@ttfemale_emx',
  emx_tweaks_url text not null default 'https://efect-macros-x-tweaks.vercel.app/',
  fortnite_maps_url text not null default 'https://fortnite.gg/creator/medusaa',
  status_badge text not null default 'Official Creator Hub',
  tagline text not null default 'TikTok clips, Fortnite maps, creator code, EMX links, and neon gamer energy in one place.',
  pinned_message text not null default 'Use creator code <strong>MEDUSAA</strong>, play the maps, and drop a comment below 💜⚡',
  background_mode text not null default 'neon',
  primary_color text not null default '#c026ff',
  secondary_color text not null default '#62ff2e',
  comments_enabled boolean not null default true,
  reactions_enabled boolean not null default true,
  featured_clip_url text not null default '',
  question_of_week text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings
add column if not exists brand_name text not null default 'Female EMX';
alter table public.site_settings
add column if not exists creator_code text not null default 'MEDUSAA';
alter table public.site_settings
add column if not exists tiktok_url text not null default 'https://www.tiktok.com/@ttfemale_emx';
alter table public.site_settings
add column if not exists emx_tweaks_url text not null default 'https://efect-macros-x-tweaks.vercel.app/';
alter table public.site_settings
add column if not exists fortnite_maps_url text not null default 'https://fortnite.gg/creator/medusaa';
alter table public.site_settings
add column if not exists status_badge text not null default 'Official Creator Hub';
alter table public.site_settings
add column if not exists tagline text not null default 'TikTok clips, Fortnite maps, creator code, EMX links, and neon gamer energy in one place.';
alter table public.site_settings
add column if not exists pinned_message text not null default 'Use creator code <strong>MEDUSAA</strong>, play the maps, and drop a comment below 💜⚡';
alter table public.site_settings
add column if not exists background_mode text not null default 'neon';
alter table public.site_settings
add column if not exists primary_color text not null default '#c026ff';
alter table public.site_settings
add column if not exists secondary_color text not null default '#62ff2e';
alter table public.site_settings
add column if not exists comments_enabled boolean not null default true;
alter table public.site_settings
add column if not exists reactions_enabled boolean not null default true;
alter table public.site_settings
add column if not exists featured_clip_url text not null default '';
alter table public.site_settings
add column if not exists question_of_week text not null default '';
alter table public.site_settings
add column if not exists updated_at timestamptz not null default now();

alter table public.site_settings drop constraint if exists site_settings_background_mode_check;
alter table public.site_settings add constraint site_settings_background_mode_check
check (background_mode in ('neon', 'pink', 'royal', 'green', 'lowlag'));

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read site settings" on public.site_settings;
drop policy if exists "Admins can update site settings" on public.site_settings;
drop policy if exists "Admins can insert site settings" on public.site_settings;

create policy "Anyone can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "Admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

create table if not exists public.fan_wall (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid(),
  username text not null check (char_length(username) between 2 and 24),
  message text not null check (char_length(message) between 1 and 140),
  vibe text not null default '💜',
  topic text not null default 'shoutout',
  theme text not null default 'neon',
  hearts integer not null default 0,
  bolts integer not null default 0,
  fires integer not null default 0,
  crowns integer not null default 0,
  wins integer not null default 0,
  controllers integer not null default 0,
  reports integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.fan_wall add column if not exists owner_id uuid default auth.uid();
alter table public.fan_wall add column if not exists vibe text not null default '💜';
alter table public.fan_wall add column if not exists topic text not null default 'shoutout';
alter table public.fan_wall add column if not exists theme text not null default 'neon';
alter table public.fan_wall add column if not exists hearts integer not null default 0;
alter table public.fan_wall add column if not exists bolts integer not null default 0;
alter table public.fan_wall add column if not exists fires integer not null default 0;
alter table public.fan_wall add column if not exists crowns integer not null default 0;
alter table public.fan_wall add column if not exists wins integer not null default 0;
alter table public.fan_wall add column if not exists controllers integer not null default 0;
alter table public.fan_wall add column if not exists reports integer not null default 0;
alter table public.fan_wall add column if not exists hidden boolean not null default false;
alter table public.fan_wall alter column owner_id set default auth.uid();

alter table public.fan_wall drop constraint if exists fan_wall_vibe_check;
alter table public.fan_wall add constraint fan_wall_vibe_check
check (vibe in ('💜', '💚', '⚡', '🎮', '🔥', '👑', '🦋', '🌸'));

alter table public.fan_wall drop constraint if exists fan_wall_topic_check;
alter table public.fan_wall add constraint fan_wall_topic_check
check (topic in ('shoutout', 'map', 'clip', 'question', 'duo', 'wmoment'));

alter table public.fan_wall drop constraint if exists fan_wall_theme_check;
alter table public.fan_wall add constraint fan_wall_theme_check
check (theme in ('neon', 'royal', 'tryhard', 'cozy', 'pink'));

alter table public.fan_wall enable row level security;

drop policy if exists "Anyone can read visible comments" on public.fan_wall;
drop policy if exists "Admins can read all comments" on public.fan_wall;
drop policy if exists "Signed in visitors can post comments" on public.fan_wall;
drop policy if exists "Signed in visitors can react or report" on public.fan_wall;
drop policy if exists "Users can delete their own comments" on public.fan_wall;
drop policy if exists "Admins can update comment moderation" on public.fan_wall;
drop policy if exists "Admins can delete any comment" on public.fan_wall;

create policy "Anyone can read visible comments"
on public.fan_wall
for select
to anon, authenticated
using (hidden = false and reports < 3);

create policy "Admins can read all comments"
on public.fan_wall
for select
to authenticated
using (public.is_admin());

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

create policy "Users can delete their own comments"
on public.fan_wall
for delete
to authenticated
using (owner_id = auth.uid());

create policy "Admins can update comment moderation"
on public.fan_wall
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete any comment"
on public.fan_wall
for delete
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
grant select on public.admin_users to authenticated;

grant select on public.fan_wall to anon, authenticated;
grant insert on public.fan_wall to authenticated;
revoke update on public.fan_wall from anon, authenticated;
grant update (hearts, bolts, fires, crowns, wins, controllers, reports, hidden) on public.fan_wall to authenticated;
grant delete on public.fan_wall to authenticated;

-- IMPORTANT: Replace YOUR_ADMIN_EMAIL_HERE with your email, then run this one line too.
-- Example: insert into public.admin_users (email) values ('yourname@gmail.com') on conflict (email) do nothing;
-- insert into public.admin_users (email) values ('YOUR_ADMIN_EMAIL_HERE') on conflict (email) do nothing;
