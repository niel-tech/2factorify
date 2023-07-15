import { getCsrfToken } from "next-auth/react"
import Import from "./import"
import ReadOtp from "./read"
import FilterOtps from "./filter"

export default async function TwoFactorPage() {
  return (
    <div className="my-1 grid">
      <Import />
      <FilterOtps />
      <ReadOtp />
    </div>
  )
}
