import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { env } from './environment'

const apolloHttpLink = createHttpLink({
  uri: env.graphcms.contentEndpoint,
})

const apolloAuthLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${env.graphcms.authToken}`,
    }
  }
})

export const apolloClient = new ApolloClient({
  link: apolloAuthLink.concat(apolloHttpLink),
  cache: new InMemoryCache()
})
