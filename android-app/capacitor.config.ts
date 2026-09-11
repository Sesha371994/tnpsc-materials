import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tnpscstudyhall.app',
  appName: 'TET & TNPSC Study Hall',
  webDir: 'public',
  // Points the Android app at your LIVE deployed site — replace with your
  // real Vercel URL before building. This is what makes it a "wrapper":
  // the app just shows your real website inside a native shell.
  server: {
    url: 'https://your-app.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
