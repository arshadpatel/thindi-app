import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import QRScanner from './components/QRScanner'
import LandingPage from './components/LandingPage'
import './App.css'

function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [vendorId, setVendorId] = useState(null)

  function handleVendorScan(scannedVendorId) {
    setVendorId(scannedVendorId)
    setScanning(false)
  }

  return (
    <main style={{ padding: '24px 16px', textAlign: 'center' }}>
      <h1>Thindi</h1>

      {scanning ? (
        <QRScanner
          onVendorScan={handleVendorScan}
          onCancel={() => setScanning(false)}
        />
      ) : (
        <>
          {vendorId ? (
            // TODO: replace with navigation to the vendor's menu page once it exists.
            <p>
              Scanned vendor: <strong>{vendorId}</strong>
            </p>
          ) : (
            <p>Scan a vendor&apos;s QR code to see their menu.</p>
          )}
          <button type="button" onClick={() => setScanning(true)}>
            {vendorId ? 'Scan another vendor' : 'Scan vendor QR'}
          </button>
        </>
      )}
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/scan" element={<ScanPage />} />
    </Routes>
  )
}

export default App