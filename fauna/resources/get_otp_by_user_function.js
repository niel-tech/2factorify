import faunadb from "faunadb"

const q = faunadb.query
const { CreateFunction, Query, Var, Lambda, If, Paginate, Role, Match, Index, Select, Get, Let, Map, LT, Now, ToTime } =
  q

const CreateFunctionGetOtpByUser = CreateFunction({
  name: "getOtpByUser",
  role: Role("user"),
  body: Query(
    Lambda(
      ["session_token"],
      Let(
        {
          getSession: Get(Match(Index("session_by_session_token"), Var("session_token"))),
          getOtp: Paginate(Match(Index("otp_by_userId"), Select(["data", "userId"], Var("getSession")))),
        },
        If(
          LT(Now(), ToTime(Select(["data", "expires"], Var("getSession")))),
          Select(
            "data",
            Map(
              Var("getOtp"),
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
          []
        )
      )
    )
  ),
})

export default CreateFunctionGetOtpByUser
