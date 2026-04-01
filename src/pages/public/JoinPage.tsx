import { useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { CheckCircle, ChevronRight, Users, Building2, Link } from 'lucide-react'

const PLANS = [
  {
    id: 'individual-clergy',
    name: 'Individual Clergy',
    type: 'individual',
    price_monthly: 25,
    price_annually: 250,
    icon: <Users size={24} />,
    description: 'For licensed and ordained clergy seeking fellowship, accountability, and development.',
    features: [
      'Member portal access',
      'Academy of Episcopal Studies enrollment',
      'Kingdom Dominion Institute access',
      'Fellowship directory',
      'Event discounts',
      'Digital credential card',
    ],
  },
  {
    id: 'local-church',
    name: 'Local Church',
    type: 'church',
    price_monthly: 75,
    price_annually: 750,
    icon: <Building2 size={24} />,
    description: 'For local churches seeking covenant partnership with KDCMF.',
    features: [
      'Full member portal access',
      'Up to 5 clergy profiles',
      'Ministry directory listing',
      'Event registration',
      'All training portals',
      'Fellowship documents access',
      'Priority support',
    ],
    featured: true,
  },
  {
    id: 'affiliate-ministry',
    name: 'Affiliate Ministry',
    type: 'affiliate',
    price_monthly: 50,
    price_annually: 500,
    icon: <Link size={24} />,
    description: 'For ministries and para-church organizations aligned with the KDCMF vision.',
    features: [
      'Member portal access',
      'Ministry directory listing',
      'Event access',
      'Kingdom Dominion Institute',
      'Fellowship documents access',
    ],
  },
]

const defaultForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  title: '',
  church_name: '',
  church_city: '',
  church_state: '',
  plan: 'local-church',
  message: '',
}

export default function JoinPage() {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [billing] = useState<'monthly' | 'annually'>('annually')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!form.first_name || !form.last_name || !form.email) {
      setError('Please fill in all required fields.')
      setSubmitting(false)
      return
    }

    const { error: err } = await supabase.from('contact_inquiries').insert({
      name: `${form.first_name} ${form.last_name}`,
      email: form.email,
      phone: form.phone,
      subject: `Membership Application — ${PLANS.find(p => p.id === form.plan)?.name}`,
      message: `
Title: ${form.title}
Church/Ministry: ${form.church_name}
Location: ${form.church_city}, ${form.church_state}
Membership Plan: ${PLANS.find(p => p.id === form.plan)?.name}
Billing: ${billing}

Message: ${form.message}
      `.trim(),
      inquiry_type: 'membership',
    })

    if (err) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  const f = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Join the Fellowship
          </h1>
          <p className="text-gray-200 font-body text-lg max-w-2xl mx-auto">
            Whether you are a pastor, bishop, or ministry leader — there is a place for you in Kingdom Dominion Covenant Ministries Fellowship.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-4">Membership Plans</h2>
            <p className="text-gray-500 font-body">Contact us for membership pricing information.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.id}
                className={`card overflow-hidden relative ${plan.featured ? 'ring-2 ring-crimson-700 shadow-xl' : ''}`}
              >
                {plan.featured && (
                  <div className="bg-crimson-gradient text-white text-xs font-body font-bold text-center py-1.5 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <div className={plan.featured ? '' : 'crimson-bar'} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.featured ? 'bg-crimson-100 text-crimson-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-crimson-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 font-body mb-4 leading-relaxed">{plan.description}</p>



                  <ul className="space-y-2 mb-6">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-body text-gray-700">
                        <CheckCircle size={15} className="text-crimson-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setForm(prev => ({ ...prev, plan: plan.id }))
                      document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`w-full py-2.5 rounded font-body font-semibold text-sm transition-all flex items-center justify-center gap-1 ${
                      plan.featured
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                  >
                    Apply Now <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Submit Your Application</h2>
            <p className="text-gray-500 font-body">
              Complete the form below and our team will follow up within 3-5 business days.
            </p>
          </div>

          {submitted ? (
            <div className="card p-10 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-crimson-900 mb-2">Application Received</h3>
              <p className="text-gray-600 font-body">
                Thank you for your interest in KDCMF. We will review your application and be in touch within 3-5 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="crimson-bar rounded" />

              {/* Plan selector */}
              <div>
                <label className="label">Membership Plan *</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map(plan => (
                    <button key={plan.id} type="button"
                      onClick={() => f('plan', plan.id)}
                      className={`py-2 px-3 rounded border text-xs font-body font-semibold text-center transition-all ${
                        form.plan === plan.id
                          ? 'border-crimson-700 bg-crimson-50 text-crimson-800'
                          : 'border-gray-200 text-gray-600 hover:border-crimson-300'
                      }`}
                    >
                      {plan.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input className="input" value={form.first_name} onChange={e => f('first_name', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input" value={form.last_name} onChange={e => f('last_name', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Title (Bishop, Pastor, Rev., etc.)</label>
                <input className="input" value={form.title} onChange={e => f('title', e.target.value)} placeholder="Pastor, Bishop, Rev..." />
              </div>
              <div>
                <label className="label">Church / Ministry Name</label>
                <input className="input" value={form.church_name} onChange={e => f('church_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input className="input" value={form.church_city} onChange={e => f('church_city', e.target.value)} />
                </div>
                <div>
                  <label className="label">State</label>
                  <input className="input" value={form.church_state} onChange={e => f('church_state', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Tell us about yourself and your ministry</label>
                <textarea className="input" rows={4} value={form.message}
                  onChange={e => f('message', e.target.value)}
                  placeholder="Share a brief background of your ministry, how you heard about KDCMF, and what you are looking for in covenant fellowship..." />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}

              <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2" disabled={submitting}>
                {submitting
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : 'Submit Application'
                }
              </button>

              <p className="text-xs text-center text-gray-400 font-body">
                By submitting this application you agree to be contacted by KDCMF leadership regarding your membership inquiry.
              </p>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
