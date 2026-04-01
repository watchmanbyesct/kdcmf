import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import {
  LayoutDashboard, Users, Building2, Calendar, Star,
  GraduationCap, FileText, Newspaper,
  Heart, Megaphone, Settings, LogOut,
  ChevronDown, ChevronRight, Menu, X, Cross
} from 'lucide-react'

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
  { label: 'Members', href: '/admin/members', icon: <Users size={16} /> },
  { label: 'Ministries', href: '/admin/ministries', icon: <Building2 size={16} /> },
  { label: 'Leadership', href: '/admin/leadership', icon: <Star size={16} /> },
  {
    label: 'Training',
    icon: <GraduationCap size={16} />,
    children: [
      { label: 'Academy of Episcopal Studies', href: '/admin/aes-courses' },
      { label: 'Kingdom Dominion Institute', href: '/admin/kdi-courses' },
      { label: 'Credentials', href: '/admin/credentials' },
    ]
  },
  { label: 'Events', href: '/admin/events', icon: <Calendar size={16} /> },
  { label: 'Auxiliaries', href: '/admin/auxiliaries', icon: <Cross size={16} /> },
  { label: 'Documents', href: '/admin/documents', icon: <FileText size={16} /> },
  { label: 'Blog & News', href: '/admin/blog', icon: <Newspaper size={16} /> },
  { label: 'Giving', href: '/admin/giving', icon: <Heart size={16} /> },
  { label: 'Announcements', href: '/admin/announcements', icon: <Megaphone size={16} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={16} /> },
]

export default function AdminSidebar() {
  const { profile, logout } = useAdminAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(['Training'])
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label])
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={KDCMF_SEAL} alt="KDCMF" className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gold-400/40" />
          {!collapsed && (
            <div>
              <div className="font-display font-bold text-white text-sm leading-tight">KDCMF</div>
              <div className="text-gold-400 text-xs font-body">Admin Console</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => toggleGroup(item.label)}
                className="nav-item-inactive w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && (
                  openGroups.includes(item.label) ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                )}
              </button>
              {openGroups.includes(item.label) && !collapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children.map(child => (
                    <Link key={child.href} to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={isActive(child.href) ? 'nav-item-active text-xs py-2' : 'nav-item-inactive text-xs py-2'}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={item.href} to={item.href!}
              onClick={() => setMobileOpen(false)}
              className={isActive(item.href!) ? 'nav-item-active' : 'nav-item-inactive'}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && profile && (
          <div className="mb-2 px-2">
            <div className="text-xs font-semibold text-white font-body">{profile.first_name} {profile.last_name}</div>
            <div className="text-xs text-gray-400 font-body capitalize">{profile.role}</div>
          </div>
        )}
        <button onClick={logout}
          className="nav-item-inactive w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-crimson-950 border-r border-white/10 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 h-screen sticky top-0`}>
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-crimson-800 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-crimson-700 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} className="-rotate-90" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-crimson-950 border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={KDCMF_SEAL} alt="KDCMF" className="w-7 h-7 rounded-full object-cover border border-gold-400/40" />
          <span className="font-display text-white font-bold text-sm">KDCMF Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="w-64 bg-crimson-950 h-full overflow-y-auto pt-14">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
