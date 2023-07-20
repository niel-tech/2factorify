"use client"

import { FormEvent, useEffect, useState } from "react"
import { useE2eKeyStore, useOtpActions, useOtpsStore } from "../../store/otp.store"
import ToggleContainer from "../../components/ToggleContainer/ToggleContainer"
import { AddOtpByCamera, AddOtpByForm } from "./add"
import { SaltedOtp } from "../../models/saltedOtp.model"
import { encryptText, generateMd5Hash } from "../../lib/crypto"
import { mutate } from "swr"
import { createBatchedOtp, GET_OTP_BY_USER } from "../../lib/fauna"

type ImportProps = {
  isLoggedIn: boolean
  toggleState?: boolean
  sessionToken: string | undefined
}

export default function Import({ isLoggedIn, toggleState, sessionToken }: ImportProps) {
  const { otps } = useOtpsStore()
  const { e2eKey } = useE2eKeyStore()
  const { addSaltedOtps } = useOtpActions()
  const [toggle, setToggle] = useState<boolean>(toggleState ?? otps.length === 0)

  useEffect(() => {
    if (toggleState !== undefined) {
      setToggle(toggleState)
    }
  }, [toggleState])

  const onAddOtpByFormSubmit = async (e: FormEvent, otpAuthUrl: string) => {
    e.preventDefault()

    const saltedUrl = encryptText(otpAuthUrl, generateMd5Hash(e2eKey))

    return await performDataStorageAction([{ saltedUrl: saltedUrl }])
  }

  const onAddOtpByCameraSubmit = async (otpAuthUrls: string[]) => {
    const saltedUrls = otpAuthUrls.map((otpAuthUrl) => ({
      saltedUrl: encryptText(otpAuthUrl, generateMd5Hash(e2eKey)),
    }))

    return await performDataStorageAction(saltedUrls)
  }

  const performDataStorageAction = async (saltedOtps: SaltedOtp[]) => {
    if (isLoggedIn) {
      mutate(
        [GET_OTP_BY_USER, { sessionToken }],
        async () => {
          if (sessionToken) {
            const addedSaltedOtps = await createBatchedOtp(sessionToken, saltedOtps)
            addSaltedOtps(addedSaltedOtps, false)

            return {
              getOtpByUser: addedSaltedOtps,
            }
          }
        },
        false
      )
    } else {
      addSaltedOtps(saltedOtps, false)
    }
  }

  return (
    <ToggleContainer className="text-left" toggleState={toggle} setToggleState={setToggle}>
      <AddOtpByCamera onRenderSuccessCallback={onAddOtpByCameraSubmit} isToggled={toggle} setToggle={setToggle} />
      <LineBreaker text="Or" />
      <AddOtpByForm onSubmit={onAddOtpByFormSubmit} isToggled={toggle} setToggle={setToggle} />
    </ToggleContainer>
  )
}

const LineBreaker = ({ text }: { text: string }) => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-[#e6e4da] px-2 text-gray-500">{text}</span>
      </div>
    </div>
  )
}
