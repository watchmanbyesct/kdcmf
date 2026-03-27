import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Save, Globe, Mail, CreditCard, Building2, CheckCircle } from 'lucide-react'

interface Settings {
  [key: string]: string
}

const SETTING_GROUPS = [
  {
    id: 'general',
    label: 'General',
    icon: <Building2 size={16} />,
    fields: [
      { key: 'site_name', label: 'Organization Name', type: 'text', placeholder: 'Kingdom Dominion Covenant Ministries Fellowship' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'United in Purpose. Building the Kingdom.' },
      { key: 'presiding_bishop', label: 'Presiding Bishop', type: 'text', placeholder: 'Bishop Owens F. Shepard' },
      { key: 'contact_email', label: 'Primary Contact Email', type: 'email', placeholder: 'info@kdcmf.org' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'text', placeholder: '(000) 000-0000' },
      { key: 'address', label: 'Mailing Address', type: 'text', placeholder: '123 Main St, City, State ZIP' },
    ]
  },
  {
    id: 'events',
    label: 'Events',
    icon: <Globe size={16} />,
    fields: [
      { key: 'annual_event_name', label: 'Annual Event Name', type: 'text', placeholder: 'Annual Convocation' },
      { key: 'annual_event_description', label: 'Annual Event Description', type: 'text', placeholder: 'Our annual gathering of bishops, pastors, and leaders.' },
    ]
  },
  {
    id: 'social',
    label: 'Social Media',
    icon: <Globe size={16} />,
    fields: [
      { key: 'facebook_url', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/kdcmf' },
      { key: 'youtube_url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/@kdcmf' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/kdcmf' },
      { key: 'twitter_url', label: 'Twitter / X URL', type: 'url', placeholder: 'https://x.com/kdcmf' },
    ]
  },
  {
    id: 'email',
    label: 'Email',
    icon: <Mail size={16} />,
    fields: [
      { key: 'sendgrid_from_email', label: 'From Email Address', type: 'email', placeholder: 'no-reply@kdcmf.org' },
      { key: 'sendgrid_from_name', label: 'From Name', type: 'text', placeholder: 'KDCMF' },
      { key: 'reply_to_email', label: 'Reply-To Email', type: 'email', placeholder: 'info@kdcmf.org' },
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <CreditCard size={16} />,
    fields: [
      { key: 'stripe_public_key', label: 'Stripe Publishable Key', type: 'text', placeholder: 'pk_live_...' },
    ]
  },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeGroup, setActiveGroup] = useState('general')

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    setLoading(true)
    const { data } = await supabase.from('system_settings').select('key, value')
    if (data) {
      const map: Settings = {}
      data.forEach(row => { map[row.key] = row.value || '' })
      // Set default for annual event name
      if (!map['annual_event_name']) map['annual_event_name'] = 'Annual Convocation'
      setSettings(map)
    }
    setLoading(false)
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('system_settings')
      .upsert(upserts, { onConflict: 'key' })

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const currentGroup = SETTING_GROUPS.find(g => g.id === activeGroup)!

  return (
    <AdminLayout title="Settings" subtitle="System configuration, branding, and integrations">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-48 flex-shrink-0">
            <div className="card overflow-hidden">
              {SETTING_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-body font-medium text-left border-b border-gray-100 last:border-0 transition-colors ${
                    activeGroup === group.id
                      ? 'bg-crimson-800 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {group.icon}
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings form */}
          <div className="flex-1">
            <div className="card overflow-hidden">
              <div className="crimson-bar" />
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-display text-lg font-semibold text-crimson-900">{currentGroup.label}</h2>
              </div>
              <div className="p-6 space-y-5">
                {currentGroup.fields.map(field => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    <input
                      type={field.type}
                      className="input"
                      placeholder={field.placeholder}
                      value={settings[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                {saved ? (
                  <div className="flex items-center gap-2 text-green-600 font-body text-sm">
                    <CheckCircle size={16} />
                    Settings saved successfully
                  </div>
                ) : <div />}
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2"
                  disabled={saving}
                >
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Save size={15} />
                  }
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
