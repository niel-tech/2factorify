import { BarcodeFormat, BitArray, EncodeHintType, MultiFormatWriter } from "@zxing/library"
import StringBuilder from "@zxing/library/es2015/core/util/StringBuilder"

export const createQrCode = (string: string, width = 150, height = 150) => {
  const barcodeWriter = new MultiFormatWriter()
  const bitMatrix = barcodeWriter.encode(
    string,
    BarcodeFormat.QR_CODE,
    width,
    height,
    new Map<EncodeHintType, any>([
      [EncodeHintType.CHARACTER_SET, "UTF-8"],
      [EncodeHintType.ERROR_CORRECTION, "Q"],
      [EncodeHintType.MARGIN, 2],
    ])
  )

  const sbPath = new StringBuilder()
  const w = bitMatrix.getWidth()
  const h = bitMatrix.getHeight()
  let row = new BitArray(w)

  for (let y = 0; y < h; ++y) {
    row = bitMatrix.getRow(y, row)

    for (let x = 0; x < w; ++x) {
      if (row.get(x)) {
        sbPath.append(" M" + x + "," + y + "h1v1h-1z")
      }
    }
  }

  const sb = new StringBuilder()
  sb.append('<?xml version="1.0" encoding="UTF-8"?>\n')
  sb.append('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ')
    .append(w)
    .append(" ")
    .append(h)
    .append('" stroke="none">\n')
  sb.append('<style type="text/css">\n')
  sb.append(".black {fill:#000000;}\n")
  sb.append("</style>\n")
  sb.append('<path class="black"  d="').append(sbPath.toString()).append('"/>\n')
  sb.append("</svg>\n")

  return sb.toString()
}
