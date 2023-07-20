import { useEffect, useState } from "react"
import { decryptText, generateMd5Hash } from "../lib/crypto"
import { ParseOtpAuthUrl } from "../lib/otp"
import useTabActive from "./useTabActive"
import { useE2eActions, useE2eKeyStore, useOtpActions } from "../store/otp.store"
import { SaltedOtp } from "../models/saltedOtp.model"

const useDecryptor = (saltedOtps: SaltedOtp[]) => {
  const isTabActive = useTabActive()
  const [decryptionSuccess, setDecryptionSuccess] = useState<boolean>(false)
  const { e2eKey } = useE2eKeyStore()
  const { addE2eKey } = useE2eActions()
  const { addOtps } = useOtpActions()

  useEffect(() => {
    if (e2eKey) {
      try {
        if (saltedOtps.length === 0) {
          setDecryptionSuccess(true)
          return
        }

        const otpAuthUrls = saltedOtps.map(({ saltedUrl }: { saltedUrl: string }) =>
          decryptText(saltedUrl, generateMd5Hash(e2eKey))
        )

        if (otpAuthUrls.filter((otp: string) => otp.startsWith("otpauth://totp/")).length > 0) {
          setDecryptionSuccess(true)
          addOtps(
            otpAuthUrls.map((otpAuthUrl: string) => ParseOtpAuthUrl(otpAuthUrl)),
            true
          )
        }
      } catch (e: any) {}
    } else {
      setDecryptionSuccess(false)
    }
  }, [e2eKey, saltedOtps])

  useEffect(() => {
    if (!isTabActive) {
      clearComponentState() // resets state after tab becomes inactive
    }
  }, [isTabActive])

  useEffect(() => {
    if (e2eKey) {
      const timeout = setTimeout(() => {
        clearComponentState()
      }, 1000 * 60 * 5) // resets state after 5 minutes

      return () => clearTimeout(timeout)
    }
  }, [e2eKey])

  const clearComponentState = () => {
    addE2eKey("")
  }

  return {
    decryptionSuccess,
  }
}

export default useDecryptor
