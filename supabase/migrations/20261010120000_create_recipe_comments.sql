create table public.recipe_comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null check (char_length(trim(recipe_id)) between 1 and 100),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recipe_comments_recipe_created_at_idx
  on public.recipe_comments (recipe_id, created_at desc);

alter table public.recipe_comments enable row level security;

revoke all on public.recipe_comments from public, anon, authenticated;
grant select, delete on public.recipe_comments to authenticated;
grant insert (recipe_id, body) on public.recipe_comments to authenticated;
grant update (body) on public.recipe_comments to authenticated;

create policy "Authenticated users can read recipe comments"
  on public.recipe_comments
  for select
  to authenticated
  using (true);

create policy "Users can add comments as themselves"
  on public.recipe_comments
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can edit their own comments"
  on public.recipe_comments
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own comments"
  on public.recipe_comments
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create function public.set_recipe_comment_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.user_id is distinct from (select auth.uid()) then
    raise exception 'Comment author must match the authenticated user';
  end if;

  select coalesce(
    nullif(trim(p.display_name), ''),
    nullif(split_part(u.email, '@', 1), ''),
    'Usuario'
  )
  into new.author_name
  from auth.users as u
  left join public.profiles as p on p.id = u.id
  where u.id = new.user_id;

  if new.author_name is null then
    raise exception 'Could not determine the comment author';
  end if;

  return new;
end;
$$;

create trigger set_recipe_comment_author
  before insert on public.recipe_comments
  for each row
  execute function public.set_recipe_comment_author();

create function public.set_recipe_comment_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_recipe_comment_updated_at
  before update on public.recipe_comments
  for each row
  execute function public.set_recipe_comment_updated_at();
