-- Run once in a NEW Supabase project's SQL editor.
-- The unique singleton column permits one approved administrator.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  singleton boolean not null default true unique check (singleton),
  created_at timestamptz not null default now()
);
create table if not exists public.portfolio_content (
  id text primary key check (id = 'main'),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_public (
  id text primary key check (id = 'main'),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
alter table public.portfolio_content enable row level security;
alter table public.portfolio_public enable row level security;

create policy "Admin reads own membership" on public.admin_users
for select to authenticated using (user_id = (select auth.uid()));
create policy "Admin reads all content" on public.portfolio_content
for select to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admin inserts content" on public.portfolio_content
for insert to authenticated with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admin updates content" on public.portfolio_content
for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Visitors read published content" on public.portfolio_public
for select to anon, authenticated using (true);

grant select on public.admin_users to authenticated;
grant select, insert, update on public.portfolio_content to authenticated;
revoke all on public.portfolio_content from anon;
grant select on public.portfolio_public to anon, authenticated;
revoke insert, update, delete on public.portfolio_public from anon, authenticated;

-- Only this trigger can write the public snapshot. Drafts never enter it.
create or replace function public.publish_portfolio_snapshot()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  snapshot jsonb := new.data;
  collection text;
  visible jsonb;
begin
  foreach collection in array array['projects','papers','certificates','events','education','experience','updates'] loop
    select coalesce(jsonb_agg(entry order by position), '[]'::jsonb) into visible
    from jsonb_array_elements(coalesce(snapshot -> collection, '[]'::jsonb)) with ordinality as entries(entry, position)
    where entry -> 'published' = 'true'::jsonb and length(trim(coalesce(entry ->> 'title', ''))) > 0;
    snapshot := jsonb_set(snapshot, array[collection], visible);
  end loop;
  if coalesce(snapshot #>> '{club,enabled}', 'false') <> 'true' then
    snapshot := jsonb_set(snapshot, '{club}', '{"enabled":false,"name":"","role":"","summary":"","description":"","media":[],"links":[]}'::jsonb);
  end if;
  insert into public.portfolio_public(id, data, updated_at)
  values (new.id, snapshot, now())
  on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
  return new;
end;
$$;
revoke all on function public.publish_portfolio_snapshot() from public, anon, authenticated;
create trigger publish_portfolio_snapshot after insert or update on public.portfolio_content
for each row execute function public.publish_portfolio_snapshot();

-- Uploads are PUBLIC assets. Only the approved administrator can manage them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 52428800,
array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','application/pdf']);
create policy "Visitors view media" on storage.objects
for select to anon, authenticated using (bucket_id = 'portfolio-media');
create policy "Admin uploads media" on storage.objects
for insert to authenticated with check (bucket_id = 'portfolio-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admin updates media" on storage.objects
for update to authenticated
using (bucket_id = 'portfolio-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (bucket_id = 'portfolio-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admin deletes media" on storage.objects
for delete to authenticated using (bucket_id = 'portfolio-media' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

-- Create your email/password user in Authentication, then run:
-- insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
