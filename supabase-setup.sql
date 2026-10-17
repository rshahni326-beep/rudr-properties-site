-- RUDR PROPERTIES: secure starter policies for the existing public.properties table
-- Run this in Supabase SQL Editor as project owner.
-- The admin email is rshahni326@gmail.com. Create that user first under Authentication > Users.
-- Do NOT use a service_role/secret key in website files.

alter table public.properties enable row level security;

-- Public can read active/available listings. If you already have a broad SELECT policy,
-- it may also allow reading other rows; review existing policies before production launch.
drop policy if exists "rudr_public_read_available" on public.properties;
create policy "rudr_public_read_available"
on public.properties for select
to anon, authenticated
using (lower(coalesce(status, 'available')) in ('available', 'active', 'for sale', 'for rent'));

-- Only the configured admin email can create, update, or delete property rows.
drop policy if exists "rudr_admin_insert_properties" on public.properties;
create policy "rudr_admin_insert_properties"
on public.properties for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'rshahni326@gmail.com');

drop policy if exists "rudr_admin_update_properties" on public.properties;
create policy "rudr_admin_update_properties"
on public.properties for update
to authenticated
using ((auth.jwt() ->> 'email') = 'rshahni326@gmail.com')
with check ((auth.jwt() ->> 'email') = 'rshahni326@gmail.com');

drop policy if exists "rudr_admin_delete_properties" on public.properties;
create policy "rudr_admin_delete_properties"
on public.properties for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'rshahni326@gmail.com');

-- NOTE: Supabase combines permissive policies with OR.
-- If an older SELECT policy "Public can view properties" uses USING (true), public reads
-- remain allowed for every row. That is read-only, but change it if sold/private rows
-- must not be public. Never create public INSERT/UPDATE/DELETE policies.

-- Existing schema expected by this website:
-- id, created_at, title, location, price, property_type, area, description,
-- image_urls, video_url, status
-- The current site stores image_urls as a text URL. If your column type differs, adjust accordingly.
