import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  // Disabling Turbopack explicitly might help with folder path issues
  // or we can just try to make it more robust
  experimental: {
    // any needed experimental flags
  }
};

export default withNextIntl(nextConfig);
