/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep verification builds separate from a running development server.
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

module.exports = nextConfig;
