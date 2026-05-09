import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import {
  Search,
  Plus,
  X,
  Save,
  Trash2,
  Edit,
  Heart,
  Landmark,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from 'lucide-react'

type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'

interface GivingFund {
  id: string
  name: string
  description: string | null
  stripe_price_id: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

interface ProfileMini {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface DonationRow {
  id: string
  profile_id: string | null
  fund_id: string | null
  amount: number
  currency: string
  payment_method: string
  stripe_payment_intent: string | null
  stripe_charge_id: string | null
  status: DonationStatus
  donor_name: string | null
  donor_email: string | null
  is_recurring: boolean
  stripe_subscription_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  fund?: { name: string } | null
  profile?: ProfileMini | null
}

const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Stripe / card' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'wire', label: 'Wire / ACH' },
  { value: 'other', label: 'Other' },
]

const DONATION_STATUSES: { value: DonationStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const defaultFundForm = {
  name: '',
  description: '',
  stripe_price_id: '',
  is_active: true,
  sort_order: 0,
}

const defaultDonationForm = {
  profile_id: '',
  fund_id: '',
  amount: '',
  currency: 'usd',
  payment_method: 'stripe',
  status: 'completed' as DonationStatus,
  donor_name: '',
  donor_email: '',
  is_recurring: false,
  notes: '',
  stripe_payment_intent: '',
  stripe_charge_id: '',
  stripe_subscription_id: '',
}

function formatMoney(amount: number, currency = 'usd') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch {
    return `$${Number(amount).toFixed(2)}`
  }
}

export default function AdminGiving() {
  const [tab, setTab] = useState<'funds' | 'donations'>('funds')
  const [funds, setFunds] = useState<GivingFund[]>([])
  const [donations, setDonations] = useState<DonationRow[]>([])
  const [profiles, setProfiles] = useState<ProfileMini[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterFund, setFilterFund] = useState('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [fundModal, setFundModal] = useState(false)
  const [editingFund, setEditingFund] = useState<GivingFund | null>(null)
  const [fundForm, setFundForm] = useState(defaultFundForm)
  const [fundSaving, setFundSaving] = useState(false)
  const [fundError, setFundError] = useState('')

  const [donationModal, setDonationModal] = useState(false)
  const [editingDonation, setEditingDonation] = useState<DonationRow | null>(null)
  const [donationForm, setDonationForm] = useState(defaultDonationForm)
  const [donationSaving, setDonationSaving] = useState(false)
  const [donationError, setDonationError] = useState('')

  async function fetchGivingData() {
    const [{ data: f }, { data: d }, { data: p }] = await Promise.all([
      supabase.from('giving_funds').select('*').order('sort_order').order('name'),
      supabase
        .from('donations')
        .select('*, fund:giving_funds(name), profile:profiles(id, email, first_name, last_name)')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, first_name, last_name').order('last_name'),
    ])
    return {
      funds: (f || []) as GivingFund[],
      donations: (d || []) as DonationRow[],
      profiles: (p || []) as ProfileMini[],
    }
  }

  async function load(showSpinner = true) {
    if (showSpinner) setLoading(true)
    const data = await fetchGivingData()
    setFunds(data.funds)
    setDonations(data.donations)
    setProfiles(data.profiles)
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const data = await fetchGivingData()
      if (cancelled) return
      setFunds(data.funds)
      setDonations(data.donations)
      setProfiles(data.profiles)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const completedTotal = donations
    .filter((x) => x.status === 'completed')
    .reduce((s, x) => s + Number(x.amount), 0)
  const pendingTotal = donations
    .filter((x) => x.status === 'pending')
    .reduce((s, x) => s + Number(x.amount), 0)

  const filteredDonations = donations.filter((r) => {
    const profile = r.profile
    const donorBits = `${r.donor_name || ''} ${r.donor_email || ''}`
    const profileBits = profile ? `${profile.first_name} ${profile.last_name} ${profile.email}` : ''
    const matchSearch =
      search === '' ||
      `${donorBits} ${profileBits} ${r.notes || ''} ${r.fund?.name || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchFund = filterFund === 'all' || r.fund_id === filterFund
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchFund && matchStatus
  })

  const ff = (k: string, v: unknown) => setFundForm((prev) => ({ ...prev, [k]: v }))
  const df = (k: string, v: unknown) => setDonationForm((prev) => ({ ...prev, [k]: v }))

  const openFundCreate = () => {
    setEditingFund(null)
    setFundForm({ ...defaultFundForm, sort_order: funds.length })
    setFundError('')
    setFundModal(true)
  }

  const openFundEdit = (g: GivingFund) => {
    setEditingFund(g)
    setFundForm({
      name: g.name,
      description: g.description || '',
      stripe_price_id: g.stripe_price_id || '',
      is_active: g.is_active,
      sort_order: g.sort_order,
    })
    setFundError('')
    setFundModal(true)
  }

  const saveFund = async () => {
    setFundSaving(true)
    setFundError('')
    if (!fundForm.name.trim()) {
      setFundError('Fund name is required.')
      setFundSaving(false)
      return
    }
    const payload = {
      name: fundForm.name.trim(),
      description: fundForm.description.trim() || null,
      stripe_price_id: fundForm.stripe_price_id.trim() || null,
      is_active: fundForm.is_active,
      sort_order: Number(fundForm.sort_order) || 0,
    }
    if (editingFund) {
      const { error: err } = await supabase.from('giving_funds').update(payload).eq('id', editingFund.id)
      if (err) {
        setFundError(err.message)
        setFundSaving(false)
        return
      }
    } else {
      const { error: err } = await supabase.from('giving_funds').insert(payload)
      if (err) {
        setFundError(err.message)
        setFundSaving(false)
        return
      }
    }
    setFundSaving(false)
    setFundModal(false)
    load()
  }

  const deleteFund = async (id: string) => {
    if (!confirm('Delete this giving fund? Donations linked to it may lose their fund reference.')) return
    await supabase.from('giving_funds').delete().eq('id', id)
    load()
  }

  const toggleFundActive = async (g: GivingFund) => {
    await supabase.from('giving_funds').update({ is_active: !g.is_active }).eq('id', g.id)
    load()
  }

  const openDonationCreate = () => {
    setEditingDonation(null)
    setDonationForm({
      ...defaultDonationForm,
      fund_id: funds[0]?.id || '',
    })
    setDonationError('')
    setDonationModal(true)
  }

  const openDonationEdit = (r: DonationRow) => {
    setEditingDonation(r)
    setDonationForm({
      profile_id: r.profile_id || '',
      fund_id: r.fund_id || '',
      amount: String(r.amount),
      currency: r.currency || 'usd',
      payment_method: r.payment_method || 'stripe',
      status: r.status,
      donor_name: r.donor_name || '',
      donor_email: r.donor_email || '',
      is_recurring: r.is_recurring,
      notes: r.notes || '',
      stripe_payment_intent: r.stripe_payment_intent || '',
      stripe_charge_id: r.stripe_charge_id || '',
      stripe_subscription_id: r.stripe_subscription_id || '',
    })
    setDonationError('')
    setDonationModal(true)
  }

  const saveDonation = async () => {
    setDonationSaving(true)
    setDonationError('')
    const amt = parseFloat(donationForm.amount)
    if (!donationForm.amount || Number.isNaN(amt) || amt <= 0) {
      setDonationError('Enter a valid amount greater than zero.')
      setDonationSaving(false)
      return
    }
    const payload = {
      profile_id: donationForm.profile_id || null,
      fund_id: donationForm.fund_id || null,
      amount: amt,
      currency: donationForm.currency.trim().toLowerCase() || 'usd',
      payment_method: donationForm.payment_method,
      status: donationForm.status,
      donor_name: donationForm.donor_name.trim() || null,
      donor_email: donationForm.donor_email.trim() || null,
      is_recurring: donationForm.is_recurring,
      notes: donationForm.notes.trim() || null,
      stripe_payment_intent: donationForm.stripe_payment_intent.trim() || null,
      stripe_charge_id: donationForm.stripe_charge_id.trim() || null,
      stripe_subscription_id: donationForm.stripe_subscription_id.trim() || null,
    }
    if (editingDonation) {
      const { error: err } = await supabase.from('donations').update(payload).eq('id', editingDonation.id)
      if (err) {
        setDonationError(err.message)
        setDonationSaving(false)
        return
      }
    } else {
      const { error: err } = await supabase.from('donations').insert(payload)
      if (err) {
        setDonationError(err.message)
        setDonationSaving(false)
        return
      }
    }
    setDonationSaving(false)
    setDonationModal(false)
    load()
  }

  const deleteDonation = async (id: string) => {
    if (!confirm('Delete this donation record?')) return
    await supabase.from('donations').delete().eq('id', id)
    load()
  }

  /** Quick reconcile: flip between pending and completed (Stripe-style settled vs unsettled). */
  const toggleDonationPendingCompleted = async (r: DonationRow) => {
    if (r.status === 'failed' || r.status === 'refunded') return
    const next: DonationStatus = r.status === 'completed' ? 'pending' : 'completed'
    await supabase.from('donations').update({ status: next }).eq('id', r.id)
    load()
  }

  const statusBadge = (s: DonationStatus) => {
    switch (s) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            <CheckCircle2 size={12} /> Completed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            <Clock size={12} /> Pending
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
            <XCircle size={12} /> Failed
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            <RotateCcw size={12} /> Refunded
          </span>
        )
      default:
        return <span className="text-xs text-gray-500">{s}</span>
    }
  }

  const donorDisplay = (r: DonationRow) => {
    if (r.profile) return `${r.profile.first_name} ${r.profile.last_name}`
    if (r.donor_name) return r.donor_name
    return '—'
  }

  const donorEmailDisplay = (r: DonationRow) => r.profile?.email || r.donor_email || '—'

  return (
    <AdminLayout title="Giving & Finance" subtitle="Donations, dues, and giving funds">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-50 text-green-700">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-body uppercase tracking-wide">Completed gifts</div>
            <div className="font-display text-lg font-semibold text-crimson-900">
              {formatMoney(completedTotal)}
            </div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-body uppercase tracking-wide">Pending total</div>
            <div className="font-display text-lg font-semibold text-crimson-900">
              {formatMoney(pendingTotal)}
            </div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-crimson-50 text-crimson-700">
            <Landmark size={22} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-body uppercase tracking-wide">Active funds</div>
            <div className="font-display text-lg font-semibold text-crimson-900">
              {funds.filter((f) => f.is_active).length} / {funds.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-gray-200 pb-px">
        <button
          type="button"
          onClick={() => setTab('funds')}
          className={`px-4 py-2 text-sm font-semibold font-body rounded-t-lg border-b-2 transition-colors ${
            tab === 'funds'
              ? 'border-crimson-700 text-crimson-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Giving funds
        </button>
        <button
          type="button"
          onClick={() => setTab('donations')}
          className={`px-4 py-2 text-sm font-semibold font-body rounded-t-lg border-b-2 transition-colors ${
            tab === 'donations'
              ? 'border-crimson-700 text-crimson-900 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Donations
        </button>
      </div>

      {tab === 'funds' && (
        <>
          <div className="flex justify-end mb-5">
            <button type="button" className="btn-primary flex items-center gap-2" onClick={openFundCreate}>
              <Plus size={16} /> Add fund
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Fund</th>
                    <th className="table-header">Description</th>
                    <th className="table-header">Stripe price ID</th>
                    <th className="table-header">Order</th>
                    <th className="table-header">Active</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="table-cell text-center py-10">
                        <div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : funds.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="table-cell text-center py-12">
                        <Heart size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-body">No giving funds yet. Create funds donors can give toward.</p>
                      </td>
                    </tr>
                  ) : (
                    funds.map((g) => (
                      <tr key={g.id} className="table-row">
                        <td className="table-cell font-medium text-gray-900">{g.name}</td>
                        <td className="table-cell text-sm text-gray-500 max-w-xs truncate">{g.description || '—'}</td>
                        <td className="table-cell text-xs font-mono text-gray-500">{g.stripe_price_id || '—'}</td>
                        <td className="table-cell text-gray-600 text-sm">{g.sort_order}</td>
                        <td className="table-cell">
                          <button
                            type="button"
                            onClick={() => toggleFundActive(g)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {g.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="table-cell">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openFundEdit(g)}
                              className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFund(g.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
          </div>
        </>
      )}

      {tab === 'donations' && (
        <>
          <div className="flex flex-col lg:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input pl-9"
                placeholder="Search donor, email, fund, notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="input w-auto min-w-[160px]" value={filterFund} onChange={(e) => setFilterFund(e.target.value)}>
              <option value="all">All funds</option>
              {funds.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <select className="input w-auto min-w-[140px]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {DONATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button type="button" className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openDonationCreate}>
              <Plus size={16} /> Record donation
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Date</th>
                    <th className="table-header">Donor</th>
                    <th className="table-header">Fund</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Method</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="table-cell text-center py-10">
                        <div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="table-cell text-center py-12">
                        <Landmark size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-body">No donations match your filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((r) => (
                      <tr key={r.id} className="table-row">
                        <td className="table-cell text-sm text-gray-600 whitespace-nowrap">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="table-cell">
                          <div className="font-medium text-gray-900 text-sm">{donorDisplay(r)}</div>
                          <div className="text-xs text-gray-400 font-body">{donorEmailDisplay(r)}</div>
                          {r.is_recurring && (
                            <span className="text-[10px] uppercase tracking-wide text-gold-700 font-semibold">Recurring</span>
                          )}
                        </td>
                        <td className="table-cell text-sm text-gray-600">{r.fund?.name || '—'}</td>
                        <td className="table-cell font-semibold text-gray-900">{formatMoney(Number(r.amount), r.currency)}</td>
                        <td className="table-cell text-xs text-gray-500 capitalize">{r.payment_method}</td>
                        <td className="table-cell">
                          {r.status === 'pending' || r.status === 'completed' ? (
                            <button
                              type="button"
                              onClick={() => toggleDonationPendingCompleted(r)}
                              className="hover:opacity-90"
                              title="Toggle pending / completed"
                            >
                              {statusBadge(r.status)}
                            </button>
                          ) : (
                            statusBadge(r.status)
                          )}
                        </td>
                        <td className="table-cell">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openDonationEdit(r)}
                              className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteDonation(r.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
              {filteredDonations.length} of {donations.length} records
            </div>
          </div>
        </>
      )}

      {/* Fund modal */}
      {fundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editingFund ? 'Edit giving fund' : 'Add giving fund'}
              </h2>
              <button type="button" onClick={() => setFundModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Fund name *</label>
                <input className="input" value={fundForm.name} onChange={(e) => ff('name', e.target.value)} placeholder="General Fellowship Fund" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={fundForm.description} onChange={(e) => ff('description', e.target.value)} />
              </div>
              <div>
                <label className="label">Stripe price ID</label>
                <input
                  className="input font-mono text-sm"
                  value={fundForm.stripe_price_id}
                  onChange={(e) => ff('stripe_price_id', e.target.value)}
                  placeholder="price_…"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Sort order</label>
                  <input
                    type="number"
                    className="input"
                    value={fundForm.sort_order}
                    onChange={(e) => ff('sort_order', parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-7">
                  <input
                    type="checkbox"
                    checked={fundForm.is_active}
                    onChange={(e) => ff('is_active', e.target.checked)}
                    className="w-4 h-4 accent-crimson-700"
                  />
                  <span className="text-sm font-body text-gray-700">Active (shown publicly)</span>
                </label>
              </div>
              {fundError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{fundError}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button type="button" onClick={() => setFundModal(false)} className="btn-ghost text-gray-600 border border-gray-300">
                Cancel
              </button>
              <button type="button" onClick={saveFund} className="btn-primary flex items-center gap-2" disabled={fundSaving}>
                {fundSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation modal */}
      {donationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editingDonation ? 'Edit donation' : 'Record donation'}
              </h2>
              <button type="button" onClick={() => setDonationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Linked member (optional)</label>
                  <select className="input" value={donationForm.profile_id} onChange={(e) => df('profile_id', e.target.value)}>
                    <option value="">— Guest / no profile —</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.last_name}, {p.first_name} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Giving fund</label>
                  <select className="input" value={donationForm.fund_id} onChange={(e) => df('fund_id', e.target.value)}>
                    <option value="">— Unspecified —</option>
                    {funds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="label">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={donationForm.amount}
                    onChange={(e) => df('amount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="label">Currency</label>
                  <input className="input" value={donationForm.currency} onChange={(e) => df('currency', e.target.value)} placeholder="usd" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={donationForm.status} onChange={(e) => df('status', e.target.value as DonationStatus)}>
                    {DONATION_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Payment method</label>
                <select className="input" value={donationForm.payment_method} onChange={(e) => df('payment_method', e.target.value)}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Donor name (if no profile)</label>
                  <input className="input" value={donationForm.donor_name} onChange={(e) => df('donor_name', e.target.value)} />
                </div>
                <div>
                  <label className="label">Donor email</label>
                  <input className="input" type="email" value={donationForm.donor_email} onChange={(e) => df('donor_email', e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationForm.is_recurring}
                  onChange={(e) => df('is_recurring', e.target.checked)}
                  className="w-4 h-4 accent-crimson-700"
                />
                <span className="text-sm font-body text-gray-700">Recurring / subscription gift</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Stripe payment intent</label>
                  <input
                    className="input font-mono text-xs"
                    value={donationForm.stripe_payment_intent}
                    onChange={(e) => df('stripe_payment_intent', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Stripe charge ID</label>
                  <input className="input font-mono text-xs" value={donationForm.stripe_charge_id} onChange={(e) => df('stripe_charge_id', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Stripe subscription ID</label>
                <input
                  className="input font-mono text-xs"
                  value={donationForm.stripe_subscription_id}
                  onChange={(e) => df('stripe_subscription_id', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Internal notes</label>
                <textarea className="input" rows={2} value={donationForm.notes} onChange={(e) => df('notes', e.target.value)} />
              </div>
              {donationError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{donationError}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button type="button" onClick={() => setDonationModal(false)} className="btn-ghost text-gray-600 border border-gray-300">
                Cancel
              </button>
              <button type="button" onClick={saveDonation} className="btn-primary flex items-center gap-2" disabled={donationSaving}>
                {donationSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
