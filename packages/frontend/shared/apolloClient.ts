import { ApolloClient, InMemoryCache } from '@apollo/client'
import { env } from './environment'

export const apolloClient = new ApolloClient({
  uri: env.graphcms.contentEndpoint,
  cache: new InMemoryCache()
})
