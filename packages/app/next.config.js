const shouldAnalyzeBundles = process.env.ANALYZE === true
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
let nextConfig = {
  assetPrefix: isProd ? 'https://streameth.org' : undefined,

  redirects: async () => [
    {
      source: '/',
      destination: '/index.html',
      has: [
        {
          type: 'host',
          value: 'www.streameth.org',
        },
        {
          type: 'host',
          value: 'streameth.org',
        },
      ],
      permanent: true,
    },
    {
      source: '/',
      has: [
        {
          type: 'host',
          value: 'zuzalu.streameth.org',
        },
      ],
      destination: 'https://streameth.org/zuzalu',
      permanent: true,
    },
    {
      source: '/archive',
      has: [
        {
          type: 'host',
          value: 'zuzalu.streameth.org',
        },
      ],
      destination: 'https://streameth.org/zuzalu',
      permanent: true,
    },
    {
      source: '/',
      has: [
        {
          type: 'host',
          value: 'swarm.streameth.org',
        },
      ],
      destination: 'https://streameth.org/swarm',
      permanent: true,
    },
    {
      source: '/',
      has: [
        {
          type: 'host',
          value: 'basemiami.xyz',
        },
      ],
      destination: 'https://basemiami.xyz/base',
      permanent: true,
    },
    {
      source: '/',
      has: [
        {
          type: 'host',
          value: 'watch.protocol.berlin',
        },
      ],
      destination: 'https://watch.protocol.berlin/ethberlin',
      permanent: true,
    },
    {
      source: '/',
      has: [
        {
          type: 'host',
          value: 'launch.scroll.io',
        },
      ],
      destination: 'https://launch.scroll.io/scroll',
      permanent: true,
    },
  ],

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
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, webpack }
  ) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false,
      })
    )

    return config
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
}

if (shouldAnalyzeBundles) {
  console.log('Analyzing bundles..')
  const withNextBundleAnalyzer = require('next-bundle-analyzer')({
    enabled: true,
  })
  nextConfig = withNextBundleAnalyzer(nextConfig)
}

module.exports = nextConfig
