create table if not exists public.fan_wall (
  id uuid primary key default gen_random_uuid(),
  username text not null check (char_length(username) between 2 and 24),
  message text not null check (char_length(message) between 1 and 140),
  vibe text not null default '💜',
  topic text not null default 'shoutout',
  hearts integer not null default 0,
  bolts integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.fan_wall
add column if not exists vibe text not null default '💜';

alter table public.fan_wall
add column if not exists topic text not null default 'shoutout';

alter table public.fan_wall
add column if not exists hearts integer not null default 0;

alter table public.fan_wall
add column if not exists bolts integer not null default 0;

alter table public.fan_wall
drop constraint if exists fan_wall_vibe_check;

alter table public.fan_wall
add constraint fan_wall_vibe_check
check (vibe in ('💜', '💚', '⚡', '🎮', '🔥', '👑'));

alter table public.fan_wall
drop constraint if exists fan_wall_topic_check;

alter table public.fan_wall
add constraint fan_wall_topic_check
check (topic in ('shoutout', 'map', 'clip', 'question'));

alter table public.fan_wall enable row level security;

drop policy if exists "Anyone can read fan wall" on public.fan_wall;
drop policy if exists "Anyone can post fan wall" on public.fan_wall;
drop policy if exists "Anyone can react to fan wall" on public.fan_wall;

create policy "Anyone can read fan wall"
on public.fan_wall
for select
using (true);

create policy "Anyone can post fan wall"
on public.fan_wall
for insert
with check (
  char_length(username) between 2 and 24
  and char_length(message) between 1 and 140
  and vibe in ('💜', '💚', '⚡', '🎮', '🔥', '👑')
  and topic in ('shoutout', 'map', 'clip', 'question')
);

create policy "Anyone can react to fan wall"
on public.fan_wall
for update
using (true)
with check (
  hearts >= 0
  and bolts >= 0
  and hearts <= 99999
  and bolts <= 99999
);

grant usage on schema public to anon;
grant select, insert on public.fan_wall to anon;
revoke update on public.fan_wall from anon;
grant update (hearts, bolts) on public.fan_wall to anon;
