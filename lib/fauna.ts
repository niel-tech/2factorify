import { Client as FaunaClient } from "faunadb"
import { gql, GraphQLClient } from "graphql-request"
import { Otp } from "../models/otp.model"
import { SaltedOtp } from "../models/saltedOtp.model"

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

export const GET_OTP_BY_USER = gql`
  query getOtpByUser($sessionToken: String!) {
    getOtpByUser(session_token: $sessionToken) {
      id
      saltedUrl
    }
  }
`

export const getOtpByUser = (sessionToken: string): Promise<Otp[]> => {
  return userClient.request(GET_OTP_BY_USER, { sessionToken }).then(({ getOtpByUser }: any) => getOtpByUser)
}

export const CREATE_BATCHED_OTP = gql`
  mutation createBatchedOtp($sessionToken: String!, $otpBatches: [SaltedUrl!]!) {
    createBatchedOtp(session_token: $sessionToken, otpBatches: $otpBatches) {
      saltedUrl
    }
  }
`

export const createBatchedOtp = (sessionToken: string, otpBatches: { saltedUrl: string }[]): Promise<SaltedOtp[]> => {
  return userClient
    .request(CREATE_BATCHED_OTP, { sessionToken, otpBatches })
    .then(({ createBatchedOtp }: any) => createBatchedOtp)
}

export const VALIDATE_SESSION = gql`
  query validateSession($sessionToken: String!) {
    validateSession(session_token: $sessionToken) {
      userId
    }
  }
`

export const validateSession = (sessionToken: string): Promise<{ userId: string }> => {
  return userClient
    .request(VALIDATE_SESSION, { sessionToken })
    .then(({ validateSession }: any) => validateSession)
    .catch((e) => console.log(e))
}
