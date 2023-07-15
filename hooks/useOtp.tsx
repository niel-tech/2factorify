import React from "react"
import { useEffect, useState } from "react"
import { base32ToHex, decToHex, hexToDec } from "../utils/converters"
import { generateSHA1 } from "../lib/crypto"
import { OtpAuthUrl } from "../models/otpAuthUrl.model"

type SVGValidUntilProps = {
  dashOffset: number
}

const SVGValidUntil = ({ dashOffset }: SVGValidUntilProps) => {
  return (
    <svg
      style={{
        display: "block",
        width: "22px",
        height: "22px",
        marginLeft: "auto",
        transform: "rotate(-90deg)",
        borderRadius: "50%",
      }}
      viewBox="0 0 0.318310 0.318310"
    >
      <circle
        style={{
          transition: "stroke-dashoffset .2s linear",
          stroke: "#2563ea",
          strokeWidth: "100%",
          strokeDasharray: "1",
          strokeDashoffset: dashOffset,
          fill: "none",
        }}
        r="0.159155"
        cx="0.159155"
        cy="0.159155"
      />
    </svg>
  )
}

const useOtp = (otpAuthUrl: OtpAuthUrl) => {
  const [dashOffset, setDashOffset] = useState<number>(0)
  const [token, setToken] = useState<string>()

  const stepSeconds =
    Number.isInteger(Number(otpAuthUrl.period)) && Number(otpAuthUrl.period) > 0 ? Number(otpAuthUrl.period) : 30

  const getRemainingSeconds = () => stepSeconds - ((Date.now() / 1000) % stepSeconds)

  const generateToken = () => {
    if (otpAuthUrl.secret.length < 16) {
      throw new Error("Secret minimum length is 16, but was only" + otpAuthUrl.secret.length)
    }

    let secretHex = base32ToHex(otpAuthUrl.secret.replace(/\s/g, ""))

    if (secretHex === undefined) return ""

    if (secretHex.length % 2 !== 0) {
      secretHex += "0"
    }

    const counter = Math.floor(Date.now() / 1000 / stepSeconds)
    const counterHex = decToHex(counter)

    const hmac = generateSHA1(counterHex.padStart(16, "0"), secretHex)
    const offset = hexToDec(hmac.slice(-1))
    return String(hexToDec(hmac.substr(offset * 2, 8)) & hexToDec("7fffffff")).slice(-6)
  }

  useEffect(() => {
    setToken(generateToken())

    const tokenUpdater = setInterval(() => setToken(generateToken()), 1000)
    const svgUpdater = setInterval(() => setDashOffset(-1 + getRemainingSeconds() / stepSeconds), 10)

    return () => {
      clearInterval(tokenUpdater)
      clearInterval(svgUpdater)
    }
  }, [otpAuthUrl])

  return {
    token: token,
    SVGValidUntil: () => <SVGValidUntil dashOffset={dashOffset} />,
  }
}

export default useOtp
