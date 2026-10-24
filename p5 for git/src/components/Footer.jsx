import { useState } from 'react'
import { Facebook, Twitter, Instagram } from 'lucide-react'

const footerColumns = [
  { id: 1, title: 'Explore', links: ['Home', 'Questions', 'Articles', 'Tutorials'] },
  { id: 2, title: 'Support', links: ['FAQs', 'Help', 'Contact Us'] },
]

// Migrated from your original <script> subscribe handler — same /subscribe
// endpoint on your Express backend, now driven by React state instead of
// direct DOM manipulation.
function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error' | 'loading' | null
  const [isLoading, setIsLoading] = useState(false)

  // Frontend email format validator matching backend standards
  const isValidEmail = (val) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(val)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()

    // Prevent duplicate submissions while a request is in flight
    if (isLoading) return

    const trimmedEmail = email.trim()

    // Client-side validation
    if (!trimmedEmail) {
      setMessage('Email address is required.')
      setStatus('error')
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setMessage('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setIsLoading(true)
    setMessage('Subscribing...')
    setStatus('loading')

    try {
      const response = await fetch('/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      // Safely parse JSON response
      let data = null
      try {
        data = await response.json()
      } catch (jsonErr) {
        console.warn('Backend returned non-JSON response:', jsonErr)
      }

      if (response.ok && data?.success) {
        setStatus('success')
        setMessage(data.message || 'Successfully subscribed! A welcome email has been sent.')
        setEmail('')
      } else {
        setStatus('error')
        if (data?.message) {
          setMessage(data.message)
        } else if (response.status === 400) {
          setMessage('Please enter a valid email address.')
        } else if (response.status === 409) {
          setMessage('This email is already subscribed.')
        } else if (response.status >= 500) {
          setMessage('Server error. Please try again later.')
        } else {
          setMessage(`Subscription failed (HTTP ${response.status}). Please try again later.`)
        }
      }
    } catch (error) {
      console.error('Subscription network error:', error)
      setStatus('error')
      setMessage('Unable to connect to the server. Please verify the backend is running and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer id="contact" className="bg-teal-700 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-10 py-5 border-b border-white/20">
        <span className="font-bold tracking-wide">SIGN UP FOR OUR DAILY INSIDER</span>
        <form className="flex gap-2" onSubmit={handleSubscribe} noValidate>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
            required
            aria-label="Email address for newsletter"
            className="px-3 py-2 rounded text-black min-w-[220px] disabled:bg-gray-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <button
            id="newsletter-submit-btn"
            type="submit"
            disabled={isLoading}
            className="bg-gray-100 text-teal-700 font-semibold px-5 py-2 rounded hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>

      {message && (
        <div
          id="newsletter-message"
          role="status"
          aria-live="polite"
          className={`text-center px-4 pt-3 font-semibold ${
            status === 'success'
              ? 'text-green-300'
              : status === 'error'
              ? 'text-red-300'
              : 'text-teal-100'
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap justify-around gap-6 px-10 py-8">
        {footerColumns.map((col) => (
          <div key={col.id}>
            <h4 className="mb-3 font-semibold">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-teal-50 hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 font-semibold">Stay connected</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="bg-white/15 p-1.5 rounded">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="bg-white/15 p-1.5 rounded">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="bg-white/15 p-1.5 rounded">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center px-4 py-4 border-t border-white/20">
        <p className="font-semibold mb-2">DEV@Deakin 2026</p>
        <div className="flex justify-center gap-4 text-sm">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Code of Conduct</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
