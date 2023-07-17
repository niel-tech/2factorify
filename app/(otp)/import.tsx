"use client"

import { useEffect, useState } from "react"
import { useOtps } from "../../store/otp.store"
import ToggleContainer from "../../components/ToggleContainer/ToggleContainer"
import { AddOtpByCamera, AddOtpByForm } from "./add"

type ImportProps = {
  toggleState?: boolean
}

export default function Import({ toggleState }: ImportProps) {
  const otps = useOtps()
  const [toggle, setToggle] = useState<boolean>(toggleState ?? otps.length === 0)

  useEffect(() => {
    if (toggleState !== undefined) {
      setToggle(toggleState)
    }
  }, [toggleState])

  return (
    <ToggleContainer className="text-left" toggleState={toggle} setToggleState={setToggle}>
      <AddOtpByCamera isToggled={toggle} setToggle={setToggle} />
      <LineBreaker />
      <AddOtpByForm isToggled={toggle} setToggle={setToggle} />
    </ToggleContainer>
  )
}

const LineBreaker = () => {
  return (
    <div className="relative mt-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-[#e6e4da] px-2 text-gray-500">Or</span>
      </div>
    </div>
  )
}
