const shouldAnalyzeBundles = process.env.ANALYZE === true;
/** @type {import('next').NextConfig} */

let nextConfig = {


  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Depth, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false,
      })
    );

    // Add fallback configuration
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      // Add other packages that are not found here
    };

    // Provide an empty module for child_process
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^child_process$/,
        'node-libs-browser/mock/empty.js'
      )
    );

    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
    ],
  },
  staticPageGenerationTimeout: 1000,
};

if (shouldAnalyzeBundles) {
  console.log('Analyzing bundles..');
  const withNextBundleAnalyzer = require('next-bundle-analyzer')({
    enabled: true,
  });
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
