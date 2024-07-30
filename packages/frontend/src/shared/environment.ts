/* eslint-disable @typescript-eslint/no-non-null-assertion */

export const env = {
  url:
    process.env.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_ENV! === 'preview'
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL,
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',

  twitterLink: process.env.NEXT_PUBLIC_TWITTER_LINK!,

  revalidateToken: process.env.REVALIDATE_TOKEN!,

  buildCacheMaxAge: parseInt(process.env.BUILD_CACHE_MAX_AGE || '86400'),

  graphcms: {
    contentEndpoint: process.env.GRAPHCMS_CONTENT_ENDPOINT!,
    authToken: process.env.GRAPHCMS_AUTH_TOKEN!,
  },

  coinmarketcapApiKey: process.env.COINMARKETCAP_API_KEY!,

  cryptopanicApiKey: process.env.CRYPTOPANIC_API_KEY!,

  covalentApiKey: process.env.COVALENT_API_KEY!,

  coinapiApiKey: process.env.COINAPI_API_KEY!,
}
