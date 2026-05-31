create extension if not exists pgcrypto;

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
drop policy if exists "Anyone can read fan wall" on public.fan_wall;
drop policy if exists "Anyone can post fan wall" on public.fan_wall;
drop policy if exists "Signed in visitors can post comments" on public.fan_wall;
drop policy if exists "Anyone can react to fan wall" on public.fan_wall;
drop policy if exists "Signed in visitors can react or report" on public.fan_wall;
drop policy if exists "Users can delete their own comments" on public.fan_wall;

create policy "Anyone can read visible comments"
on public.fan_wall
for select
to anon, authenticated
using (hidden = false and reports < 3);

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

grant usage on schema public to anon, authenticated;
grant select on public.fan_wall to anon, authenticated;
grant insert on public.fan_wall to authenticated;

revoke update on public.fan_wall from anon, authenticated;
grant update (hearts, bolts, fires, crowns, wins, controllers, reports) on public.fan_wall to authenticated;

grant delete on public.fan_wall to authenticated;
