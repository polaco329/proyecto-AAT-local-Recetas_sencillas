create table public.community_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null,
  name text not null check (char_length(trim(name)) between 3 and 100),
  category text not null check (category in ('Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda')),
  description text not null check (char_length(trim(description)) between 10 and 300),
  ingredients text[] not null check (cardinality(ingredients) between 2 and 30),
  steps text[] not null check (cardinality(steps) between 2 and 20),
  price integer not null check (price >= 0),
  prep_time text not null check (char_length(trim(prep_time)) between 1 and 50),
  servings integer not null check (servings between 1 and 100),
  image_url text,
  created_at timestamptz not null default now()
);

create index community_recipes_created_at_idx
  on public.community_recipes (created_at desc);

alter table public.community_recipes enable row level security;

revoke all on public.community_recipes from public, anon, authenticated;
grant select on public.community_recipes to authenticated;
grant insert (name, category, description, ingredients, steps, price, prep_time, servings)
  on public.community_recipes to authenticated;

create policy "Authenticated users can read community recipes"
  on public.community_recipes
  for select
  to authenticated
  using (true);

create policy "Users can publish their own recipes"
  on public.community_recipes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create function public.set_community_recipe_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.user_id is distinct from (select auth.uid()) then
    raise exception 'Recipe author must match the authenticated user';
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
    raise exception 'Could not determine the recipe author';
  end if;

  return new;
end;
$$;

create trigger set_community_recipe_author
  before insert on public.community_recipes
  for each row
  execute function public.set_community_recipe_author();
