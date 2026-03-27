import { useMemberAuth } from '../../lib/auth'
import { Link } from 'react-router-dom'

export default function MemberProfile() {
  const { profile, logout } = useMemberAuth()
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-crimson-900 text-white px-6 py-4 flex items-center justify-between'>
        <span className='font-display font-bold'>KDCMF Member Portal &mdash; Profile</span>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-300'>{profile?.first_name} {profile?.last_name}</span>
          <button onClick={logout} className='text-xs text-gray-400 hover:text-white'>Sign Out</button>
        </div>
      </div>
      <div className='max-w-4xl mx-auto px-4 py-12 text-center'>
        <h1 className='section-title mb-4'>Profile</h1>
        <p className='text-gray-500'>Full member portal coming in next phase.</p>
        <Link to='/portal' className='btn-primary mt-6 inline-block'>Dashboard</Link>
      </div>
    </div>
  )
}
