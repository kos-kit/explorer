/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.INPUT_NEXT_BASE_PATH,
  output: "export",
  staticPageGenerationTimeout: 600,
  webpack: (config, { isServer, webpack }) => {
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
