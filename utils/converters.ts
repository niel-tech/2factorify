export const base32ToHex = (base32: string) => {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const bits = base32
    .split("")
    .map((char) => {
      const val = base32chars.indexOf(char.toUpperCase())
      if (val < 0) {
        throw new Error("Illegal Base32 character: " + char)
      }
      return val
    })
    .map((val) => val.toString(2).padStart(5, "0"))
    .join("")

  return bits
    .match(/.{4}/g)
    ?.map((chunk) => parseInt(chunk, 2).toString(16))
    .join("")
}

export const decToHex = (dec: number) => dec.toString(16)

export const hexToDec = (hex: string) => parseInt(hex, 16)
