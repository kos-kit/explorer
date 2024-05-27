/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.INPUT_NEXT_BASE_PATH,
  // experimental: {
  // esmExternals: false,
  // cpus: 1,
  // workerThreads: false,
  // },
  images: {
    unoptimized: true,
  },
  output: process.env.INPUT_NEXT_OUTPUT ?? "export",
  staticPageGenerationTimeout: 60 * 5, // in seconds
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource: function (resource, context) {
          if (resource.endsWith("/.env")) {
            return true; // Ignore
          }
          return false; // Don't ignore
        },
      }),
    );

    return config;
  },
};

export default nextConfig;
