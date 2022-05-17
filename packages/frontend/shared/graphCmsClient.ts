import { GraphQLClient } from 'graphql-request'
import { env } from './environment'


export const graphCmsClient = new GraphQLClient(
  env.graphcms.contentEndpoint,
  {
    headers: {
      authorization: `Bearer ${env.graphcms.authToken}`,
    },
  }
)
