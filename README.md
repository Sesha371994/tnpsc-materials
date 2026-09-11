# TET & TNPSC Study Hall

Admin oruvar mattum PDF / Word / Image files upload panna, logged-in users
category-wise browse panni download panna oru web app.

Built with **Next.js 14** + **Supabase** (auth + database + storage), deploy
pannradhu **Vercel** la.

---

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` file open panni Supabase keys fill pannunga (Step 2 la eppadi
edukanum nu irukku).

```bash
npm run dev
```

`http://localhost:3000` la app open aagum.

---

## 2. Supabase setup (database + storage + auth)

1. https://supabase.com la account create pannunga (GitHub login um irukku).
2. **New project** create pannunga. Password onnu set pannunga (idhu database
   password, app password illa — nyabagam vechukanum).
3. Project open aana, idhu 3 edukanum:
   - **Settings → API → Project URL** → `.env.local` la `NEXT_PUBLIC_SUPABASE_URL`
   - **Settings → API → anon public key** → `.env.local` la `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Authentication → Providers → Email** open panni, **"Confirm email"**
   OFF pannunga. (Idhu illana, signup pannana odane login aagathu, email
   confirm pannanum — namma app username/password mattum use panradhala
   idha off pannanum.)
5. **Storage → New bucket** → name: `materials` → **Private** bucket ah
   create pannunga.
6. **SQL Editor → New query** open panni, indha project la irukura
   `supabase-schema.sql` file full-a copy panni paste panni **Run** pannunga.
   Idhu categories, tables, security rules ellame setup pannidum.
7. App la neenga first account signup panniyadhukku apparam, Supabase
   **SQL Editor** ku vandhu idha run pannunga (unga username podunga):

   ```sql
   update profiles set is_admin = true where username = 'your_username_here';
   ```

   Idhu than unga account ah **admin** ah maathum — admin mattum tha upload
   panna mudiyum.

---

## 3. GitHub la upload pannradhu

```bash
git init
git add .
git commit -m "Initial commit - TET TNPSC study hall"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(GitHub la puthu repo create pannitu, adhoda URL mela `<your-username>/<repo-name>`
ku pathila potukonga.)

**Important:** `.env.local` file GitHub ku poagathu (`.gitignore` la already
add panniten) — keys safe ah irukum.

---

## 4. Vercel la deploy pannradhu

1. https://vercel.com la GitHub account oda login pannunga.
2. **Add New → Project** → unga GitHub repo select pannunga → **Import**.
3. **Environment Variables** section la idha rendayum add pannunga:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Same values `.env.local` la irukurathu tha)
4. **Deploy** click pannunga. 2-3 minutes la unga app live aagidum, oru
   `.vercel.app` link kedaikum.

Apparam edha maathinalum (`git push`), Vercel automatic ah redeploy pannidum.

---

## App flow

- `/signup` — username + password vechu account create pannalam
- `/login` — login pannalam
- `/` — category-wise files, download button
- `/admin` — admin mattum access, file upload panel (title + category + file)

## Payments (Razorpay) — built-in but OFF by default

The app already has a free/premium tier wired in (UPI, cards, netbanking via
Razorpay), but it stays completely inactive until you turn it on. Right now
`NEXT_PUBLIC_PAYMENTS_ENABLED=false`, so nobody sees any payment UI and every
file is free — same as before.

**When you're ready to go live:**

1. Create a Razorpay account (razorpay.com), complete KYC (PAN + bank
   account). Takes 1-2 days to approve.
2. Dashboard → **Settings → API Keys** → generate → copy `Key Id` and
   `Key Secret`.
3. Dashboard → **Settings → Webhooks** → add webhook:
   - URL: `https://your-app.vercel.app/api/razorpay/webhook`
   - Active event: `payment.captured`
   - Copy the **Webhook Secret** shown there.
4. In Supabase: **Settings → API → service_role key** → copy it (keep this
   one secret — it bypasses all security rules, never put it in a public
   file or the browser code).
5. Run `premium-activation.sql` in Supabase SQL Editor (tightens file
   downloads so only paid/admin users get premium files).
6. Set these in Vercel (**Project → Settings → Environment Variables**) and
   your local `.env.local`:
   ```
   NEXT_PUBLIC_PAYMENTS_ENABLED=true
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
7. Redeploy. Now the admin upload form has a "Premium file" checkbox, and
   an "Upgrade to Premium" button with UPI/card checkout appears for
   non-premium users.

Price is set by `NEXT_PUBLIC_PREMIUM_PRICE_PAISE` (in paise — `19900` = ₹199).

## Notes

- File types allowed: PDF, Word (`.doc`/`.docx`), Image (`.png/.jpg/.jpeg/.webp`)
- Download links 60 seconds mattum valid — security ku (private bucket).
- Category list venumna edit pannanum na `supabase-schema.sql` la
  `categories` table insert statement maathunga, illa Supabase dashboard
  la direct-a row add pannalam.
