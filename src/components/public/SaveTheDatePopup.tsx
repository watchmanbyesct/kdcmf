import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { SAVE_THE_DATE_2026 } from '../../lib/logos'

const STORAGE_KEY = 'kdcmf_std_2026_dismissed'
const AUTO_CLOSE_MS = 8000 // 8 seconds

export default function SaveTheDatePopup() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Don't show if already dismissed in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return

    // Small delay before showing
    const showTimer = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible) return

    // Progress bar countdown
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / AUTO_CLOSE_MS) * 100)
      setProgress(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 50)

    // Auto close
    const closeTimer = setTimeout(() => {
      handleClose()
    }, AUTO_CLOSE_MS)

    return () => {
      clearInterval(interval)
      clearTimeout(closeTimer)
    }
  }, [visible])

  const handleClose = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-crimson-950 rounded-2xl overflow-hidden shadow-2xl border border-gold-400/40 animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'popupIn 0.4s ease-out' }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-crimson-900">
          <div
            className="h-full bg-gold-500 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Image — clickable link to events */}
        <Link to="/events" onClick={handleClose}>
          <img
            src={SAVE_THE_DATE_2026}
            alt="Save the Date — KDCMF Convocation 2026"
            className="w-full h-auto block hover:opacity-95 transition-opacity cursor-pointer"
          />
        </Link>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-gold-400 font-display font-bold text-sm">KDCMF Convocation 2026</p>
            <p className="text-gray-400 font-body text-xs mt-0.5">Click the image for details and registration</p>
          </div>
          <Link
            to="/events"
            onClick={handleClose}
            className="btn-gold text-xs py-2 px-4 flex-shrink-0 ml-4"
          >
            Learn More
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  )
}
