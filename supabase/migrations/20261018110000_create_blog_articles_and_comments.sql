create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 5 and 150),
  subtitle text not null check (char_length(trim(subtitle)) between 5 and 200),
  category text not null check (char_length(trim(category)) between 2 and 50),
  author_name text not null,
  content text[] not null check (cardinality(content) between 1 and 30),
  tip text not null check (char_length(trim(tip)) between 3 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_created_at_idx on public.blog_posts (created_at desc);

alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from public, anon, authenticated;
grant select on public.blog_posts to authenticated;
grant insert (title, subtitle, category, content, tip) on public.blog_posts to authenticated;
grant update (title, subtitle, category, content, tip) on public.blog_posts to authenticated;
grant delete on public.blog_posts to authenticated;

create policy "Authenticated users can read blog posts"
  on public.blog_posts for select to authenticated using (true);

create policy "Admin can create blog posts"
  on public.blog_posts for insert to authenticated
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com');

create policy "Admin can update blog posts"
  on public.blog_posts for update to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com');

create policy "Admin can delete blog posts"
  on public.blog_posts for delete to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com');

create function public.set_blog_post_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null then
    select coalesce(
      nullif(trim(p.display_name), ''),
      nullif(split_part(u.email, '@', 1), ''),
      'Usuario'
    )
    into new.author_name
    from auth.users as u
    left join public.profiles as p on p.id = u.id
    where u.id = (select auth.uid());
  end if;

  if new.author_name is null then
    raise exception 'Could not determine the blog author';
  end if;

  return new;
end;
$$;

create trigger set_blog_post_author
  before insert on public.blog_posts
  for each row execute function public.set_blog_post_author();

create function public.set_blog_post_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_blog_post_updated_at
  before update on public.blog_posts
  for each row execute function public.set_blog_post_updated_at();

create table public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_comments_post_created_at_idx
  on public.blog_comments (post_id, created_at desc);

alter table public.blog_comments enable row level security;
revoke all on public.blog_comments from public, anon, authenticated;
grant select, delete on public.blog_comments to authenticated;
grant insert (post_id, body) on public.blog_comments to authenticated;
grant update (body) on public.blog_comments to authenticated;

create policy "Authenticated users can read blog comments"
  on public.blog_comments for select to authenticated using (true);

create policy "Users can add their own blog comments"
  on public.blog_comments for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can edit their own blog comments"
  on public.blog_comments for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own blog comments"
  on public.blog_comments for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Admin can moderate blog comments"
  on public.blog_comments for delete to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'fsfiligoyborkoski@gmail.com');

create function public.set_blog_comment_author()
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
    raise exception 'Could not determine the blog comment author';
  end if;

  return new;
end;
$$;

create trigger set_blog_comment_author
  before insert on public.blog_comments
  for each row execute function public.set_blog_comment_author();

create function public.set_blog_comment_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_blog_comment_updated_at
  before update on public.blog_comments
  for each row execute function public.set_blog_comment_updated_at();

insert into public.blog_posts (title, subtitle, category, author_name, content, tip, created_at)
values
  (
    '5 Errores Comunes al Cocinar Pasta',
    'Evita estos errores y logra la pasta perfecta cada vez',
    'Técnicas',
    'Francisco S. Sfiligoy Borkoski',
    array[
      'La pasta es uno de los platillos más populares del mundo, pero también uno de los más maltratados en la cocina casera. Muchas personas cometen errores básicos que afectan significativamente el resultado final.',
      'El primer gran error es no salar suficientemente el agua. El agua debe estar "salada como el mar": esto no es exageración. La pasta absorbe sabor principalmente durante la cocción, y si el agua no tiene sal, la pasta será insípida por dentro sin importar qué salsa uses.',
      'El segundo error es enjuagar la pasta después de colarla. Al hacer esto eliminas el almidón superficial que ayuda a que la salsa se adhiera mejor. La única excepción es cuando vas a usar la pasta en ensaladas frías.',
      'El tercer error es romper los espaguetis antes de cocinarlos. Los espaguetis están diseñados para ser comidos enrollados en el tenedor: su longitud es parte de la experiencia.'
    ],
    'Guarda siempre una taza del agua de cocción de la pasta. Esta agua almidonada es oro líquido para ajustar la consistencia de tu salsa.',
    '2025-06-10T12:00:00Z'
  ),
  (
    'Cómo Planificar Comidas para Toda la Semana',
    'Ahorra tiempo y dinero con una buena planificación semanal',
    'Organización',
    'Francisco S. Sfiligoy Borkoski',
    array[
      'Planificar las comidas de la semana con anticipación es uno de los hábitos más transformadores que puedes adoptar en tu vida culinaria. No solo ahorras tiempo y dinero, sino que también reduces el estrés de la pregunta diaria: "¿Qué cocinamos hoy?"',
      'El proceso comienza los domingos. Dedica 20 minutos a revisar qué tienes en la nevera y despensa, luego decide el menú de lunes a viernes. Los fines de semana suelen ser más flexibles, así que puedes improvisar.',
      'Un truco poderoso es cocinar en lotes (batch cooking). Por ejemplo, puedes cocer una olla grande de arroz el domingo que sirva para varios días. También puedes dejar marinadas las carnes, cortar vegetales y preparar bases de salsas que uses durante la semana.',
      'La clave del éxito es la variedad. Asegúrate de incluir diferentes proteínas (legumbres, carnes, huevos, pescado), variedad de vegetales y distintas técnicas de cocción para que las comidas no se vuelvan monótonas.'
    ],
    'Haz una lista de compras organizada por secciones del supermercado (lácteos, carnes, verduras, despensa). Ahorrarás tiempo y evitarás compras impulsivas.',
    '2025-06-05T12:00:00Z'
  ),
  (
    'Guía de Especias para Principiantes',
    'Las especias esenciales y cómo combinarlas correctamente',
    'Ingredientes',
    'Francisco S. Sfiligoy Borkoski',
    array[
      'Las especias son el alma de la cocina. Con los mismos ingredientes básicos, las especias pueden transformar un plato ordinario en algo extraordinario. Sin embargo, para muchos cocineros principiantes, el mundo de las especias puede resultar abrumador.',
      'Comienza con un botiquín básico de especias: sal, pimienta negra, comino, pimentón (dulce y ahumado), orégano, ajo en polvo, cúrcuma y canela. Con estas 8 especias puedes preparar una variedad enorme de platillos de distintas cocinas del mundo.',
      'El secreto para usar especias correctamente es tostarlas brevemente en una sartén seca antes de usarlas. Esto activa sus aceites esenciales y multiplica su sabor e intensidad. Hazlo a fuego medio y mueve constantemente para que no se quemen.',
      'Aprende las combinaciones clásicas: comino + cilantro + cúrcuma para cocina india; pimentón + orégano + ajo para cocina mediterránea; canela + comino + jengibre para cocina árabe. Estas combinaciones son tu punto de partida.'
    ],
    'Almacena las especias en frascos herméticos, alejadas del calor y la luz directa. Las especias molidas duran entre 1 y 3 años si se almacenan correctamente.',
    '2025-06-01T12:00:00Z'
  );
