import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="bg-crimson-950 text-gray-300">
      <div className="gold-bar" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center font-display font-bold text-crimson-900 text-sm">KD</div>
              <div>
                <div className="font-display font-bold text-white text-sm">Kingdom Dominion</div>
                <div className="text-gold-400 text-xs">Covenant Ministries Fellowship</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              United in Purpose. Building the Kingdom. Under the leadership of Bishop Owens F. Shepard, Presiding Bishop.
            </p>
          </div>

          {/* Fellowship */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">Fellowship</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About KDCMF', href: '/about' },
                { label: 'Leadership', href: '/leadership' },
                { label: 'Ministry Directory', href: '/ministries' },
                { label: 'Auxiliaries', href: '/auxiliaries' },
                { label: 'Join KDCMF', href: '/join' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-gold-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Training */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">Training</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Academy of Episcopal Studies', href: '/academy-of-episcopal-studies' },
                { label: 'Kingdom Dominion Institute', href: '/kingdom-dominion-institute' },
                { label: 'Events & Conferences', href: '/events' },
                { label: 'Member Portal', href: '/portal' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-gold-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
              <li><a href="mailto:info@kdcmf.org" className="hover:text-gold-400 transition-colors">info@kdcmf.org</a></li>
              <li><Link to="/login" className="hover:text-gold-400 transition-colors">Member Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="gold-bar mt-10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Kingdom Dominion Covenant Ministries Fellowship Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:text-gray-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
