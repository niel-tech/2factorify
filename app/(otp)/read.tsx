"use client"

import { useFilteredOtps, useOtpActions, useOtps } from "../../store/otp.store"
import FilterOtps from "./filter"
import { useEffect, useState } from "react"
import { decryptText, generateMd5Hash } from "../../lib/crypto"
import { ParseOtpAuthUrl } from "../../lib/otp"
import OtpRender from "./components/otp-render"
import Import from "./import"
import { SaltedOtp } from "../../models/saltedOtp.model"
import InputLabel from "../../components/InputLabel/InputLabel"
import { Input } from "../../components/Input/Input"
import { useDebounce } from "usehooks-ts"
import useTabActive from "../../hooks/useTabActive"

export function ReadOtp() {
  const otps = useFilteredOtps()

  return (
    <div>
      {otps.map((otp, i) => (
        <OtpRender key={otp.secret + i} otpAuthUrl={otp} index={i} />
      ))}
    </div>
  )
}

type ReadUserOtpProps = {
  saltedUserOtps: SaltedOtp[]
}

export function ReadUserOtp({ saltedUserOtps }: ReadUserOtpProps) {
  const otps = useOtps()
  const otpsFiltered = useFilteredOtps()
  const { addOtps, clearState } = useOtpActions()
  const [pw, setPw] = useState<string | undefined>("")
  const debouncedPw = useDebounce(pw, 1000)
  const [decryptionSuccess, setDecryptionSuccess] = useState<boolean>(false)

  const isTabActive = useTabActive()

  useEffect(() => {
    if (!isTabActive) {
      clearComponentState()
    }
  }, [isTabActive])

  useEffect(() => {
    if (decryptionSuccess) {
      const timeout = setTimeout(() => {
        clearComponentState()
      }, 1000 * 60 * 5)

      return () => clearTimeout(timeout)
    }
  }, [decryptionSuccess])

  useEffect(() => {
    if (debouncedPw && !decryptionSuccess) {
      try {
        const otpAuthUrls = saltedUserOtps.map(({ saltedUrl }) => decryptText(saltedUrl, generateMd5Hash(debouncedPw)))

        if (otpAuthUrls.filter((otp) => otp.startsWith("otpauth://totp/")).length > 0) {
          addOtps(
            otpAuthUrls.map((otpAuthUrl) => ParseOtpAuthUrl(otpAuthUrl)),
            true
          )
          setDecryptionSuccess(true)
        }
      } catch (e: any) {}
    }
  }, [debouncedPw, saltedUserOtps])

  const handleOnChange = (e: InputEvent) => {
    const element = e.target as HTMLInputElement
    setPw(element.value)
  }

  const clearComponentState = () => {
    clearState()
    setDecryptionSuccess(false)
    setPw("")
  }

  return (
    <div>
      <Import toggleState={saltedUserOtps.length === 0} />
      {decryptionSuccess && <FilterOtps />}
      {!decryptionSuccess && (
        <InputLabel className="flex flex-col text-left" label="Password">
          <Input
            className="w-full"
            placeholder="Enter password to decode salted otp auth urls"
            value={pw}
            type="password"
            autoComplete="false"
            onChange={handleOnChange as any}
            autoFocus={true}
          />
        </InputLabel>
      )}
      {otps.length > 0 &&
        otpsFiltered.map((otp, i) => <OtpRender key={otp.secret + i + "tx"} otpAuthUrl={otp} index={i} />)}
      {otps.length === 0 && saltedUserOtps.map((otp, i) => <OtpRender key={otp.saltedUrl + i} index={i} />)}
    </div>
  )
}
