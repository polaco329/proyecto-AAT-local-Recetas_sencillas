grant delete on public.community_recipes to authenticated;

create policy "Users can delete their own recipes"
  on public.community_recipes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create function public.delete_community_recipe_comments()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.recipe_comments
  where recipe_id = old.id::text;

  return old;
end;
$$;

create trigger delete_community_recipe_comments
  before delete on public.community_recipes
  for each row
  execute function public.delete_community_recipe_comments();
