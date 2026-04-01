import { Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { BISHOP_SEAL } from '../../lib/logos'
import { Shield, BookOpen, Users, Globe } from 'lucide-react'

const BISHOP_PHOTO = 'https://static.wixstatic.com/media/b47fa4_8ca4af2d17c04dd595fd2dafbb5fcd26~mv2.jpg'
const SUCCESSION_LINEAGE = 'https://static.wixstatic.com/media/b47fa4_4a32fc449fd14e08945621755e8a2cd5~mv2.png'

export default function AboutPage() {
  return (
    <PublicLayout>

      {/* ── HERO ── */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            About KDCMF
          </h1>
          <p className="text-gray-200 font-body text-lg max-w-2xl mx-auto">
            A Spirit-filled covenant body united in purpose to advance the Kingdom of God.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* ── WELCOME FROM THE PRESIDING BISHOP ── */}
      <section className="py-16 bg-crimson-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Photo */}
            <div className="flex flex-col items-center text-center">
              <img
                src={BISHOP_PHOTO}
                alt="Bishop Owens F. Shepard"
                className="w-72 h-auto rounded-2xl border border-gold-400/40 shadow-2xl object-cover"
              />
              <p className="text-gold-400 font-body font-semibold mt-4 text-sm">
                Bishop Owens F. Shepard<br />
                <span className="text-gray-400 font-normal">Presiding Bishop, KDCMF</span>
              </p>
            </div>
            {/* Message */}
            <div>
              <div className="gold-bar w-12 mb-4" style={{ height: '3px' }} />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gold-400 mb-4">
                Welcome to Kingdom Dominion Covenant Ministries Fellowship Inc.
              </h2>
              <p className="text-gray-200 font-body leading-relaxed mb-4">
                Grace and peace in the name of our Lord Jesus Christ. We are a covenant body of Spirit-filled ministries committed to advancing the Kingdom, cultivating holiness, and empowering leaders for effective service.
              </p>
              <p className="text-gray-200 font-body leading-relaxed mb-4">
                As you explore this site, you will find our mission, leadership, and resources designed to strengthen churches and serve communities.
              </p>
              <p className="text-gold-400 font-body italic mb-1">
                "Building together in unity, holiness, and purpose."
              </p>
              <p className="text-gold-500 font-body font-semibold text-sm">
                — Bishop Owens F. Shepard, Presiding Bishop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
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

      {/* ── STATEMENT OF FAITH ── */}
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

      {/* ── OUR HISTORY ── */}
      <section className="py-16 bg-crimson-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="gold-bar mx-auto w-24 mb-6" style={{ height: '3px' }} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Our History</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gold-300/30">
            <div className="space-y-5 text-gray-700 font-body leading-relaxed">
              <p>
                In the fall of 2006, a group of visionary leaders gathered in Rochester, New York — Bishop Gerald West-Phipps, Bishop Benjamin G. Finney, Bishop Rufus McGee, Bishop David J. Singleton, Pastor Robert Livingston, Elder Marcus Hill, and Elder Jerome Livingston. Their shared mission was to create a fellowship that would support smaller churches, church plants, and mid-sized congregations and ministries often overlooked by larger national organizations.
              </p>
              <p>
                The fellowship was the vision of Bishop West-Phipps, who worked alongside Bishop Finney, the first Presiding Bishop, and Bishop McGee, who served as First Assistant. Pastor Singleton was appointed Bishop Designate, with plans to become Adjutant Bishop. That same year, the inaugural <strong>Kingdom Dominion Covenant Ministries Fellowship Conference</strong> drew more than 200 attendees and featured instructors such as Bishop Will Compton and Bishop Ronald Hoston. Dr. James L. Cherry Sr. was honored as Bishop for his lasting influence on the founders and pastors across the region.
              </p>
              <p>
                In the months that followed, the fellowship grew rapidly, hosting picnics, fellowship trips, and welcoming new members, including Pastor John Young and Pastor Shirley Roberts. By 2007, Bishop McGee had become Presiding Bishop, and Robert Livingston was elevated to the episcopacy. However, when Bishops West-Phipps and Singleton withdrew later that year, the organization entered a brief period of dormancy.
              </p>
              <p>
                Renewal came in 2012 when Bishop West-Phipps began reorganizing the fellowship. New consecrations followed with Bishop Jerome Livingston as First Assistant Presiding Bishop in 2012, and Bishops Jeremy L. Butler and Carrie Cox in 2016, as the fellowship was officially reestablished under Bishop West-Phipps as Presiding Bishop. He appointed new executive and national officers, restoring momentum and unity. Among the emerging leaders were Bishop Robert L. Livingston, Bishop David Singleton, Bishop Jeremy L. Butler, Bishop Owens F. Shepard, Bishop Willie F. Davis, and Bishop Christopher Bryant.
              </p>
              <p>
                In 2018, the fellowship entered a new era of growth and excellence. Rev. Dr. Jon McReynolds succeeded Bishop James L. Cherry Sr. as Pastor of Aenon Baptist Church and was consecrated as Second Presiding Bishop. Mother Joyce Rufus was named Mother of the Fellowship, and Libby Swoope became Sacred Arts Coordinator. That same year, the <strong>Refreshing Conference</strong> and <strong>Bishop's Annual Ball &amp; Reception</strong> were introduced, with Pastor Dwayne Jordan of Albuquerque, New Mexico, serving as the inaugural Gala speaker.
              </p>
              <p>
                Kingdom Dominion Covenant Ministries Fellowship Inc. was formally incorporated in the State of New York on October 25, 2019, under Article 10 of the Religious Corporation Law, with its principal office in Rochester, New York.
              </p>
              <p className="text-crimson-700 font-semibold">
                From its humble beginnings to its present impact, Kingdom Dominion Covenant Ministries Fellowship continues to honor its founding vision — to serve, strengthen, and uplift the local church with integrity, excellence, and covenant unity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FELLOWSHIP LEADERSHIP ── */}
      <section className="py-16 bg-crimson-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="gold-bar mx-auto w-24 mb-6" style={{ height: '3px' }} />
            <h2 className="font-display text-3xl font-bold text-gold-400 mb-2">Fellowship Leadership</h2>
            <p className="text-gray-400 font-body">Guided by episcopal order, accountability, and unity across all jurisdictions.</p>
          </div>

          {/* Current Leadership */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { role: 'Presiding Bishop', name: 'Bishop Owens F. Shepard' },
              { role: 'Chief Advisor to the Presider', name: 'Bishop Jonathan McReynolds' },
            ].map(l => (
              <div key={l.name} className="bg-white/5 border border-gold-400/30 rounded-xl p-5">
                <div className="text-gold-400 font-body font-bold text-sm mb-1">{l.role}</div>
                <div className="text-white font-body font-semibold">{l.name}</div>
              </div>
            ))}
          </div>

          {/* Executive Council */}
          <h3 className="font-display text-xl font-bold text-gold-400 mb-4">Executive Council</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { role: 'First Assistant Presiding Bishop', name: 'Bishop Marcus Hill' },
              { role: 'Second Assistant Presiding Bishop', name: 'Bishop Charles Middleton, Jr.' },
              { role: 'Third Assistant Presiding Bishop', name: 'Bishop Jerome Livingston' },
              { role: 'Executive Bishop', name: 'Bishop Dan Butler' },
              { role: 'General Treasurer', name: 'Pastor Shirley Roberts' },
            ].map(l => (
              <div key={l.name} className="bg-white/5 border border-gold-400/30 rounded-xl p-5">
                <div className="text-gold-400 font-body font-bold text-sm mb-1">{l.role}</div>
                <div className="text-white font-body font-semibold">{l.name}</div>
              </div>
            ))}
          </div>

          {/* Past Leaders */}
          <h3 className="font-display text-xl font-bold text-gold-400 mb-4">Past Leaders</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Founder and Presider Emeritus', name: 'Bishop Gerald West Phipps' },
              { role: 'Past Presider', name: 'Archbishop Benjamin Finney' },
              { role: 'Past Presider', name: 'Bishop Rufus McGee' },
              { role: 'Past Presider', name: 'Bishop Frederick K. Johnson' },
            ].map(l => (
              <div key={l.name} className="bg-white/5 border border-gold-400/20 rounded-xl p-5">
                <div className="text-gold-400/80 font-body text-xs font-semibold mb-1">{l.role}</div>
                <div className="text-gray-200 font-body font-semibold text-sm">{l.name}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/leadership" className="btn-gold px-8 py-3">View Full Leadership Directory</Link>
          </div>
        </div>
      </section>

      {/* ── APOSTOLIC SUCCESSION ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="card p-6 text-center">
              <img
                src={BISHOP_SEAL}
                alt="Seal of the Bishop — Kingdom Dominion CMF"
                className="w-64 h-auto mx-auto object-contain"
              />
              <p className="text-sm text-gray-500 font-body mt-3">
                Seal of the Bishop · Kingdom Dominion Covenant Ministries Fellowship
              </p>
            </div>
            <div>
              <div className="gold-bar w-12 mb-4" style={{ height: '3px' }} />
              <h2 className="section-title mb-4">Apostolic Succession</h2>
              <p className="text-gray-600 font-body leading-relaxed">
                At Kingdom Dominion Covenant Ministries Fellowship, we deeply value the sacred tradition of apostolic succession. Each bishop consecrated under our apostolic seal is genuinely ordained, possessing impeccable credentials that reflect our unwavering commitment to ecclesiastical integrity and the highest standards of spiritual leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUCCESSION LINEAGE ── */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="gold-bar mx-auto w-24 mb-6" style={{ height: '3px' }} />
            <h2 className="section-title mb-2">Our Succession Lineage</h2>
            <p className="text-gray-500 font-body">A visual overview of our episcopal lineage and consecrations.</p>
          </div>
          <div className="card p-4 shadow-xl">
            <img
              src={SUCCESSION_LINEAGE}
              alt="Visual lineage of KDCMF apostolic succession"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-16 bg-white">
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

      {/* ── CTA ── */}
      <section className="py-16 bg-crimson-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold-400 font-display text-lg font-semibold mb-2">
            Established 2006 · Incorporated 2019
          </p>
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
