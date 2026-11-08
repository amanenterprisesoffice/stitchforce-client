import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.stitchforce.app",
  appName: "StitchForce",
  webDir: "www",
  server: {
    // url: "https://stitchforce-server-app.vercel.app/",
    url: "https://stitchforce.vercel.app",
    cleartext: false,
  },
};

export default config;