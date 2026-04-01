import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, Calendar, Eye, EyeOff, MapPin, Video } from 'lucide-react'

const EVENT_TYPES = [
  { value: 'convocation', label: 'Annual Convocation' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'summit', label: 'Convocation' },
  { value: 'training', label: 'Training' },
  { value: 'auxiliary', label: 'Auxiliary Event' },
  { value: 'general', label: 'General' },
]

const defaultForm = {
  title: '',
  slug: '',
  type: 'general',
  description: '',
  full_description: '',
  start_date: '',
  end_date: '',
  location_name: '',
  location_address: '',
  location_city: '',
  location_state: '',
  is_virtual: false,
  virtual_link: '',
  registration_required: false,
  registration_deadline: '',
  max_capacity: '',
  price: '0',
  status: 'upcoming',
  is_featured: false,
  is_published: false,
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  const filtered = events.filter(e => {
    const matchSearch = search === '' ||
      `${e.title} ${e.location_city || ''} ${e.location_state || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || e.status === filterStatus
    return matchSearch && matchStatus
  })

  const openCreate = () => {
    setEditing(null)
    setForm(defaultForm)
    setActiveTab('details')
    setError('')
    setShowModal(true)
  }

  const openEdit = (e: any) => {
    setEditing(e)
    setForm({
      title: e.title, slug: e.slug, type: e.type,
      description: e.description || '', full_description: e.full_description || '',
      start_date: e.start_date ? e.start_date.slice(0, 16) : '',
      end_date: e.end_date ? e.end_date.slice(0, 16) : '',
      location_name: e.location_name || '', location_address: e.location_address || '',
      location_city: e.location_city || '', location_state: e.location_state || '',
      is_virtual: e.is_virtual || false, virtual_link: e.virtual_link || '',
      registration_required: e.registration_required || false,
      registration_deadline: e.registration_deadline ? e.registration_deadline.slice(0, 16) : '',
      max_capacity: e.max_capacity || '', price: e.price || '0',
      status: e.status, is_featured: e.is_featured, is_published: e.is_published,
    })
    setActiveTab('details')
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    if (!form.title || !form.start_date || !form.end_date) {
      setError('Title, start date, and end date are required.')
      setSaving(false)
      return
    }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      price: parseFloat(form.price) || 0,
      max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
      registration_deadline: form.registration_deadline || null,
    }
    if (editing) {
      const { error: err } = await supabase.from('events').update(payload).eq('id', editing.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('events').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false)
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  const togglePublished = async (e: any) => {
    await supabase.from('events').update({ is_published: !e.is_published }).eq('id', e.id)
    load()
  }

  const f = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      upcoming: 'bg-blue-100 text-blue-700',
      registration_coming_soon: 'bg-amber-100 text-amber-700',
      open: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-600',
      completed: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700',
      draft: 'bg-yellow-100 text-yellow-700',
    }
    return map[status] || 'bg-gray-100 text-gray-600'
  }

  const tabs = ['details', 'location', 'registration']

  return (
    <AdminLayout title="Events" subtitle="Convocations, conferences, and fellowship events">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search events..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="registration_coming_soon">Registration Coming Soon</option>
                    <option value="registration_coming_soon">Registration Coming Soon</option>
          <option value="open">Open Registration</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openCreate}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Events table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Event</th>
                <th className="table-header">Type</th>
                <th className="table-header">Dates</th>
                <th className="table-header">Location</th>
                <th className="table-header">Status</th>
                <th className="table-header">Published</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-cell text-center py-10">
                  <div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="table-cell text-center py-12">
                  <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-body">No events found. Add your first event.</p>
                </td></tr>
              ) : filtered.map(e => (
                <tr key={e.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{e.title}</div>
                    {e.is_featured && <span className="text-xs text-gold-600 font-body">★ Featured</span>}
                  </td>
                  <td className="table-cell">
                    <span className="badge-crimson capitalize">{
                      EVENT_TYPES.find(t => t.value === e.type)?.label || e.type
                    }</span>
                  </td>
                  <td className="table-cell text-gray-500 text-xs">
                    <div>{formatDate(e.start_date)}</div>
                    <div className="text-gray-400">to {formatDate(e.end_date)}</div>
                  </td>
                  <td className="table-cell text-gray-500 text-sm">
                    {e.is_virtual ? (
                      <span className="flex items-center gap-1 text-blue-600"><Video size={12} /> Virtual</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        {[e.location_city, e.location_state].filter(Boolean).join(', ') || e.location_name || '—'}
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <span className={`badge capitalize ${statusColor(e.status)}`}>{e.status}</span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => togglePublished(e)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        e.is_published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                      {e.is_published ? <><Eye size={12} /> Live</> : <><EyeOff size={12} /> Draft</>}
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(e)}
                        className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(e.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 font-body">
          {filtered.length} of {events.length} events
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editing ? 'Edit Event' : 'Add Event'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-body font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-crimson-700 text-crimson-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <>
                  <div>
                    <label className="label">Event Title *</label>
                    <input className="input" value={form.title}
                      onChange={e => f('title', e.target.value)}
                      placeholder="KDCMF Annual Convocation 2026" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Event Type</label>
                      <select className="input" value={form.type} onChange={e => f('type', e.target.value)}>
                        {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select className="input" value={form.status} onChange={e => f('status', e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="upcoming">Upcoming</option>
          <option value="registration_coming_soon">Registration Coming Soon</option>
                    <option value="registration_coming_soon">Registration Coming Soon</option>
                        <option value="open">Open Registration</option>
                        <option value="closed">Registration Closed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Start Date & Time *</label>
                      <input type="datetime-local" className="input" value={form.start_date}
                        onChange={e => f('start_date', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">End Date & Time *</label>
                      <input type="datetime-local" className="input" value={form.end_date}
                        onChange={e => f('end_date', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Short Description</label>
                    <textarea className="input" rows={2} value={form.description}
                      onChange={e => f('description', e.target.value)}
                      placeholder="Brief summary shown in event listings..." />
                  </div>
                  <div>
                    <label className="label">Full Description</label>
                    <textarea className="input" rows={4} value={form.full_description}
                      onChange={e => f('full_description', e.target.value)}
                      placeholder="Full event details, schedule, speakers..." />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured}
                        onChange={e => f('is_featured', e.target.checked)}
                        className="w-4 h-4 accent-crimson-700" />
                      <span className="text-sm font-body text-gray-700">Featured event</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_published}
                        onChange={e => f('is_published', e.target.checked)}
                        className="w-4 h-4 accent-crimson-700" />
                      <span className="text-sm font-body text-gray-700">Published (visible on site)</span>
                    </label>
                  </div>
                </>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input type="checkbox" checked={form.is_virtual}
                      onChange={e => f('is_virtual', e.target.checked)}
                      className="w-4 h-4 accent-crimson-700" />
                    <span className="text-sm font-body font-medium text-gray-700">This is a virtual event</span>
                  </label>
                  {form.is_virtual ? (
                    <div>
                      <label className="label">Virtual Meeting Link</label>
                      <input className="input" value={form.virtual_link}
                        onChange={e => f('virtual_link', e.target.value)}
                        placeholder="https://zoom.us/j/..." />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="label">Venue Name</label>
                        <input className="input" value={form.location_name}
                          onChange={e => f('location_name', e.target.value)}
                          placeholder="Convention Center, Church Name..." />
                      </div>
                      <div>
                        <label className="label">Street Address</label>
                        <input className="input" value={form.location_address}
                          onChange={e => f('location_address', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">City</label>
                          <input className="input" value={form.location_city}
                            onChange={e => f('location_city', e.target.value)} />
                        </div>
                        <div>
                          <label className="label">State</label>
                          <input className="input" value={form.location_state}
                            onChange={e => f('location_state', e.target.value)} />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Registration Tab */}
              {activeTab === 'registration' && (
                <>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input type="checkbox" checked={form.registration_required}
                      onChange={e => f('registration_required', e.target.checked)}
                      className="w-4 h-4 accent-crimson-700" />
                    <span className="text-sm font-body font-medium text-gray-700">Registration required</span>
                  </label>
                  {form.registration_required && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">Registration Deadline</label>
                          <input type="datetime-local" className="input" value={form.registration_deadline}
                            onChange={e => f('registration_deadline', e.target.value)} />
                        </div>
                        <div>
                          <label className="label">Max Capacity</label>
                          <input type="number" className="input" value={form.max_capacity}
                            onChange={e => f('max_capacity', e.target.value)}
                            placeholder="Leave blank for unlimited" />
                        </div>
                      </div>
                      <div>
                        <label className="label">Registration Fee ($)</label>
                        <input type="number" step="0.01" className="input" value={form.price}
                          onChange={e => f('price', e.target.value)}
                          placeholder="0.00 for free" />
                        <p className="text-xs text-gray-400 font-body mt-1">Enter 0 for a free event.</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)}
                className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
                {saving
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Save size={15} />}
                {editing ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
