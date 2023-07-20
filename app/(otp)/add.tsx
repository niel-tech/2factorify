"use client"

import InputLabel from "../../components/InputLabel/InputLabel"
import { Input } from "../../components/Input/Input"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import BarcodeScanner from "./components/BarcodeScanner"
import { Html5QrcodeResult } from "html5-qrcode"
import { BuildOtpAuthUrl, OTPAuthURI } from "../../lib/otp"
import { useOtpActions } from "../../store/otp.store"
import { Button } from "../../components/Button/Button"
import { OtpAuthUrl } from "../../models/otpAuthUrl.model"
import { InputCopy } from "../../components/InputCopy/InputCopy"
import { base32ToHex } from "../../utils/converters"
import { classNames } from "../../utils/classNames"
import { createQrCode } from "../../lib/qrCode"

type AddOtpByFormProps = {
  isToggled: boolean
  setToggle: Dispatch<SetStateAction<boolean>>
  onSubmit: (e: FormEvent, otpAuthUrl: string) => Promise<void>
}

type OtpInput = {
  value: string
  isOtpAuth: boolean
  otpAuthUrl: OtpAuthUrl
}

export function AddOtpByForm({ isToggled, setToggle, onSubmit }: AddOtpByFormProps) {
  const [input, setInput] = useState<OtpInput>({} as OtpInput)
  const [validSecret, setValidSecret] = useState<boolean | undefined>(undefined)
  const [qrCode, setQrCode] = useState<string | undefined>(undefined)
  const { addOtps } = useOtpActions()

  useEffect(() => {
    if (!isToggled) {
      setInput({} as OtpInput)
      setValidSecret(undefined)
      setQrCode(undefined)
    }
  }, [isToggled])

  useEffect(() => {
    if (!!input?.otpAuthUrl?.secret) {
      try {
        base32ToHex(input.otpAuthUrl.secret)
        setValidSecret(true)
      } catch (e: any) {
        setValidSecret(false)
      }

      if (input.otpAuthUrl.secret.length < 16) {
        setValidSecret(false)
      }
    }
  }, [input])

  const handleOnSubmit = (e: FormEvent) => {
    onSubmit(
      e,
      BuildOtpAuthUrl(
        input.otpAuthUrl.secret,
        input.otpAuthUrl.account,
        input.otpAuthUrl.issuer,
        input.otpAuthUrl.period
      )
    )
  }

  const handleInputChange = (event: InputEvent) => {
    const element = event.target as HTMLInputElement
    const otpInputParsed = { otpAuthUrl: {} } as OtpInput

    if (!element.value) return

    //otpInputParsed.value = element.value.replace(/\?secret=(.*?)(?:&|$)/, "?secret=secret&").replace(/&$/, "")
    otpInputParsed.isOtpAuth = element.value.startsWith("otpauth://totp/")

    if (otpInputParsed.isOtpAuth) {
      otpInputParsed.otpAuthUrl.account = element.value.match(/otpauth:\/\/totp\/(.*?)\?/)?.[1] ?? ""
      otpInputParsed.otpAuthUrl.secret = element.value.match(/\?secret=(.*?)(?:&|$)/)?.[1] ?? ""
      otpInputParsed.otpAuthUrl.issuer = element.value.match(/&issuer=(.*?)(?:&|$)/)?.[1] ?? ""
      otpInputParsed.otpAuthUrl.period = element.value.match(/&period=(.*?)$/)?.[1] ?? "30"
    }

    otpInputParsed.value = BuildOtpAuthUrl(
      "secret",
      otpInputParsed.otpAuthUrl.account,
      otpInputParsed.otpAuthUrl.issuer,
      otpInputParsed.otpAuthUrl.period
    )

    setInput(otpInputParsed)
  }

  const handleShowQrCodeButtonClick = () => {
    const otpUrl = BuildOtpAuthUrl(
      input.otpAuthUrl.secret,
      input.otpAuthUrl.account,
      input.otpAuthUrl.issuer,
      input.otpAuthUrl.period
    )

    if (!qrCode) {
      setQrCode(btoa(unescape(encodeURIComponent(createQrCode(otpUrl)))))
    } else {
      setQrCode(undefined)
    }
  }

  return (
    <form className="my-6 text-left" onSubmit={handleOnSubmit}>
      <h2>Add OTP Auth by single URl</h2>
      <InputLabel className="my-2" label="OTP Auth URI">
        {input.isOtpAuth && <InputCopy value={input.value} readonly={input.isOtpAuth} className="w-full pr-[35px]" />}
        {!input.isOtpAuth && (
          <Input
            className="w-full"
            placeholder="otpauth://totp/issuer%3Aaccount?secret=secret&issuer=issuer&period=30"
            value={input.value ?? ""}
            onChange={handleInputChange as any}
            readOnly={input.isOtpAuth}
          />
        )}
      </InputLabel>
      {input.isOtpAuth && (
        <div>
          <InputLabel className="my-2" label="account">
            <Input
              name="account"
              className="w-full"
              placeholder="john.doe"
              value={input?.otpAuthUrl?.account ?? ""}
              onChange={(e) =>
                setInput({
                  ...input,
                  value: BuildOtpAuthUrl("secret", e.target.value, input.otpAuthUrl.issuer, input.otpAuthUrl.period),
                  otpAuthUrl: { ...input.otpAuthUrl, account: e.target.value },
                })
              }
            />
          </InputLabel>
          <InputLabel className="my-2" label="issuer">
            <Input
              name="issuer"
              className="w-full"
              placeholder="google.com"
              value={input?.otpAuthUrl?.issuer ?? ""}
              onChange={(e) =>
                setInput({
                  ...input,
                  value: BuildOtpAuthUrl("secret", input.otpAuthUrl.account, e.target.value, input.otpAuthUrl.period),
                  otpAuthUrl: { ...input.otpAuthUrl, issuer: e.target.value },
                })
              }
            />
          </InputLabel>
          <InputLabel className="my-2" label="secret">
            <Input
              name="secret"
              className={classNames("w-full", !validSecret && "border-red-600 focus:border-red-600 focus:ring-red-600")}
              placeholder="30"
              type="password"
              value={input?.otpAuthUrl?.secret ?? ""}
              onChange={(e) =>
                setInput({
                  ...input,
                  value: BuildOtpAuthUrl(
                    "secret",
                    input.otpAuthUrl.account,
                    input.otpAuthUrl.issuer,
                    input.otpAuthUrl.period
                  ),
                  otpAuthUrl: { ...input.otpAuthUrl, secret: e.target.value },
                })
              }
            />
            <div className="text-xs font-bold text-red-600">
              {!validSecret && (
                <span>Invalid, use ABCDEFGHIJKLMNOPQRSTUVWXYZ234567 only with min character length 16</span>
              )}
            </div>
          </InputLabel>
          <InputLabel className="my-2" label="period">
            <Input
              name="period"
              className="w-full"
              placeholder="ABCDEFGHIJKLMNOP"
              type="number"
              value={input?.otpAuthUrl?.period ?? "30"}
              onChange={(e) =>
                setInput({
                  ...input,
                  value: BuildOtpAuthUrl("secret", input.otpAuthUrl.account, input.otpAuthUrl.issuer, e.target.value),
                  otpAuthUrl: { ...input.otpAuthUrl, period: e.target.value },
                })
              }
            />
          </InputLabel>
          {qrCode && <img width={150} height={150} src={`data:image/svg+xml;base64,${qrCode}`} />}
        </div>
      )}
      <div className="flex gap-2">
        <Button size="sm" type="submit" disabled={!input.isOtpAuth || !validSecret}>
          Save
        </Button>
        <Button
          size="sm"
          type="button"
          className="border-0 bg-gray-400 text-white hover:enabled:bg-gray-700"
          onClick={() => setInput({} as OtpInput)}
        >
          Clear
        </Button>
        {input.isOtpAuth && (
          <Button
            size="sm"
            type="button"
            disabled={!input.isOtpAuth}
            className="border-0 bg-indigo-400 text-white hover:enabled:bg-indigo-700"
            onClick={handleShowQrCodeButtonClick}
          >
            {!qrCode ? "Show" : "Hide"} QR-Code
          </Button>
        )}
      </div>
    </form>
  )
}

type AddOtpByCameraProps = {
  isToggled: boolean
  setToggle: Dispatch<SetStateAction<boolean>>
  onRenderSuccessCallback: (otpAuthUrls: string[]) => void
}

export function AddOtpByCamera({ isToggled, onRenderSuccessCallback: delegatedSuccessCallback }: AddOtpByCameraProps) {
  const onRenderSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
    delegatedSuccessCallback(OTPAuthURI(decodedText as string))
  }

  return (
    <div className="my-6 text-left">
      <h2>Add OTP Auth by QR-Code</h2>
      <BarcodeScanner onOff={isToggled} onRenderSuccessCallback={onRenderSuccessCallback} fps={100} verbose={false} />
    </div>
  )
}
