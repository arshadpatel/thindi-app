import { useRef, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { parseVendorCode } from '../utils/parseVendorCode'
import './QRScanner.css'

function describeCameraError(error) {
  switch (error?.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Camera access was blocked. Allow camera permission in your browser settings and try again.'
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'No camera was found on this device.'
    case 'NotReadableError':
      return 'The camera is in use by another app. Close it and try again.'
    case 'SecurityError':
      return 'Camera access needs a secure (HTTPS) connection.'
    default:
      return 'Could not start the camera. Please try again.'
  }
}

// Scans a vendor-specific QR code with the device camera.
//
// Props:
//   onVendorScan(vendorId, rawValue) - called once when a valid vendor QR is read
//   onCancel()                       - optional; shows a Cancel button when provided
function QRScanner({ onVendorScan, onCancel }) {
  const [cameraError, setCameraError] = useState(null)
  const [scanMessage, setScanMessage] = useState(null)
  const handledRef = useRef(false)
  const lastInvalidRef = useRef(null)

  function handleScan(detectedCodes) {
    if (handledRef.current || !detectedCodes?.length) return

    const rawValue = detectedCodes[0].rawValue
    const vendorId = parseVendorCode(rawValue)

    if (vendorId) {
      handledRef.current = true
      setScanMessage(null)
      onVendorScan(vendorId, rawValue)
      return
    }

    // Only update state when the unrecognised code changes, so a QR held in
    // front of the camera does not trigger a re-render on every frame.
    if (lastInvalidRef.current !== rawValue) {
      lastInvalidRef.current = rawValue
      setScanMessage(`Not a Thindi vendor code. Scanned text: ${rawValue}`)
    }
  }

  function handleError(error) {
    setCameraError(describeCameraError(error))
  }

  if (cameraError) {
    return (
      <div className="qr-scanner" role="alert">
        <p className="qr-scanner__error">{cameraError}</p>
        <div className="qr-scanner__actions">
          <button type="button" onClick={() => setCameraError(null)}>
            Try again
          </button>
          {onCancel && (
            <button type="button" className="qr-scanner__secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="qr-scanner">
      <div className="qr-scanner__viewport">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          formats={['qr_code']}
          constraints={{ facingMode: 'environment' }}
          scanDelay={300}
          sound={false}
        />
      </div>
      <p className="qr-scanner__hint">Point your camera at the vendor&apos;s QR code</p>
      {scanMessage && (
        <p className="qr-scanner__warning" role="status">
          {scanMessage}
        </p>
      )}
      {onCancel && (
        <div className="qr-scanner__actions">
          <button type="button" className="qr-scanner__secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default QRScanner