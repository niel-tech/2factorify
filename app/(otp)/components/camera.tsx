"use client"

import { useEffect, useRef, useState } from "react"
import { Camera as CamCorder } from "react-camera-pro"
import * as NextImage from "next/image"
import { Button } from "../../../components/Button/Button"

export default function Camera() {
  const camera = useRef(null)
  const [numberOfCameras, setNumberOfCameras] = useState(1)
  const [deviceId, setDeviceId] = useState<string>()
  const [image, setImage] = useState(null)
  const [ratio, setRatio] = useState(9 / 16)

  useEffect(() => {
    const setUserMedia = async () => {
      const userMedia = await navigator.mediaDevices.enumerateDevices()
      if (userMedia?.filter((deviceInfo) => deviceInfo.kind === "videoinput")?.length > 0)
        setDeviceId(userMedia.filter((deviceInfo) => deviceInfo.kind === "videoinput")[0].deviceId)
    }
    setUserMedia()
  }, [])

  const switchCamera = async () => {
    const userMedia = await navigator.mediaDevices.enumerateDevices()
    const videoInputMedia = userMedia?.filter((deviceInfo) => deviceInfo.kind === "videoinput")
    console.log(videoInputMedia)
    if (videoInputMedia?.filter((deviceInfo) => deviceInfo.deviceId !== deviceId)?.length > 0) {
      const currentCamIndex = videoInputMedia?.findIndex((deviceInfo) => deviceInfo.deviceId === deviceId)
      const getNextCamIndex = currentCamIndex === videoInputMedia?.length - 1 ? 0 : currentCamIndex + 1

      setDeviceId(videoInputMedia[getNextCamIndex as keyof object]?.deviceId)
    }
  }

  const capture = () => {
    if (!camera?.current) return
    const cam = camera.current as any
    setImage(cam.takePhoto())
  }

  const rotateImage = (imageBase64: string, rotation: any, cb: any) => {
    const img = new Image()
    img.src = imageBase64
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(img, 0, 0)
      cb(canvas.toDataURL("image/jpeg"))
    }
  }

  return (
    <div className="my-1 grid">
      {deviceId && (
        <div className="relative">
          <CamCorder
            ref={camera}
            numberOfCamerasCallback={setNumberOfCameras}
            videoSourceDeviceId={deviceId}
            facingMode="user"
            aspectRatio={ratio}
            errorMessages={{}}
          />
          <Button
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-0 bg-gray-300 p-1 font-bold text-gray-700 hover:enabled:bg-gray-300"
            onClick={switchCamera}
            alt="Switch camera"
          >
            &#8635;
          </Button>
        </div>
      )}
      {image && <NextImage.default src={image} width="70" height="70" alt="Logo" />}
      <button onClick={capture}>capture</button>
    </div>
  )
}
