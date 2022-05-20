/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['localhost', 'ipfs.io', 'gateway.ipfs.io'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        'fs': false,
        'path': false,
        'os': false,
      }
    }
    return config
  },
}

module.exports = nextConfig