import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import LeadershipPage from './pages/public/LeadershipPage'
import MinistriesPage from './pages/public/MinistriesPage'
import EventsPage from './pages/public/EventsPage'
import AuxiliariesPage from './pages/public/AuxiliariesPage'
import AuxiliaryDetailPage from './pages/public/AuxiliaryDetailPage'
import AcademyPage from './pages/public/AcademyPage'
import KdiPage from './pages/public/KdiPage'
import ContactPage from './pages/public/ContactPage'
import JoinPage from './pages/public/JoinPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import StayConnectedPage from './pages/public/StayConnectedPage'
import EventRegisterPage from './pages/public/EventRegisterPage'

// Admin
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMembers from './pages/admin/AdminMembers'
import AdminMinistries from './pages/admin/AdminMinistries'
import AdminEvents from './pages/admin/AdminEvents'
import AdminAuxiliaries from './pages/admin/AdminAuxiliaries'
import AdminAesCourses from './pages/admin/AdminAesCourses'
import AdminKdiCourses from './pages/admin/AdminKdiCourses'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminLeadership from './pages/admin/AdminLeadership'
import AdminBlog from './pages/admin/AdminBlog'
import AdminGiving from './pages/admin/AdminGiving'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminCredentials from './pages/admin/AdminCredentials'
import AdminSettings from './pages/admin/AdminSettings'

// Member Portal
import MemberDashboard from './pages/member/MemberDashboard'
import MemberProfile from './pages/member/MemberProfile'
import MemberCourses from './pages/member/MemberCourses'
import MemberEvents from './pages/member/MemberEvents'
import MemberDocuments from './pages/member/MemberDocuments'

// Guards
import AdminGuard from './components/shared/AdminGuard'
import MemberGuard from './components/shared/MemberGuard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/ministries" element={<MinistriesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/auxiliaries" element={<AuxiliariesPage />} />
        <Route path="/auxiliaries/:slug" element={<AuxiliaryDetailPage />} />
        <Route path="/academy-of-episcopal-studies" element={<AcademyPage />} />
        <Route path="/kingdom-dominion-institute" element={<KdiPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/stay-connected" element={<StayConnectedPage />} />
        <Route path="/events/:id/register" element={<EventRegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/portal" element={<MemberGuard><MemberDashboard /></MemberGuard>} />
        <Route path="/portal/profile" element={<MemberGuard><MemberProfile /></MemberGuard>} />
        <Route path="/portal/courses" element={<MemberGuard><MemberCourses /></MemberGuard>} />
        <Route path="/portal/events" element={<MemberGuard><MemberEvents /></MemberGuard>} />
        <Route path="/portal/documents" element={<MemberGuard><MemberDocuments /></MemberGuard>} />

        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/members" element={<AdminGuard><AdminMembers /></AdminGuard>} />
        <Route path="/admin/ministries" element={<AdminGuard><AdminMinistries /></AdminGuard>} />
        <Route path="/admin/events" element={<AdminGuard><AdminEvents /></AdminGuard>} />
        <Route path="/admin/auxiliaries" element={<AdminGuard><AdminAuxiliaries /></AdminGuard>} />
        <Route path="/admin/aes-courses" element={<AdminGuard><AdminAesCourses /></AdminGuard>} />
        <Route path="/admin/kdi-courses" element={<AdminGuard><AdminKdiCourses /></AdminGuard>} />
        <Route path="/admin/documents" element={<AdminGuard><AdminDocuments /></AdminGuard>} />
        <Route path="/admin/leadership" element={<AdminGuard><AdminLeadership /></AdminGuard>} />
        <Route path="/admin/blog" element={<AdminGuard><AdminBlog /></AdminGuard>} />
        <Route path="/admin/giving" element={<AdminGuard><AdminGiving /></AdminGuard>} />
        <Route path="/admin/announcements" element={<AdminGuard><AdminAnnouncements /></AdminGuard>} />
        <Route path="/admin/credentials" element={<AdminGuard><AdminCredentials /></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
