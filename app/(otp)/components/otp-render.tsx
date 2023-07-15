"use client"

import { OtpAuthUrl } from "../../../models/otpAuthUrl.model"
import useOtp from "../../../hooks/useOtp"
import { useOtpActions } from "../../../store/otp.store"

type TotpProps = {
  otpAuthUrl: OtpAuthUrl
  index: number
}

export default function OtpRender({ otpAuthUrl, index }: TotpProps) {
  const { token, SVGValidUntil } = useOtp(otpAuthUrl)
  const { removeOtp } = useOtpActions()

  const handleCopyClick = () => {
    if (token) navigator.clipboard.writeText(token)
  }

  const handleDeleteClick = () => {
    removeOtp(index)
  }

  return (
    <div className="my-2.5">
      <div className="flex items-center">
        <h2 className="my-1 break-all text-left text-lg font-bold text-gray-700">
          {otpAuthUrl.issuer && otpAuthUrl.account !== otpAuthUrl.issuer
            ? `${otpAuthUrl.issuer}: ${otpAuthUrl.account}`
            : `${otpAuthUrl.account}`}
        </h2>
        <div className="flex min-w-max flex-1 justify-end">
          <svg
            className="mx-[5px] h-5 w-5 cursor-pointer text-black hover:stroke-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={handleDeleteClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center text-2xl font-bold text-blue-600">
        <div className="cursor-pointer select-none" onClick={handleCopyClick}>
          <span>{token?.substring(0, 3)}</span>
          <span className="ml-1">{token?.substring(3, 6)}</span>
        </div>
        <SVGValidUntil />
      </div>
    </div>
  )
}
