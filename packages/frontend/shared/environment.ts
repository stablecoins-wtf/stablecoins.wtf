export const env = {
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',
  url: process.env.NEXT_PUBLIC_URL!,

  twitterLink: process.env.NEXT_PUBLIC_TWITTER_LINK!,

  revalidateToken: process.env.REVALIDATE_TOKEN!,

  graphcms: {
    contentEndpoint: process.env.GRAPHCMS_CONTENT_ENDPOINT!,
  }
}