import faunadb from "faunadb"

const q = faunadb.query
const { CreateCollection } = q

const CreateCollectionOtp = CreateCollection({
  name: "otp",
  history_days: 0,
  ttl_days: null,
})

export default CreateCollectionOtp
