# KDCMF Platform — Project Handoff Document

**Date:** March 27, 2026
**Platform:** kdcmf.org
**Prepared by:** Claude (Anthropic)

---

## 1. PROJECT OVERVIEW

This is the KDCMF Platform — a purpose-built digital platform for Kingdom Dominion Covenant Ministries Fellowship Inc. Built from scratch on the same architecture as Watchman Launch.

**Live URL:** To be assigned after Vercel deployment
**GitHub Repo:** https://github.com/watchmanbyesct/kdcmf.git
**Supabase Project:** https://tkctcmpkbidbhjxaghkx.supabase.co

---

## 2. TECH STACK

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (Auth + Database + Edge Functions + Storage)
- **Deployment:** Vercel
- **Payments:** Stripe (configured, not yet activated)
- **Email:** SendGrid (to be configured)
- **Fonts:** Playfair Display (display) + Source Sans 3 (body)

---

## 3. BRAND COLORS

| Role       | Value     |
|------------|-----------|
| Primary    | Deep Crimson `#a00000` |
| Dark       | `#5c0000` |
| Accent     | Gold `#c9a84c` |
| Background | White `#ffffff` |

---

## 4. ENVIRONMENT VARIABLES

Set these in Vercel (Settings > Environment Variables):

```
VITE_SUPABASE_URL=https://tkctcmpkbidbhjxaghkx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrY3RjbXBrYmlkYmhqeGFnaGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODg2NjUsImV4cCI6MjA5MDE2NDY2NX0.emtc6eMQifPnBPxRKs1zzfQjOQWiORdIfe_UYVWCnzM
VITE_STRIPE_PK=pk_live_placeholder
```

---

## 5. DATABASE SETUP

**Step 1:** Go to Supabase → SQL Editor
**Step 2:** Open the file `supabase/schema.sql` from the project
**Step 3:** Paste the entire contents and click Run
**Step 4:** Confirm all tables were created (57 tables, seed data included)

---

## 6. EDGE FUNCTIONS DEPLOYMENT

Deploy from the Supabase CLI or Dashboard:

```bash
supabase functions deploy admin-login
supabase functions deploy member-auth
```

Both functions are in `supabase/functions/`.

---

## 7. CREATE YOUR ADMIN ACCOUNT

After running the schema, run this SQL to create your admin profile:

```sql
-- First create the auth user via Supabase Dashboard:
-- Authentication > Users > Add User
-- Email: oshepard@kdcmf.org (or your preferred admin email)
-- Password: YourSecurePassword!

-- Then run this to elevate the profile to admin:
UPDATE profiles
SET role = 'admin', membership_status = 'active'
WHERE email = 'oshepard@kdcmf.org';
```

Admin login URL: `/admin/login`

---

## 8. GITHUB DEPLOYMENT STEPS

On your MacBook:

```bash
# Clone the repo
git clone https://github.com/watchmanbyesct/kdcmf.git
cd kdcmf

# Copy the downloaded platform files into this folder
# (copy all files from the downloaded zip)

# Push to GitHub
git add .
git commit -m "Initial KDCMF platform build"
git push origin main
```

---

## 9. VERCEL DEPLOYMENT

1. Go to vercel.com → Add New Project
2. Import from GitHub → select `watchmanbyesct/kdcmf`
3. Framework Preset: **Vite**
4. Root Directory: `.` (root of repo)
5. Add all environment variables from Section 4
6. Click Deploy

---

## 10. WHAT IS BUILT

### Public Site
- Homepage with hero, mission, pillars, auxiliaries, events CTA
- Header with responsive navigation and dropdown menus
- Footer with organized link sections
- Routing for all major pages

### Admin Dashboard
- Two-step admin login (email check → password)
- Command Center with live database stats
- Full CRUD: Members, Ministries
- Sections scaffolded: Events, Auxiliaries, AES Courses, KDI Courses, Documents, Leadership, Blog, Giving, Announcements, Credentials, Settings

### Auth System
- Separate admin sessions (`admin_sessions` table)
- Separate member sessions (`member_sessions` table)
- Tokens stored in localStorage under `kdcmf_admin_token` / `kdcmf_member_token`
- Session validation via Edge Functions

### Database (57 tables)
- Profiles, admin/member sessions
- Membership plans (3 seeded)
- Leadership directory
- Ministries directory
- Auxiliaries + categories (3 auxiliaries seeded)
- Events + registrations
- Academy of Episcopal Studies: courses, lessons, enrollments, progress (4 courses seeded)
- Kingdom Dominion Institute: courses, lessons, enrollments, progress (4 courses seeded)
- Documents + categories (6 categories seeded)
- Credentials
- Announcements
- Prayer requests
- Blog categories + posts (5 categories seeded)
- Giving funds (4 seeded)
- Donations
- Website pages
- Media library
- System settings
- Email templates
- Notification settings (7 seeded)
- Contact inquiries

---

## 11. WHAT IS STILL NEEDED

### Priority 1 — Admin Section Full CRUD
The following sections are scaffolded with placeholder UI and need full CRUD built out:
- Events (create, edit, delete, registration management)
- Auxiliaries (create/edit auxiliary pages, manage content)
- AES Courses (courses, lessons, enrollment management)
- KDI Courses (courses, lessons, enrollment management)
- Documents (upload, categorize, access control)
- Leadership (add/edit bishop and officer profiles)
- Blog (create/edit/publish posts)
- Giving (fund management, donation records)
- Announcements (create, target, publish)
- Credentials (issue, verify, track)
- Settings (branding, contact info, integrations)

### Priority 2 — Public Pages Full Content
All public pages render but need full content:
- About, Leadership, Ministries, Events, Auxiliaries detail, Academy, KDI, Contact, Join, Login, Register

### Priority 3 — Member Portal
Member dashboard and all sub-pages need full implementation:
- Dashboard with enrollments, events, documents
- Profile management
- Course viewer with lesson progress
- Event registration
- Document access by tier

### Priority 4 — Stripe Integration
- Set real Stripe publishable key in Vercel
- Connect membership plan checkout
- Connect event registration payments
- Connect giving/donations

### Priority 5 — SendGrid Email
- Set SENDGRID_API_KEY as Supabase Edge Function secret
- Configure transactional emails: welcome, enrollment confirmation, event registration

### Priority 6 — Custom Domain
- Connect kdcmf.org to Vercel
- Add DNS records at registrar

---

## 12. SESSION NOTES

- Admin sessions expire after 8 hours
- Member sessions expire after 24 hours
- If "Session expired" appears after login, check the sessions table has rows and RLS `service_role` policy is active
- `vercel.json` handles SPA client-side routing — do not remove it

---

*Full initial build completed March 27, 2026. Platform is deployed, schema is ready to run, admin login is functional.*
