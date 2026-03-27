import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminAnnouncements() {
  const titles: Record<string, {title: string, sub: string}> = {
    AdminEvents: { title: 'Events', sub: 'Manage summits, conferences, and fellowship events' },
    AdminAuxiliaries: { title: 'Auxiliaries', sub: 'Manage women, men, and youth ministry pages' },
    AdminAesCourses: { title: 'Academy of Episcopal Studies', sub: 'Courses, lessons, and enrollments' },
    AdminKdiCourses: { title: 'Kingdom Dominion Institute', sub: 'Courses, lessons, and enrollments' },
    AdminDocuments: { title: 'Documents Repository', sub: 'Constitution, bylaws, policies, and fellowship records' },
    AdminLeadership: { title: 'Leadership Directory', sub: 'Bishops, officers, and national leadership' },
    AdminBlog: { title: 'Blog & News', sub: 'Publish fellowship news and Kingdom teaching' },
    AdminGiving: { title: 'Giving & Finance', sub: 'Donations, dues, and giving funds' },
    AdminAnnouncements: { title: 'Announcements', sub: 'Fellowship-wide and targeted announcements' },
    AdminCredentials: { title: 'Credentials', sub: 'Ordination, consecration, and certification records' },
    AdminSettings: { title: 'Settings', sub: 'System settings, branding, and configuration' },
  }
  const t = titles['AdminAnnouncements'] || { title: 'AdminAnnouncements', sub: '' }

  return (
    <AdminLayout title={t.title} subtitle={t.sub}>
      <div className="card p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-crimson-900 mb-2">{t.title}</h3>
        <p className="text-gray-500 font-body text-sm mb-4">{t.sub}</p>
        <div className="inline-flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-full font-body">
          <span>Full CRUD interface — coming in next build phase</span>
        </div>
      </div>
    </AdminLayout>
  )
}
