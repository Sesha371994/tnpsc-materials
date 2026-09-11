# TET & TNPSC Study Hall — Android app (Capacitor wrapper)

This turns your already-deployed web app into a real installable Android
app for the Play Store. It works by opening your **live Vercel URL** inside
a native app shell — so login, uploads, downloads, payments all keep
working exactly as they do on the web, no rebuild of app logic needed.

**You need on your computer (not possible in this chat):**
- Node.js installed
- [Android Studio](https://developer.android.com/studio) installed (free)
- Your app already deployed and working on Vercel (you have this)

---

## 1. Point it at your real site

Open `capacitor.config.ts` and replace the placeholder URL:

```ts
server: {
  url: 'https://your-app.vercel.app', // <-- put YOUR real Vercel URL here
  cleartext: false,
},
```

## 2. Install and add the Android platform

```bash
cd android-app
npm install
npx cap add android
npx cap sync android
```

This creates a full Android Studio project inside `android-app/android`.

## 3. Open in Android Studio

```bash
npx cap open android
```

Android Studio opens. Let it finish "Gradle sync" (first time takes a few
minutes, downloads things).

## 4. Add your app icon (optional but recommended)

In Android Studio: right-click `app/res` → **New → Image Asset** → pick your
logo image → it generates all icon sizes automatically.

## 5. Test on your phone

- Turn on **Developer options → USB debugging** on your Android phone
- Connect via USB → in Android Studio, click the green **Run ▶** button
- App installs and opens on your phone, loading your live site

## 6. Build a release APK/AAB (for Play Store)

In Android Studio: **Build → Generate Signed Bundle / APK**
- Choose **Android App Bundle (AAB)** — this is what Play Store wants
- Create a new **keystore** (a signing key) — SAVE THIS FILE AND PASSWORD
  safely, you need the exact same one for every future update, or you can
  never update your app again
- Build finishes → you get a `.aab` file

## 7. Publish on Google Play

1. Go to [play.google.com/console](https://play.google.com/console)
2. Pay the **one-time $25** registration fee
3. **Create app** → fill name, description, category (Education)
4. Upload your `.aab` file under **Production → Create release**
5. Add: app icon, 2-8 screenshots (screenshot your app running), a short
   **privacy policy page** (required — even a simple one-page site works;
   you can add a `/privacy` page to your Next.js app for this)
6. Submit for review — Google usually takes **1-3 days**

Once approved, it's live on the Play Store.

---

## Updating the app later

Since the app just loads your live Vercel URL, most changes (new features,
new files, bug fixes) **update automatically** — no need to rebuild or
resubmit to Play Store, because you're not shipping app logic, just the
shell. You only need to rebuild/resubmit if you change:
- The app icon or name
- `capacitor.config.ts` itself
- Add new native plugins
