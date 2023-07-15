import { URI } from "otpauth-migration"
import { OtpAuthUrl } from "../models/otpAuthUrl.model"

/***
 * get OTPAuthURI's from migrationURI
 * @param migrationUrl: "otpauth-migration://offline?data=..."
 * @constructor
 */
export const OTPAuthURI = (migrationURI: string) => URI.toOTPAuthURIs(migrationURI)

/***
 * generate migrationURI string
 * @param otps: ["otpauth://totp/...", "otpauth://totp/..."]
 * @constructor
 */
export const MigrateOtpAuth = (otps: string[]) => URI.toOTPAuthMigrationURI(otps)

export const BuildOtpAuthUrl = (secret: string, account: string, issuer: string, period: string) => {
  account = account || "unknown"
  let label = account
  if (issuer) {
    label = `${issuer}:${account}`
  }

  let result = "otpauth://totp/" + encodeURIComponent(label) + "?secret=" + encodeURIComponent(secret)
  if (account && issuer) {
    result += "&issuer=" + encodeURIComponent(issuer)
  }
  if (period) {
    result += "&period=" + period
  }
  return result
}

export const ParseOtpAuthUrl = (otpauthUrlString: string): OtpAuthUrl => {
  const otpauthUrl = new URL(otpauthUrlString)

  const result = {} as OtpAuthUrl

  if (otpauthUrl.searchParams.get("secret")) {
    result.secret = decodeURIComponent(otpauthUrl.searchParams.get("secret") as string)
  }

  const label = decodeURIComponent(otpauthUrl.pathname.replace(RegExp("^//totp/"), ""))
  if (!label.includes(":")) {
    result.account = label
  } else {
    result.account = label.split(":")[1]
    result.issuer = label.split(":")[0]
  }
  if (otpauthUrl.searchParams.get("issuer")) {
    result.issuer = decodeURIComponent(otpauthUrl.searchParams.get("issuer") as string)
  }
  if (otpauthUrl.searchParams.get("period")) {
    result.period = decodeURIComponent(otpauthUrl.searchParams.get("period") as string)
  }

  return result
}
