"use client"

import { Input } from "../../components/Input/Input"
import InputLabel from "../../components/InputLabel/InputLabel"
import { useState } from "react"
import { useOtpActions, useOtpsStore } from "../../store/otp.store"

export default function FilterOtps() {
  const { otps } = useOtpsStore()
  const { updateFilter } = useOtpActions()
  const [filterValue, setFilterValue] = useState<string | undefined>()

  const handleOnChange = (e: InputEvent) => {
    const element = e.target as HTMLInputElement

    setFilterValue(element.value)
    updateFilter(element.value)
  }

  return (
    <div className="my-2">
      {otps.length > 0 && (
        <InputLabel label="filter otps">
          <Input
            value={filterValue ?? ""}
            className="w-full"
            placeholder="filter otps"
            autoFocus={true}
            onChange={handleOnChange as any}
          />
        </InputLabel>
      )}
    </div>
  )
}
