grant insert (name, category, description, ingredients, steps, price, prep_time, servings, image_url)
  on public.community_recipes to authenticated;
grant update (name, category, description, ingredients, steps, price, prep_time, servings, image_url)
  on public.community_recipes to authenticated;
grant delete on public.community_recipes to authenticated;

create policy "Admin can create community recipes"
  on public.community_recipes
  for insert
  to authenticated
  with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com'
  );

create policy "Admin can update community recipes"
  on public.community_recipes
  for update
  to authenticated
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com'
  )
  with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com'
  );

create policy "Admin can delete community recipes"
  on public.community_recipes
  for delete
  to authenticated
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com'
  );
