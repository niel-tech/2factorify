import { Client as FaunaClient } from "faunadb"
import { gql, GraphQLClient } from "graphql-request"

export const authClient = new FaunaClient({
  secret: (process.env.NODE_ENV === "development"
    ? process.env.DEV_FAUNA_ADMIN_KEY
    : process.env.FAUNA_ADMIN_KEY) as string,
  scheme: "https",
  domain: process.env.FAUNADB_DOMAIN,
  port: 443,
})

export const userClient = new GraphQLClient("https://graphql.eu.fauna.com/graphql", {
  headers: {
    authorization: `Bearer ${
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEV_FAUNA_USER_KEY
        : process.env.NEXT_PUBLIC_FAUNA_USER_KEY
    }`,
  },
  fetch: fetch,
})

export const GET_BINS_BY_USER = (sessionToken?: string) => gql`
  query getBinsByUser {
    getBinsByUser(
      session_token: "${sessionToken}"
    ) {
      title
      hashed_id
      lifetime
      readOnce
      isProtected
      createdAt
    }
  }`

/*export const getBinsByUser = (sessionToken: string): Promise<Bin[]> => {
  return userClient.request(GET_BINS_BY_USER(sessionToken)).then(({ getBinsByUser }: any) => getBinsByUser)
}

export const validateSession = (sessionToken: string): Promise<{ userId: string }> => {
  const query = `query validateSession {
    validateSession(
      session_token: "${sessionToken}"
    ) {
      userId
    }
  }`

  return userClient.request(query).then(({ validateSession }: any) => validateSession)
}
*/
