import { Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { Shield, BookOpen, GraduationCap, Users, Calendar, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-crimson-gradient min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '30px 30px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
          {/* Crown/Shield Badge */}
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 text-gold-300 px-4 py-1.5 rounded-full text-sm font-body font-medium mb-8">
            <Shield size={14} />
            Under the Leadership of Bishop Owens F. Shepard, Presiding Bishop
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Kingdom Dominion<br />
            <span className="text-gold-400">Covenant Ministries</span><br />
            Fellowship
          </h1>

          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            A Spirit-filled covenant body of churches, pastors, leaders, and members united in purpose to advance the Kingdom of God.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/join" className="btn-gold text-base px-8 py-3">
              Join the Fellowship
            </Link>
            <Link to="/about" className="btn-ghost text-base px-8 py-3">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { label: 'Member Churches', value: 'Growing' },
              { label: 'Years of Fellowship', value: '18+' },
              { label: 'Training Institutions', value: '2' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-gold-400">{s.value}</div>
                <div className="text-gray-300 text-xs font-body mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-8" />
          <blockquote className="font-display text-2xl md:text-3xl text-crimson-900 font-medium leading-relaxed italic">
            "United in Purpose. Building the Kingdom."
          </blockquote>
          <p className="mt-6 text-gray-600 font-body text-lg leading-relaxed max-w-2xl mx-auto">
            We are founded on the strength of prayer, the sacrifice of faithful leaders, and the vision of covenant fellowship that empowers every believer to serve with excellence and integrity.
          </p>
          <div className="gold-bar mx-auto w-24 mt-8" />
        </div>
      </section>

      {/* Ministry Pillars */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">What We Do</h2>
            <p className="section-subtitle max-w-xl mx-auto">Equipping leaders, strengthening churches, and advancing the Kingdom through covenant relationship.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap size={28} />,
                title: 'Academy of Episcopal Studies',
                desc: 'Rigorous training for bishops and aspiring episcopal leaders in theology, governance, and pastoral care.',
                href: '/academy-of-episcopal-studies',
                color: 'bg-crimson-50 text-crimson-700'
              },
              {
                icon: <BookOpen size={28} />,
                title: 'Kingdom Dominion Institute',
                desc: 'Discipleship and ministry training for pastors, ministers, and believers at every stage of their journey.',
                href: '/kingdom-dominion-institute',
                color: 'bg-gold-50 text-gold-700'
              },
              {
                icon: <Users size={28} />,
                title: 'Covenant Fellowship',
                desc: 'A unified network of churches, ministries, and leaders in covenant partnership for mutual accountability and Kingdom advance.',
                href: '/ministries',
                color: 'bg-crimson-50 text-crimson-700'
              },
            ].map(item => (
              <Link key={item.title} to={item.href}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-crimson-900 mb-2 group-hover:text-crimson-700 transition-colors">{item.title}</h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">{item.desc}</p>
                <span className="text-crimson-700 text-sm font-semibold font-body inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Auxiliaries */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Fellowship Auxiliaries</h2>
            <p className="section-subtitle">Ministry for every member of the body.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Her Voice His Glory", tag: "Women's Ministry", slug: 'her-voice-his-glory', desc: 'Empowering women to walk in their God-given purpose with excellence and integrity.' },
              { name: "The King's Men Fellowship", tag: "Men's Ministry", slug: 'kings-men-fellowship', desc: 'Raising men of character, covenant, and Kingdom purpose to lead their families and communities.' },
              { name: "Kingdom Forward", tag: "Youth Ministry", slug: 'kingdom-forward', desc: 'Equipping the next generation of Kingdom leaders with faith, vision, and purpose.' },
            ].map(aux => (
              <Link key={aux.slug} to={`/auxiliaries/${aux.slug}`}
                className="card group hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="bg-crimson-gradient h-2" />
                <div className="p-6">
                  <span className="text-xs font-semibold font-body text-gold-600 uppercase tracking-wider">{aux.tag}</span>
                  <h3 className="font-display text-xl font-bold text-crimson-900 mt-1 mb-2 group-hover:text-crimson-700 transition-colors">{aux.name}</h3>
                  <p className="text-gray-600 font-body text-sm leading-relaxed">{aux.desc}</p>
                  <div className="mt-4 text-crimson-700 text-sm font-semibold font-body inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Visit Ministry <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/auxiliaries" className="btn-outline">View All Auxiliaries</Link>
          </div>
        </div>
      </section>

      {/* Events CTA */}
      <section className="py-20 bg-crimson-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Calendar size={40} className="text-gold-400 mx-auto mb-4" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">Annual Summit & Events</h2>
          <p className="text-gray-200 font-body text-lg mb-8 max-w-xl mx-auto">
            Join us for transformative fellowship, dynamic worship, and powerful teaching at our annual conferences and events.
          </p>
          <Link to="/events" className="btn-gold text-base px-8 py-3">View Upcoming Events</Link>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title mb-4">Ready to Join the Fellowship?</h2>
          <p className="section-subtitle mb-8">
            Whether you are a pastor, bishop, or member church — there is a place for you in Kingdom Dominion Covenant Ministries Fellowship.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/join" className="btn-primary text-base px-8 py-3">Apply for Membership</Link>
            <Link to="/contact" className="btn-outline text-base px-8 py-3">Ask a Question</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
