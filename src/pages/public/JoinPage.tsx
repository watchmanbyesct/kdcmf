import { useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { CheckCircle, ChevronRight, Users, Building2, Link } from 'lucide-react'

const PLANS = [
  {
    id: 'individual-membership',
    name: 'Individual Membership',
    type: 'individual',
    icon: <Users size={24} />,
    description: 'Open to ministers, elders, pastors, or laypersons who desire covenantal fellowship with KDCMF.',
    note: 'Individuals who are part of a local congregation must submit a pastoral recommendation. Independent ministers may apply directly with an explanation of ministerial standing.',
    features: [
      'Recognition and credentialing under KDCMF',
      'Access to ministerial training and leadership development',
      'Participation in general assemblies and convocations',
      'Oversight and support from bishops and elders',
      'Voting rights in fellowship business',
      'Access to clergy resources and continuing education',
      'Member portal access',
    ],
  },
  {
    id: 'church-membership',
    name: 'Church Membership',
    type: 'church',
    icon: <Building2 size={24} />,
    description: 'For local congregations seeking formal covenant affiliation with KDCMF.',
    note: 'Requires a Church Affiliation Resolution signed by governing board, trustees, or elders. Churches must affirm the mission, vision, and doctrinal alignment of KDCMF.',
    features: [
      'Full fellowship recognition and resources',
      'Delegate voting representation at convocations',
      'Access to all ministerial training portals',
      'Oversight and support from bishops and elders',
      'Ministry directory listing',
      'Participation in general assemblies',
      'Recognition of church autonomy — KDCMF does not govern internal operations',
    ],
    featured: true,
  },
  {
    id: 'affiliate-membership',
    name: 'Affiliate Church or Ministry',
    type: 'affiliate',
    icon: <Link size={24} />,
    description: 'For churches or parachurch organizations that wish to remain autonomous but desire limited affiliation for training, fellowship, or credentialing support.',
    note: 'Affiliates do not receive delegate voting rights unless they move into full membership.',
    features: [
      'Limited fellowship recognition',
      'Access to training and credentialing support',
      'Participation in select fellowship events',
      'Oversight and support from bishops and elders',
      'Ministry directory listing',
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
  ministerial_standing: '',
  statement_of_faith: '',
  has_pastoral_recommendation: '',
  plan: 'individual-membership',
  message: '',
  agrees_to_policies: false,
}

export default function JoinPage() {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const selectedPlan = PLANS.find(p => p.id === form.plan)!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!form.first_name || !form.last_name || !form.email) {
      setError('Please fill in all required fields.')
      setSubmitting(false)
      return
    }

    if (!form.agrees_to_policies) {
      setError('You must agree to uphold the KDCMF Constitution, Bylaws, and policies to apply.')
      setSubmitting(false)
      return
    }

    const { error: err } = await supabase.from('contact_inquiries').insert({
      name: `${form.first_name} ${form.last_name}`,
      email: form.email,
      phone: form.phone,
      subject: `Membership Application — ${selectedPlan.name}`,
      message: `
MEMBERSHIP APPLICATION

Plan: ${selectedPlan.name}
Title: ${form.title || 'N/A'}
Church/Ministry: ${form.church_name || 'N/A'}
Location: ${[form.church_city, form.church_state].filter(Boolean).join(', ') || 'N/A'}

Ministerial Standing: ${form.ministerial_standing || 'N/A'}
Statement of Faith/Mission: ${form.statement_of_faith || 'N/A'}
Pastoral Recommendation Available: ${form.has_pastoral_recommendation || 'N/A'}

Additional Information:
${form.message || 'N/A'}

Agrees to uphold KDCMF Constitution, Bylaws, and Policies: Yes
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

  const f = (k: string, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }))

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
            Whether you are a layperson, minister, pastor, bishop, or local church — there is a place for you in Kingdom Dominion Covenant Ministries Fellowship.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Membership Levels */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Levels of Membership</h2>
            <p className="text-gray-500 font-body max-w-2xl mx-auto">
              KDCMF membership is open to churches, ministries, and individuals who align with our statement of faith and code of ethics. Select the membership level that best describes your relationship with the fellowship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.id}
                className={`card overflow-hidden relative transition-all ${
                  plan.featured ? 'ring-2 ring-crimson-700 shadow-xl' : ''
                }`}
              >
                {plan.featured && (
                  <div className="bg-crimson-gradient text-white text-xs font-body font-bold text-center py-1.5 tracking-wider uppercase">
                    Most Common
                  </div>
                )}
                <div className={plan.featured ? '' : 'crimson-bar'} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.featured ? 'bg-crimson-100 text-crimson-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-crimson-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 font-body mb-3 leading-relaxed">{plan.description}</p>
                  <p className="text-xs text-gray-400 font-body italic mb-5 leading-relaxed">{plan.note}</p>

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
                      f('plan', plan.id)
                      document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`w-full py-2.5 rounded font-body font-semibold text-sm transition-all flex items-center justify-center gap-1 ${
                      plan.featured ? 'btn-primary' : 'btn-outline'
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

      {/* Requirements Banner */}
      <section className="py-10 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-crimson-900 mb-4 text-center">Application Requirements</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-body text-gray-700">
            {[
              'Completed Membership or Affiliation Form',
              'Statement of Faith and Ministry Mission',
              'Pastoral Recommendation or Church Board Resolution',
              'Initial Application Fee (as established by the Executive Council)',
              'Agreement to uphold the Constitution, Bylaws, and policies of KDCMF',
            ].map(req => (
              <div key={req} className="flex items-start gap-2">
                <CheckCircle size={15} className="text-gold-600 mt-0.5 flex-shrink-0" />
                {req}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-16 bg-white">
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
                Thank you for your interest in KDCMF. Our team will review your application and be in touch within 3-5 business days. Additional documentation may be requested as part of the review process.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="crimson-bar rounded" />

              {/* Plan selector */}
              <div>
                <label className="label">Membership Level *</label>
                <div className="space-y-2">
                  {PLANS.map(plan => (
                    <label key={plan.id}
                      className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                        form.plan === plan.id
                          ? 'border-crimson-700 bg-crimson-50'
                          : 'border-gray-200 hover:border-crimson-300'
                      }`}
                    >
                      <input type="radio" name="plan" value={plan.id}
                        checked={form.plan === plan.id}
                        onChange={e => f('plan', e.target.value)}
                        className="mt-0.5 accent-crimson-700" />
                      <div>
                        <div className={`text-sm font-semibold font-body ${form.plan === plan.id ? 'text-crimson-800' : 'text-gray-800'}`}>
                          {plan.name}
                        </div>
                        <div className="text-xs text-gray-500 font-body mt-0.5">{plan.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
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
                <label className="label">Title (Bishop, Pastor, Rev., Elder, etc.)</label>
                <input className="input" value={form.title} onChange={e => f('title', e.target.value)} placeholder="Pastor, Bishop, Rev., Elder, Minister..." />
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

              {/* Individual-specific fields */}
              {form.plan === 'individual-membership' && (
                <div>
                  <label className="label">Ministerial Standing</label>
                  <input className="input" value={form.ministerial_standing}
                    onChange={e => f('ministerial_standing', e.target.value)}
                    placeholder="e.g. Ordained Elder, Licensed Minister, Independent Pastor..." />
                  <p className="text-xs text-gray-400 font-body mt-1">
                    If you are an independent minister or pastor, briefly describe your ministerial standing.
                  </p>
                </div>
              )}

              {/* Pastoral recommendation */}
              {form.plan === 'individual-membership' && (
                <div>
                  <label className="label">Pastoral Recommendation</label>
                  <select className="input" value={form.has_pastoral_recommendation}
                    onChange={e => f('has_pastoral_recommendation', e.target.value)}>
                    <option value="">-- Select --</option>
                    <option value="yes">Yes — I can provide a pastoral recommendation</option>
                    <option value="independent">I am an independent minister applying directly</option>
                    <option value="no">No — I am a layperson seeking individual membership</option>
                  </select>
                </div>
              )}

              {/* Church resolution notice */}
              {(form.plan === 'church-membership' || form.plan === 'affiliate-membership') && (
                <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 text-sm font-body text-yellow-800">
                  <strong>Note:</strong> A Church Affiliation Resolution signed by your governing board, trustees, or elders will be required as part of the application process. Our team will provide the form upon reviewing your initial application.
                </div>
              )}

              {/* Statement of faith */}
              <div>
                <label className="label">Statement of Faith and Ministry Mission *</label>
                <textarea className="input" rows={4} value={form.statement_of_faith}
                  onChange={e => f('statement_of_faith', e.target.value)} required
                  placeholder="Briefly state your faith foundation and the mission of your ministry. Include your doctrinal position and what you are seeking through KDCMF covenant fellowship..." />
              </div>

              <div>
                <label className="label">Additional Information</label>
                <textarea className="input" rows={3} value={form.message}
                  onChange={e => f('message', e.target.value)}
                  placeholder="How did you hear about KDCMF? Any additional context you would like to share..." />
              </div>

              {/* Policy agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agrees_to_policies}
                  onChange={e => f('agrees_to_policies', e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-crimson-700 flex-shrink-0" />
                <span className="text-sm font-body text-gray-700">
                  I agree to uphold the Constitution, Bylaws, and policies of Kingdom Dominion Covenant Ministries Fellowship Inc. if accepted into membership. *
                </span>
              </label>

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}

              <button type="submit"
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                disabled={submitting}>
                {submitting
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : 'Submit Membership Application'
                }
              </button>

              <p className="text-xs text-center text-gray-400 font-body">
                All applications are reviewed by KDCMF leadership. Additional documentation may be requested. Submission of this form does not guarantee membership.
              </p>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
