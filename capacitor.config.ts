import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kdt.app',
  appName: 'KDT',
  webDir: 'www',
  server: {
    androidScheme: 'http'   // 👈 fuerza HTTP
  }
};

export default config;
