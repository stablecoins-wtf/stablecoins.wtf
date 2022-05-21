export const env = {
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',
  url: process.env.NEXT_PUBLIC_URL!,

  twitterLink: process.env.NEXT_PUBLIC_TWITTER_LINK!,

  revalidateToken: process.env.REVALIDATE_TOKEN!,

  buildCacheMaxAge: parseInt(process.env.BUILD_CACHE_MAX_AGE || '300'),

  graphcms: {
    contentEndpoint: process.env.GRAPHCMS_CONTENT_ENDPOINT!,
    authToken: process.env.GRAPHCMS_AUTH_TOKEN!,
  },

  coinmarketcapApiKey: process.env.COINMARKETCAP_API_KEY!,

  cryptopanicApiKey: process.env.CRYPTOPANIC_API_KEY!,

  covalentApiKey: process.env.COVALENT_API_KEY!,

  coinapiApiKey: process.env.COINAPI_API_KEY!,
}