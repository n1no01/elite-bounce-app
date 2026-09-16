import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fit.elitebounce',
  appName: 'Elite Bounce',
  webDir: 'public',
  server: {
    url: 'https://elitebounce.fit/login', // <--- Cilja tvoj live sajt
    cleartext: true
  }
};

export default config;
