// Extracts a vendor id from the text encoded in a vendor's QR code.
//
// Supported payloads:
//   thindi://vendor/<id>            thindi:vendor:<id>
//   https://<host>/vendor/<id>      https://<host>/vendors/<id>
//   https://<host>/menu?vendor=<id> (also vendorId=<id>)
//   <id>                            (bare id: letters, digits, "_" or "-")
//
// Returns the vendor id string, or null if the payload is not a vendor code.

const VENDOR_ID_PATTERN = /^[A-Za-z0-9_-]{3,64}$/

export function parseVendorCode(rawValue) {
  if (typeof rawValue !== 'string') return null
  const value = rawValue.trim()
  if (!value) return null

  if (VENDOR_ID_PATTERN.test(value)) return value

  const schemeMatch = value.match(/^thindi:(?:\/\/)?vendor[:/]([A-Za-z0-9_-]{3,64})\/?$/i)
  if (schemeMatch) return schemeMatch[1]

  let url
  try {
    url = new URL(value)
  } catch {
    return null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const pathMatch = url.pathname.match(/\/vendors?\/([A-Za-z0-9_-]{3,64})\/?$/i)
  if (pathMatch) return pathMatch[1]

  const queryId = url.searchParams.get('vendor') ?? url.searchParams.get('vendorId')
  if (queryId && VENDOR_ID_PATTERN.test(queryId)) return queryId

  return null
}