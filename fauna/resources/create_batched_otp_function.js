import faunadb from "faunadb"

const q = faunadb.query
const {
  CreateFunction,
  Create,
  Collection,
  Query,
  Var,
  Lambda,
  If,
  Role,
  Match,
  Index,
  Select,
  Get,
  Let,
  Map,
  LT,
  Now,
  ToTime,
} = q

const CreateFunctionGetOtpByUser = CreateFunction({
  name: "createBatchedOtp",
  role: Role("user"),
  body: Query(
    Lambda(
      ["session_token", "otpBatches"],
      Let(
        {
          getSession: Get(Match(Index("session_by_session_token"), Var("session_token"))),
        },
        If(
          LT(Now(), ToTime(Select(["data", "expires"], Var("getSession")))),
          Let(
            {
              createBatchedOtp: Map(
                Var("otpBatches"),
                Lambda(
                  ["otp"],
                  Select(
                    ["ref"],
                    Create(Collection("otp"), {
                      data: {
                        saltedUrl: Select(["saltedUrl"], Var("otp")),
                        userId: Select(["data", "userId"], Var("getSession")),
                      },
                    })
                  )
                )
              ),
            },
            Map(
              Var("createBatchedOtp"),
              Lambda(
                ["ref"],
                Let(
                  {
                    getOtp: Get(Var("ref")),
                  },
                  {
                    id: Select(["ref", "id"], Var("getOtp")),
                    saltedUrl: Select(["data", "saltedUrl"], Var("getOtp")),
                    userId: Select(["data", "userId"], Var("getOtp")),
                  }
                )
              )
            )
          ),
          {
            error: "no valid session",
          }
        )
      )
    )
  ),
})

export default CreateFunctionGetOtpByUser
