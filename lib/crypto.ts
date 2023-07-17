import CryptoJS from "crypto-js"
import JsSHA from "jssha"

export function randomBytes() {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
}

export function generateSHA1(str: string, key: string) {
  //return CryptoJS.HmacSHA1(string, key).toString(CryptoJS.enc.Hex)
  const shaObj = new JsSHA("SHA-1", "HEX", {
    hmacKey: { value: key, format: "HEX" },
  })
  shaObj.update(str)
  return shaObj.getHMAC("HEX")
}

export function generateMd5Hash(string: string) {
  return CryptoJS.MD5(string.trim().toLowerCase()).toString()
}

export function generateHashedString(
  string: string,
  key: string = process.env.NEXT_PUBLIC_SECURE_KEY as string
): string {
  const hmac = CryptoJS.SHA256(string + key)
  return hmac.toString(CryptoJS.enc.Hex)
}

export function encryptText(text: string, key: string) {
  const aes = CryptoJS.AES.encrypt(text, key)
  return aes.toString()
}

export function decryptText(text: string, key: string) {
  const aes = CryptoJS.AES.decrypt(text, key)
  return aes.toString(CryptoJS.enc.Utf8)
}
