import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Pin the file-tracing root to this project.
   *
   * Next walks upward looking for a lockfile to infer the workspace root, and
   * there is a stray `package-lock.json` in the user's home directory — so it
   * was selecting `/Users/<user>` as the root and warning on every build. That
   * file is outside this repository and is not ours to delete; pinning the root
   * is the correct fix and also keeps the standalone output trace from reaching
   * outside the project.
   */
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['motion'],
  },
};

export default nextConfig;
