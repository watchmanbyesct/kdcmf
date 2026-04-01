import { Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { KDCMF_SEAL } from '../../lib/logos'
import { Shield, BookOpen, Users, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">About KDCMF</h1>
          <p className="text-gray-200 font-body text-lg max-w-2xl mx-auto">
            A Spirit-filled covenant body united in purpose to advance the Kingdom of God.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="gold-bar w-12 mb-4" style={{ height: '3px' }} />
              <h2 className="section-title mb-4">Who We Are</h2>
              <p className="text-gray-600 font-body leading-relaxed mb-4">
                Kingdom Dominion Covenant Ministries Fellowship Inc. (KDCMF) is a nonprofit religious corporation incorporated in the State of New York under Article 10 of the Religious Corporation Law, with its original incorporation dated October 25, 2019.
              </p>
              <p className="text-gray-600 font-body leading-relaxed mb-4">
                We are a Spirit-filled covenant body of churches, pastors, leaders, and members united in purpose to advance the Kingdom of God. Founded on the strength of prayer, the sacrifice of faithful leaders, and the vision of covenant fellowship, KDCMF empowers every believer to serve with excellence and integrity.
              </p>
              <p className="text-gray-600 font-body leading-relaxed">
                Under the leadership of Bishop Owens F. Shepard, Presiding Bishop, we continue to pursue our mission to unite in faith, spread the Good News of the Kingdom, and cultivate spiritual growth and transformation throughout our fellowship and beyond.
              </p>
            </div>
            <div className="flex justify-center">
              <img src={KDCMF_SEAL} alt="KDCMF Seal" className="w-64 h-64 object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-12 h-12 bg-crimson-100 text-crimson-700 rounded-xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <h3 className="font-display text-2xl font-bold text-crimson-900 mb-3">Vision Statement</h3>
              <p className="text-gray-600 font-body leading-relaxed italic">
                "To be a unifying body of Spirit-filled ministries that empowers leaders, cultivates holiness, and advances the Kingdom of God through sound doctrine, global outreach, and covenant fellowship."
              </p>
            </div>
            <div className="card p-8">
              <div className="w-12 h-12 bg-crimson-100 text-crimson-700 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-display text-2xl font-bold text-crimson-900 mb-3">Mission Statement</h3>
              <p className="text-gray-600 font-body leading-relaxed italic">
                "Kingdom Dominion Covenant Ministries Fellowship Inc. exists to unify ministries in covenant partnership, equip spiritual leaders for effective service, uphold biblical truth, and engage communities through worship, discipleship, social action, and evangelism."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="gold-bar mx-auto w-24 mb-6" style={{ height: '3px' }} />
            <h2 className="section-title">Statement of Faith</h2>
          </div>
          <div className="card p-8 border-l-4 border-crimson-700">
            <p className="text-gray-700 font-body leading-relaxed text-lg">
              KDCMF believes in the one true and living God, revealed in three persons: Father, Son, and Holy Spirit. We affirm salvation by grace through faith in Jesus Christ, the authority of the Bible as the inspired Word of God, the work of the Holy Spirit in empowering believers, the ongoing presence of spiritual gifts, and the imminent return of our Lord Jesus Christ. We affirm the essential unity of the Body of Christ and the priesthood of all believers.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">What We Do</h2>
            <p className="section-subtitle">Building the Kingdom through covenant fellowship, equipping, and outreach.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen size={24} />,
                title: 'Leadership Development',
                desc: 'Through the Academy of Episcopal Studies and Kingdom Dominion Institute, we equip bishops, pastors, ministers, and members with the training they need to serve effectively.'
              },
              {
                icon: <Users size={24} />,
                title: 'Covenant Fellowship',
                desc: 'We bring churches, pastors, and ministries into covenant partnership rooted in biblical truth, mutual accountability, and Kingdom fellowship.'
              },
              {
                icon: <Globe size={24} />,
                title: 'Kingdom Advancement',
                desc: 'We are committed to fostering accountability, excellence in ministry, and the holistic development of churches and clergy across the globe.'
              },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <div className="w-12 h-12 bg-crimson-50 text-crimson-700 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-crimson-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Established */}
      <section className="py-16 bg-crimson-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold-400 font-display text-lg font-semibold mb-2">Established 2006 · Incorporated 2019</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            United in Purpose. Building the Kingdom.
          </h2>
          <p className="text-gray-200 font-body leading-relaxed max-w-2xl mx-auto mb-8">
            From our first conference in the summer of 2006 to our growing network of churches and ministries today, KDCMF has remained committed to the covenant fellowship that empowers every believer to serve with excellence and integrity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/leadership" className="btn-gold px-8 py-3">Meet Our Leadership</Link>
            <Link to="/join" className="btn-ghost px-8 py-3">Join the Fellowship</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
