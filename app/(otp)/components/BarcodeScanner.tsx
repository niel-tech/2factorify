"use client"

import { Html5QrcodeResult, Html5QrcodeScanner } from "html5-qrcode"
import { useEffect } from "react"
import { Html5QrcodeError } from "html5-qrcode/core"
import { QrDimensionFunction, QrDimensions } from "html5-qrcode/src/core"

const qrcodeRegionId = "html5qr-code-full-region"

type BarcodeScannerProps = {
  onOff: boolean
  fps: number | undefined
  onRenderSuccessCallback: (decodedText: string, result: Html5QrcodeResult) => any
  onRenderErrorCallback?: (errorMessage: string, error: Html5QrcodeError) => any
  qrbox?: number | QrDimensions | QrDimensionFunction | undefined
  aspectRatio?: number | undefined
  disableFlip?: boolean | undefined
  verbose?: boolean
}

export default function BarcodeScanner({
  onOff,
  onRenderSuccessCallback,
  onRenderErrorCallback,
  fps,
  qrbox,
  aspectRatio,
  disableFlip,
  verbose = false,
  ...props
}: BarcodeScannerProps) {
  const onRenderSuccess = (decodedText: string, result: Html5QrcodeResult) => {
    onRenderSuccessCallback(decodedText, result)
  }

  const onRenderError = (errorMessage: string, error: Html5QrcodeError) => {
    onRenderErrorCallback?.(errorMessage, error)
  }

  useEffect(() => {
    localStorage.removeItem("HTML5_QRCODE_DATA")
    const barcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, { fps, qrbox, aspectRatio, disableFlip }, verbose)

    if (onOff === false) {
      barcodeScanner
        .clear()
        .catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error)
        })
        .then(() => console.log("Barcode scanner cleared"))
    }

    barcodeScanner.render(onRenderSuccess, onRenderError)

    return () => {
      localStorage.removeItem("HTML5_QRCODE_DATA")

      barcodeScanner
        .clear()
        .catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error)
        })
        .then(() => console.log("Barcode scanner cleared and unmounted"))
    }
  }, [onOff, aspectRatio, disableFlip, fps, qrbox, verbose])

  return <div id={qrcodeRegionId} {...props}></div>
}
