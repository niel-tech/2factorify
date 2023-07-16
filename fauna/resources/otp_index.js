import faunadb from "faunadb"

const q = faunadb.query
const { Collection, CreateIndex } = q

const CreateIndexOtp = CreateIndex({
  name: "otp",
  unique: false,
  serialized: true,
  source: Collection("otp"),
})

export default CreateIndexOtp
