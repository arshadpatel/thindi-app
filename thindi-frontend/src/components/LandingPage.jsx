import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  function handleVendorLogin() {
    // TODO: point to the real vendor login page once it exists.
    navigate('/vendor/login')
  }

  return (
    <main className="landing-page">
      <section className="landing-content">
        <h1 className="landing-title">Welcome to Thindi</h1>
        <p className="landing-subtitle">
          Skip the canteen queue. Scan, order, and pay in seconds.
        </p>
        <button
          type="button"
          className="landing-button"
          onClick={handleVendorLogin}
        >
          Vendor Login
        </button>
      </section>
    </main>
  )
}

export default LandingPage