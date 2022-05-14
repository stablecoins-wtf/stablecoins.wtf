/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['localhost', 'ipfs.io', 'gateway.ipfs.io'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
  },
}

module.exports = nextConfig