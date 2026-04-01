import { useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { Mail, MapPin, CheckCircle } from 'lucide-react'

const INQUIRY_TYPES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'membership', label: 'Membership Information' },
  { value: 'ministry', label: 'Ministry Partnership' },
  { value: 'media', label: 'Media & Press' },
  { value: 'speaking', label: 'Speaking Request' },
]

const defaultForm = {
  name: '', email: '', phone: '', subject: '', message: '', inquiry_type: 'general'
}

export default function ContactPage() {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      setSubmitting(false)
      return
    }
    const { error: err } = await supabase.from('contact_inquiries').insert(form)
    if (err) { setError('Something went wrong. Please try again.'); setSubmitting(false); return }
    setSubmitted(true)
    setSubmitting(false)
  }

  const f = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <PublicLayout>
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-200 font-body text-lg max-w-xl mx-auto">
            We would love to hear from you. Reach out with questions, partnership inquiries, or media requests.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-crimson-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600 font-body text-sm leading-relaxed">
                  For membership inquiries, please visit our <a href="/join" className="text-crimson-600 hover:underline font-semibold">Join page</a>. For all other inquiries, use the form or contact us directly.
                </p>
              </div>
              {[
                { icon: <Mail size={18} />, label: 'Email', value: 'info@kdcmf.org', href: 'mailto:info@kdcmf.org' },
                { icon: <MapPin size={18} />, label: 'Location', value: 'Rochester, New York', href: null },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-crimson-50 text-crimson-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 font-body uppercase tracking-wider">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-crimson-700 font-body font-medium hover:underline text-sm">{item.value}</a>
                    ) : (
                      <div className="text-gray-700 font-body text-sm">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="card p-4 bg-crimson-50 border-crimson-100">
                <p className="text-xs font-body text-crimson-800 leading-relaxed">
                  <strong>Media Inquiries:</strong> All press and media inquiries must be directed to the Office of the Presiding Bishop. Only the Presiding Bishop or a designated Communications Officer may speak on behalf of KDCMF.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="card p-10 text-center">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-crimson-900 mb-2">Message Received</h3>
                  <p className="text-gray-600 font-body">Thank you for reaching out. A member of our team will respond within 3-5 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8 space-y-4">
                  <div className="crimson-bar rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input className="input" value={form.name} onChange={e => f('name', e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Phone</label>
                      <input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Inquiry Type</label>
                      <select className="input" value={form.inquiry_type} onChange={e => f('inquiry_type', e.target.value)}>
                        {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input className="input" value={form.subject} onChange={e => f('subject', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea className="input" rows={5} value={form.message} onChange={e => f('message', e.target.value)} required />
                  </div>
                  {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
                  <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
                    {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
