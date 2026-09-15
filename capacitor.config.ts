import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fit.elitebounce',
  appName: 'Elite Bounce',
  webDir: 'public', //out
  server: {
    // Ovdje direktno gađaš svoju login stranicu na serveru
    url: 'https://elitebounce.fit/login',
    cleartext: true
  }
};

export default config;

