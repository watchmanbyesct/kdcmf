import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/about' },
  {
    label: 'Fellowship',
    children: [
      { label: 'Leadership', href: '/leadership' },
      { label: 'Ministries', href: '/ministries' },
      { label: 'Auxiliaries', href: '/auxiliaries' },
    ]
  },
  {
    label: 'Training',
    children: [
      { label: 'Academy of Episcopal Studies', href: '/academy-of-episcopal-studies' },
      { label: 'Kingdom Dominion Institute', href: '/kingdom-dominion-institute' },
    ]
  },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
]

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()

  const isActive = (href: string) => location.pathname === href

  return (
    <header className="bg-crimson-900 shadow-lg sticky top-0 z-50">
      <div className="crimson-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-display font-bold text-crimson-900 text-sm group-hover:bg-gold-400 transition-colors">
              KD
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-sm leading-tight">Kingdom Dominion</div>
              <div className="text-gold-400 text-xs font-body">Covenant Ministries Fellowship</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-body font-medium text-gray-200 hover:text-white hover:bg-crimson-800 rounded transition-colors">
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                      {link.children.map(child => (
                        <Link key={child.href} to={child.href}
                          className="block px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-crimson-50 hover:text-crimson-800 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} to={link.href!}
                  className={`px-3 py-2 text-sm font-body font-medium rounded transition-colors ${
                    isActive(link.href!) ? 'bg-crimson-800 text-white' : 'text-gray-200 hover:text-white hover:bg-crimson-800'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/login" className="text-sm font-body font-medium text-gray-300 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/join" className="btn-gold text-sm py-2 px-4">
              Join KDCMF
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-crimson-950 border-t border-crimson-800 px-4 pb-4">
          {navLinks.map(link =>
            link.children ? (
              <div key={link.label}>
                <div className="py-2 text-xs font-semibold uppercase tracking-wider text-gold-500 font-body mt-3">
                  {link.label}
                </div>
                {link.children.map(child => (
                  <Link key={child.href} to={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 pl-3 text-sm font-body text-gray-300 hover:text-white"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.href} to={link.href!}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-body font-medium text-gray-200 hover:text-white border-b border-crimson-800 last:border-0"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm text-center py-2">
              Sign In
            </Link>
            <Link to="/join" onClick={() => setMobileOpen(false)} className="btn-gold text-sm text-center py-2">
              Join KDCMF
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
