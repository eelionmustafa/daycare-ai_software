import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the tracing root: a stray lockfile exists in the user home directory.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
