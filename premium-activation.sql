-- Run this ONLY when you're ready to switch payments ON.
-- (It's separate from supabase-schema.sql so your free app is untouched
-- until you decide to activate it.)

-- 1. is_premium columns already exist from supabase-schema.sql (default false)
--    so nothing to add here — they've just been unused until now.

-- 2. Users update their own is_premium is NOT allowed directly (only the
--    webhook, using the service role key, can flip this) — no extra policy
--    needed since there's no "update" policy granted to regular users.

-- 3. Tighten storage access so premium files are only downloadable by
--    premium users / admins. Replace the old "read all" policy with this
--    smarter one.
drop policy if exists "authenticated users can read materials files" on storage.objects;

create policy "read materials files respecting premium flag"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'materials'
    and (
      exists (
        select 1 from materials m
        where m.file_path = storage.objects.name
        and m.is_premium = false
      )
      or exists (
        select 1 from profiles p
        where p.id = auth.uid()
        and (p.is_admin = true or p.is_premium = true)
      )
    )
  );

-- After this, remember to also set on Vercel + .env.local:
--   NEXT_PUBLIC_PAYMENTS_ENABLED=true
--   RAZORPAY_KEY_ID=...
--   RAZORPAY_KEY_SECRET=...
--   RAZORPAY_WEBHOOK_SECRET=...
--   SUPABASE_SERVICE_ROLE_KEY=...  (Settings -> API -> service_role, keep secret!)
