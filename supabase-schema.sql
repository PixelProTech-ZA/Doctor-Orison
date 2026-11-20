-- Doctor Orison: Supabase schema. Run once in the Supabase SQL editor (Project > SQL).
-- Creates: profiles (roles), orison_user_state (synced personal data), content_records (editorial CMS),
-- row-level security, editorial triggers, and delete_my_account().

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','editor','reviewer','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.orison_role() returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'user')
$$;

-- Personal data: one JSON document per user.
create table if not exists public.orison_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Editorial content.
create table if not exists public.content_records (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('ingredient','prayer','lesson','practice','cultural','commentary','bible_meta','photo','audio','safety')),
  title text not null,
  category text,
  source text check (source in ('BIB','AFR','WLD','HIS','SCI')),
  description text,
  evidence text,
  refs jsonb not null default '[]'::jsonb,
  image_url text,
  audio_url text,
  safety text,
  status text not null default 'draft' check (status in ('draft','in_review','published')),
  last_reviewed date,
  created_by uuid references auth.users(id) on delete set null,
  reviewer_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_records_status on public.content_records(status, type);

-- Editorial rules enforced in the database, not only in the browser.
create or replace function public.content_rules() returns trigger
language plpgsql security definer set search_path = public as $$
declare r text := public.orison_role();
begin
  if new.status in ('in_review','published') then
    if new.type in ('ingredient','safety','practice') and jsonb_array_length(coalesce(new.refs,'[]'::jsonb)) = 0 then
      raise exception 'Botanical, safety and practice records need at least one qualified reference before review.';
    end if;
    if new.type = 'ingredient' and coalesce(new.safety,'') = '' then
      raise exception 'Ingredient records need a safety statement before review.';
    end if;
    if coalesce(new.description,'') = '' then raise exception 'A description is required.'; end if;
  end if;
  if new.status = 'published' then
    if r not in ('reviewer','admin') then raise exception 'Only reviewers and admins can publish.'; end if;
    if new.created_by is not null and new.created_by = auth.uid() and r <> 'admin' then raise exception 'Authors cannot publish their own records.'; end if;
    if new.last_reviewed is null then raise exception 'A last-reviewed date is required to publish.'; end if;
    new.reviewer_id := auth.uid();
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists content_rules_trg on public.content_records;
create trigger content_rules_trg before insert or update on public.content_records for each row execute function public.content_rules();

-- Row-level security.
alter table public.profiles enable row level security;
alter table public.orison_user_state enable row level security;
alter table public.content_records enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.orison_role() = 'admin');
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles for update using (public.orison_role() = 'admin') with check (public.orison_role() = 'admin');

drop policy if exists "state own" on public.orison_user_state;
create policy "state own" on public.orison_user_state for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "records read" on public.content_records;
create policy "records read" on public.content_records for select
  using (status = 'published' or public.orison_role() in ('editor','reviewer','admin'));
drop policy if exists "records insert" on public.content_records;
create policy "records insert" on public.content_records for insert
  with check (public.orison_role() in ('editor','reviewer','admin') and created_by = auth.uid());
drop policy if exists "records update" on public.content_records;
create policy "records update" on public.content_records for update
  using ((created_by = auth.uid() and status in ('draft','in_review') and public.orison_role() in ('editor','reviewer','admin')) or public.orison_role() in ('reviewer','admin'))
  with check (public.orison_role() in ('editor','reviewer','admin'));
drop policy if exists "records delete" on public.content_records;
create policy "records delete" on public.content_records for delete
  using (public.orison_role() = 'admin' or (created_by = auth.uid() and status = 'draft'));

-- Account deletion: a signed-in user deletes their own account and all rows cascade.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- To make someone an editor/reviewer/admin (run as the project owner):
--   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
