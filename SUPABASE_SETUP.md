## Supabase setup for Mila Bee Studios (CMS + store)

1. Create a Supabase project.
2. In Authentication -> Providers, enable Email.
3. Copy your project URL and anon key into:
   - assets/js/supabase-config.js
4. In Storage, create two public buckets:
   - `site-images`
   - `product-images`

## SQL schema

Run this in the Supabase SQL editor:

```sql
-- Profiles + admin check
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their profile"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- Site content
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  content_key text not null,
  content_value text not null,
  content_type text not null default 'text',
  updated_at timestamptz not null default now()
);

create unique index if not exists site_content_page_key_idx
  on public.site_content (page, content_key);

alter table public.site_content enable row level security;

create policy "Public can read site content"
  on public.site_content for select
  using (true);

create policy "Admins can manage site content"
  on public.site_content for all
  using (public.is_admin())
  with check (public.is_admin());

-- Products (store inventory)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  categories text[] not null default '{}',
  inventory_count integer not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can read active products"
  on public.products for select
  using (is_active = true);

create policy "Admins can manage products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Cart + orders (drop/recreate if you used the older schema)
drop table if exists public.cart_items;
drop table if exists public.orders;

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create unique index cart_items_user_product_idx
  on public.cart_items (user_id, product_id);

alter table public.cart_items enable row level security;

create policy "Users can view their cart"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their cart"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their cart"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their cart"
  on public.cart_items for delete
  using (auth.uid() = user_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total numeric(10, 2) not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their orders"
  on public.orders for insert
  with check (auth.uid() = user_id);
```

## Storage policies

Run this in the SQL editor to allow public read + admin uploads:

```sql
create policy "Public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "Admins manage site images"
  on storage.objects for all
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins manage product images"
  on storage.objects for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
```

## Admin access

After creating the admin user in Supabase Auth, run:

```sql
update public.profiles
set is_admin = true
where email in ('YOUR_ADMIN_EMAIL@example.com');
```

## Notes

- Admin dashboard: `admin.html`.
- Content manager reads defaults from the HTML files and saves updates into `site_content`.
- Store products come from the `products` table. Product images are uploaded to `product-images`.
- Do not use your service role key in the browser.
