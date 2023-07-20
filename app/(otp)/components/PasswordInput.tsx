import { Input } from "../../../components/Input/Input"
import { classNames } from "../../../utils/classNames"
import InputLabel from "../../../components/InputLabel/InputLabel"
import { useE2eActions, useOtpsStore } from "../../../store/otp.store"
import { Button } from "../../../components/Button/Button"
import { FormEvent, useEffect, useState } from "react"

export const PasswordInput = () => {
  const { saltedOtps } = useOtpsStore()
  const { addE2eKey } = useE2eActions()
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [load, setLoad] = useState<boolean>(false)

  useEffect(() => {
    setLoad(true)
  }, [])

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault()

    if (password === undefined || password.length < 6) return

    addE2eKey(password)
  }

  return (
    <form onSubmit={onSubmit} className="text-left">
      <InputLabel
        className="flex flex-col text-left"
        label={
          load && saltedOtps.length > 0
            ? "Enter your end-to-end encryption key"
            : "Define your end-to-end encryption key"
        }
      >
        <Input
          className={classNames("w-full")}
          placeholder={
            load && saltedOtps.length > 0
              ? "Enter your end-to-end encryption key"
              : "Define your end-to-end encryption key"
          }
          value={password ?? ""}
          type="password"
          autoComplete="false"
          onChange={(e) => setPassword(e.target.value)}
          autoFocus={true}
        />
        {password && password.length < 6 && (
          <span className="text-xs font-bold text-red-600">Password must be minium 6 chars long!</span>
        )}
        {password === "" && <span className="text-xs font-bold text-red-600">Password must be set!</span>}
      </InputLabel>
      <div className="my-3">
        <Button
          className={classNames((password === undefined || password.length < 6) && "disabled:bg-blue-300")}
          size="sm"
          type="submit"
          disabled={password === undefined || password.length < 6}
          onKeyPress={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              onSubmit()
            }
          }}
        >
          Save
        </Button>
      </div>
    </form>
  )
}
