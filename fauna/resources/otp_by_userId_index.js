import faunadb from "faunadb"

const q = faunadb.query
const { Collection, CreateIndex } = q

const CreateIndexOtpByUserId = CreateIndex({
  name: "otp_by_userId",
  source: Collection("otp"),
  unique: false,
  terms: [{ field: ["data", "userId"] }],
})

export default CreateIndexOtpByUserId
