"use client"

import OtpRender from "./components/otp-render"
import { useFilteredOtps, useOtps } from "../../store/otp.store"

export default function ReadOtp() {
  const otps = useFilteredOtps()

  return (
    <div>
      {otps.map((otp, i) => (
        <OtpRender key={otp.secret + i} otpAuthUrl={otp} index={i} />
      ))}
    </div>
  )
}
