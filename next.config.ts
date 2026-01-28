import type { NextConfig } from "next";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  output: 'export',
  productionBrowserSourceMaps: false, // Disable source maps for security
  /* config options here */
};

export default withPWA(nextConfig);
