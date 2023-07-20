"use client"

import { useE2eKeyStore, useFilteredOtps, useOtpActions, useOtpsStore } from "../../store/otp.store"
import { useEffect } from "react"
import OtpRender from "./components/OtpRender"
import Import from "./import"
import { SaltedOtp } from "../../models/saltedOtp.model"
import { PasswordInput } from "./components/PasswordInput"
import FilterOtps from "./filter"
import useSWR from "swr"
import { GET_OTP_BY_USER } from "../../lib/fauna"
import useDecryptor from "../../hooks/useDecryptor"

type ReadOtpProps = {
  session_token: string | undefined
  saltedUserOtps?: SaltedOtp[]
}

export function ReadOtp({ session_token }: ReadOtpProps) {
  const { saltedOtps } = useOtpsStore()
  const { data, error, isLoading } = useSWR([GET_OTP_BY_USER, { sessionToken: session_token }], {
    fallbackData: { getOtpByUser: saltedOtps },
  })
  const { e2eKey } = useE2eKeyStore()
  const otpsFiltered = useFilteredOtps()
  const { addSaltedOtps } = useOtpActions()
  const { decryptionSuccess } = useDecryptor(saltedOtps)

  useEffect(() => {
    if (data?.getOtpByUser !== undefined) {
      addSaltedOtps(data.getOtpByUser)
    }
  }, [isLoading])

  return (
    <div className="mt-10">
      {e2eKey && decryptionSuccess ? (
        <>
          <Import
            sessionToken={session_token}
            isLoggedIn={!!session_token}
            toggleState={data?.getOtpByUser && data.getOtpByUser.length === 0}
          />
          <FilterOtps />
          <OtpRender otpAuthUrls={otpsFiltered} />
        </>
      ) : (
        <PasswordInput />
      )}
    </div>
  )
}
