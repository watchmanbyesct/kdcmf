import { useEffect, useState, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../lib/auth'
import { Search, Plus, X, Save, Trash2, Edit, Award, Upload, File, ExternalLink, ShieldCheck, ShieldOff } from 'lucide-react'

const CREDENTIAL_TYPES = [
  { value: 'license', label: 'License' },
  { value: 'ordination', label: 'Ordination' },
  { value: 'consecration', label: 'Consecration' },
  { value: 'certification', label: 'Certification' },
  { value: 'appointment', label: 'Appointment' },
] as const

type CredentialType = (typeof CREDENTIAL_TYPES)[number]['value']

interface ProfileOption {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface CredentialRow {
  id: string
  profile_id: string
  type: CredentialType
  title: string
  issued_by: string | null
  issued_date: string | null
  expiry_date: string | null
  certificate_number: string | null
  certificate_url: string | null
  notes: string | null
  is_verified: boolean
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
  profile?: ProfileOption | null
}

const defaultForm = {
  profile_id: '',
  type: 'ordination' as CredentialType,
  title: '',
  issued_by: '',
  issued_date: '',
  expiry_date: '',
  certificate_number: '',
  certificate_url: '',
  notes: '',
  is_verified: false,
}

const BUCKET = 'fellowship-documents'

export default function AdminCredentials() {
  const { profile: adminProfile } = useAdminAuth()
  const [rows, setRows] = useState<CredentialRow[]>([])
  const [profiles, setProfiles] = useState<ProfileOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterVerified, setFilterVerified] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<CredentialRow | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const [{ data: creds, error: credErr }, { data: profs }] = await Promise.all([
      supabase
        .from('credentials')
        .select('*, profile:profiles(id, email, first_name, last_name)')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, first_name, last_name').order('last_name'),
    ])
    if (credErr) console.error(credErr)
    setRows((creds as CredentialRow[]) || [])
    setProfiles(profs || [])
    setLoading(false)
  }

  const filtered = rows.filter((r) => {
    const profile = r.profile
    const nameBits = profile
      ? `${profile.first_name} ${profile.last_name} ${profile.email}`
      : ''
    const matchSearch =
      search === '' ||
      `${r.title} ${r.issued_by || ''} ${r.certificate_number || ''} ${nameBits}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchType = filterType === 'all' || r.type === filterType
    const matchVerified =
      filterVerified === 'all' ||
      (filterVerified === 'yes' && r.is_verified) ||
      (filterVerified === 'no' && !r.is_verified)
    return matchSearch && matchType && matchVerified
  })

  const openCreate = () => {
    setEditing(null)
    setForm({
      ...defaultForm,
      profile_id: profiles[0]?.id || '',
    })
    setError('')
    setUploadProgress('')
    setShowModal(true)
  }

  const openEdit = (r: CredentialRow) => {
    setEditing(r)
    setForm({
      profile_id: r.profile_id,
      type: r.type,
      title: r.title,
      issued_by: r.issued_by || '',
      issued_date: r.issued_date ? r.issued_date.slice(0, 10) : '',
      expiry_date: r.expiry_date ? r.expiry_date.slice(0, 10) : '',
      certificate_number: r.certificate_number || '',
      certificate_url: r.certificate_url || '',
      notes: r.notes || '',
      is_verified: r.is_verified,
    })
    setError('')
    setUploadProgress('')
    setShowModal(true)
  }

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress('Uploading…')
    setError('')
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const path = `credentials/${Date.now()}_${safeName}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`)
        setUploading(false)
        setUploadProgress('')
        return
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      setForm((prev) => ({ ...prev, certificate_url: urlData.publicUrl }))
      setUploadProgress('Certificate file linked.')
      setTimeout(() => setUploadProgress(''), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    if (!form.profile_id) {
      setError('Select a member profile.')
      setSaving(false)
      return
    }
    if (!form.title.trim()) {
      setError('Title is required.')
      setSaving(false)
      return
    }

    let verified_by: string | null = editing?.verified_by ?? null
    let verified_at: string | null = editing?.verified_at ?? null
    if (form.is_verified) {
      if (!editing?.is_verified || !verified_at) {
        verified_by = adminProfile?.id ?? null
        verified_at = new Date().toISOString()
      }
    } else {
      verified_by = null
      verified_at = null
    }

    const payload = {
      profile_id: form.profile_id,
      type: form.type,
      title: form.title.trim(),
      issued_by: form.issued_by.trim() || null,
      issued_date: form.issued_date || null,
      expiry_date: form.expiry_date || null,
      certificate_number: form.certificate_number.trim() || null,
      certificate_url: form.certificate_url.trim() || null,
      notes: form.notes.trim() || null,
      is_verified: form.is_verified,
      verified_by,
      verified_at,
    }

    if (editing) {
      const { error: err } = await supabase.from('credentials').update(payload).eq('id', editing.id)
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
    } else {
      const { error: err } = await supabase.from('credentials').insert(payload)
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
    }
    setSaving(false)
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this credential record?')) return
    await supabase.from('credentials').delete().eq('id', id)
    load()
  }

  const toggleVerifiedQuick = async (r: CredentialRow) => {
    const next = !r.is_verified
    const patch = next
      ? {
          is_verified: true,
          verified_by: adminProfile?.id ?? null,
          verified_at: new Date().toISOString(),
        }
      : { is_verified: false, verified_by: null, verified_at: null }
    await supabase.from('credentials').update(patch).eq('id', r.id)
    load()
  }

  const f = (k: string, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }))

  const typeLabel = (v: string) => CREDENTIAL_TYPES.find((t) => t.value === v)?.label || v

  const formatPerson = (p?: ProfileOption | null) =>
    p ? `${p.first_name} ${p.last_name}` : '—'

  return (
    <AdminLayout
      title="Credentials"
      subtitle="Ordination, consecration, and certification records"
    >
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by member, title, issuer, or certificate #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-auto min-w-[140px]"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All types</option>
          {CREDENTIAL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          className="input w-auto min-w-[140px]"
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
        >
          <option value="all">All records</option>
          <option value="yes">Verified only</option>
          <option value="no">Unverified only</option>
        </select>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openCreate}>
          <Plus size={16} /> Add credential
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {CREDENTIAL_TYPES.map((t) => (
          <span
            key={t.value}
            className="badge-crimson text-xs capitalize"
          >
            {t.label}
          </span>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Member</th>
                <th className="table-header">Type</th>
                <th className="table-header">Title</th>
                <th className="table-header">Issued by</th>
                <th className="table-header">Dates</th>
                <th className="table-header">Certificate</th>
                <th className="table-header">Verified</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-10">
                    <div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-12">
                    <Award size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-body">
                      No credential records yet. Add ordinations, consecrations, licenses, or certifications.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{formatPerson(r.profile)}</div>
                      <div className="text-xs text-gray-400 font-body">{r.profile?.email}</div>
                    </td>
                    <td className="table-cell">
                      <span className="badge flex items-center gap-1 w-fit bg-gold-50 text-gold-800 border border-gold-200">
                        {typeLabel(r.type)}
                      </span>
                    </td>
                    <td className="table-cell max-w-[200px]">
                      <div className="font-medium text-gray-800 text-sm">{r.title}</div>
                      {r.notes && (
                        <div className="text-xs text-gray-400 font-body line-clamp-2 mt-0.5">{r.notes}</div>
                      )}
                    </td>
                    <td className="table-cell text-gray-600 text-sm">{r.issued_by || '—'}</td>
                    <td className="table-cell text-xs text-gray-500 font-body whitespace-nowrap">
                      {r.issued_date && (
                        <div>
                          Issued: {new Date(r.issued_date).toLocaleDateString()}
                        </div>
                      )}
                      {r.expiry_date && (
                        <div className={r.expiry_date < new Date().toISOString().slice(0, 10) ? 'text-amber-700 font-semibold' : ''}>
                          Expires: {new Date(r.expiry_date).toLocaleDateString()}
                        </div>
                      )}
                      {!r.issued_date && !r.expiry_date && '—'}
                    </td>
                    <td className="table-cell">
                      {r.certificate_number && (
                        <div className="text-xs text-gray-600 font-mono">{r.certificate_number}</div>
                      )}
                      {r.certificate_url ? (
                        <a
                          href={r.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-crimson-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                        >
                          <ExternalLink size={11} /> Open file
                        </a>
                      ) : (
                        !r.certificate_number && <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <button
                        type="button"
                        onClick={() => toggleVerifiedQuick(r)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 transition-colors ${
                          r.is_verified
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {r.is_verified ? (
                          <>
                            <ShieldCheck size={12} /> Verified
                          </>
                        ) : (
                          <>
                            <ShieldOff size={12} /> Pending
                          </>
                        )}
                      </button>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded transition-colors"
                          aria-label="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 font-body">
          {filtered.length} of {rows.length} records
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editing ? 'Edit credential' : 'Add credential'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Member profile *</label>
                <select
                  className="input"
                  value={form.profile_id}
                  onChange={(e) => f('profile_id', e.target.value)}
                >
                  <option value="">— Select member —</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.last_name}, {p.first_name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Credential type *</label>
                  <select
                    className="input"
                    value={form.type}
                    onChange={(e) => f('type', e.target.value as CredentialType)}
                  >
                    {CREDENTIAL_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Title *</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => f('title', e.target.value)}
                    placeholder="e.g. Episcopal ordination — Presbyter"
                  />
                </div>
              </div>

              <div>
                <label className="label">Issued by</label>
                <input
                  className="input"
                  value={form.issued_by}
                  onChange={(e) => f('issued_by', e.target.value)}
                  placeholder="Ordaining bishop, board, or institution"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Issued date</label>
                  <input
                    type="date"
                    className="input"
                    value={form.issued_date}
                    onChange={(e) => f('issued_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Expiry date</label>
                  <input
                    type="date"
                    className="input"
                    value={form.expiry_date}
                    onChange={(e) => f('expiry_date', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Certificate number</label>
                <input
                  className="input font-mono text-sm"
                  value={form.certificate_number}
                  onChange={(e) => f('certificate_number', e.target.value)}
                  placeholder="Official registry or serial number"
                />
              </div>

              <div>
                <label className="label">Certificate file or URL</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleCertificateUpload}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="btn-outline text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    Upload PDF / image
                  </button>
                  <input
                    className="input flex-1 text-sm"
                    value={form.certificate_url}
                    onChange={(e) => f('certificate_url', e.target.value)}
                    placeholder="Or paste a URL to the certificate"
                  />
                </div>
                {form.certificate_url && (
                  <a
                    href={form.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-crimson-600 hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    <File size={12} /> Preview current link
                  </a>
                )}
                {uploadProgress && (
                  <p className="text-sm text-green-600 font-body mt-2">{uploadProgress}</p>
                )}
              </div>

              <div>
                <label className="label">Internal notes</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => f('notes', e.target.value)}
                  placeholder="Administrative notes (not shown on public site unless you wire them)"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.is_verified}
                  onChange={(e) => f('is_verified', e.target.checked)}
                  className="w-4 h-4 accent-crimson-700"
                />
                <span className="text-sm font-body text-gray-700">
                  Mark as fellowship-verified (records reviewer attestation)
                </span>
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-ghost text-gray-600 border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
                disabled={saving || uploading}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                {editing ? 'Save changes' : 'Add credential'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
