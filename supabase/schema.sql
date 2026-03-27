-- ============================================================
-- KDCMF PLATFORM — COMPLETE DATABASE SCHEMA
-- Kingdom Dominion Covenant Ministries Fellowship
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- AUTHENTICATION & USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  photo_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'clergy', 'bishop', 'admin', 'staff')),
  membership_status TEXT DEFAULT 'pending' CHECK (membership_status IN ('active', 'pending', 'expired', 'suspended')),
  membership_plan_id UUID,
  membership_start DATE,
  membership_expiry DATE,
  ordination_status TEXT CHECK (ordination_status IN ('licensed', 'ordained', 'bishop', 'none')),
  title TEXT,
  bio TEXT,
  church_name TEXT,
  church_city TEXT,
  church_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEMBERSHIP PLANS
-- ============================================================

CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_annually DECIMAL(10,2),
  member_type TEXT NOT NULL CHECK (member_type IN ('individual', 'church', 'affiliate')),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  stripe_price_id_monthly TEXT,
  stripe_price_id_annually TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEADERSHIP
-- ============================================================

CREATE TABLE IF NOT EXISTS leadership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  office TEXT,
  category TEXT NOT NULL CHECK (category IN ('presiding', 'executive', 'national', 'regional', 'auxiliary', 'honorary')),
  bio TEXT,
  photo_url TEXT,
  church_name TEXT,
  church_city TEXT,
  church_state TEXT,
  email TEXT,
  phone TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MINISTRY DIRECTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('church', 'ministry', 'para_church', 'affiliate')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  senior_pastor TEXT,
  pastor_title TEXT DEFAULT 'Pastor',
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  photo_url TEXT,
  description TEXT,
  membership_plan_id UUID REFERENCES membership_plans(id),
  joined_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUXILIARIES
-- ============================================================

CREATE TABLE IF NOT EXISTS auxiliary_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auxiliaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES auxiliary_categories(id),
  tagline TEXT,
  description TEXT,
  mission TEXT,
  vision TEXT,
  photo_url TEXT,
  banner_url TEXT,
  leader_name TEXT,
  leader_title TEXT,
  leader_photo_url TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auxiliary_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auxiliary_id UUID REFERENCES auxiliaries(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('announcement', 'resource', 'event', 'news')),
  title TEXT NOT NULL,
  body TEXT,
  file_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('summit', 'conference', 'workshop', 'convocation', 'training', 'auxiliary', 'general')),
  description TEXT,
  full_description TEXT,
  cover_image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location_name TEXT,
  location_address TEXT,
  location_city TEXT,
  location_state TEXT,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMPTZ,
  max_capacity INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  stripe_price_id TEXT,
  auxiliary_id UUID REFERENCES auxiliaries(id),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'open', 'closed', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  church_name TEXT,
  dietary_restrictions TEXT,
  special_needs TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'waived', 'refunded')),
  stripe_payment_intent TEXT,
  amount_paid DECIMAL(10,2),
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  confirmation_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACADEMY OF EPISCOPAL STUDIES
-- ============================================================

CREATE TABLE IF NOT EXISTS aes_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  full_description TEXT,
  cover_image_url TEXT,
  level TEXT CHECK (level IN ('introductory', 'intermediate', 'advanced', 'certification')),
  category TEXT,
  prerequisites TEXT,
  duration_hours INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  stripe_price_id TEXT,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aes_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES aes_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  content TEXT,
  video_url TEXT,
  document_url TEXT,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aes_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES aes_courses(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn', 'pending')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'waived', 'refunded')),
  stripe_payment_intent TEXT,
  amount_paid DECIMAL(10,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  UNIQUE(course_id, profile_id)
);

CREATE TABLE IF NOT EXISTS aes_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES aes_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES aes_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, lesson_id)
);

-- ============================================================
-- KINGDOM DOMINION INSTITUTE
-- ============================================================

CREATE TABLE IF NOT EXISTS kdi_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  full_description TEXT,
  cover_image_url TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'certification')),
  category TEXT,
  prerequisites TEXT,
  duration_hours INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kdi_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES kdi_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  content TEXT,
  video_url TEXT,
  document_url TEXT,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kdi_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES kdi_courses(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn', 'pending')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'waived', 'refunded')),
  stripe_payment_intent TEXT,
  amount_paid DECIMAL(10,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  UNIQUE(course_id, profile_id)
);

CREATE TABLE IF NOT EXISTS kdi_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES kdi_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES kdi_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, lesson_id)
);

-- ============================================================
-- DOCUMENTS REPOSITORY
-- ============================================================

CREATE TABLE IF NOT EXISTS document_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES document_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  access_level TEXT NOT NULL DEFAULT 'members' CHECK (access_level IN ('public', 'members', 'clergy', 'leadership', 'admin')),
  version TEXT,
  effective_date DATE,
  is_published BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CREDENTIALS & RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('license', 'ordination', 'consecration', 'certification', 'appointment')),
  title TEXT NOT NULL,
  issued_by TEXT,
  issued_date DATE,
  expiry_date DATE,
  certificate_number TEXT,
  certificate_url TEXT,
  notes TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMUNICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT DEFAULT 'all' CHECK (audience IN ('all', 'members', 'clergy', 'leadership', 'auxiliary')),
  auxiliary_id UUID REFERENCES auxiliaries(id),
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  submitted_by_name TEXT,
  request TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
  prayer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG & CONTENT
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES blog_categories(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GIVING & PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS giving_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  fund_id UUID REFERENCES giving_funds(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_method TEXT DEFAULT 'stripe',
  stripe_payment_intent TEXT,
  stripe_charge_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  donor_name TEXT,
  donor_email TEXT,
  is_recurring BOOLEAN DEFAULT false,
  stripe_subscription_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WEBSITE & SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS website_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT & INQUIRIES
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'membership', 'ministry', 'media', 'speaking')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO-TIMESTAMP TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'membership_plans', 'leadership', 'ministries',
    'auxiliaries', 'auxiliary_content', 'events', 'event_registrations',
    'aes_courses', 'aes_lessons', 'aes_enrollments',
    'kdi_courses', 'kdi_lessons', 'kdi_enrollments',
    'documents', 'credentials', 'announcements', 'prayer_requests',
    'blog_posts', 'donations', 'website_pages', 'email_templates',
    'contact_inquiries'
  ]
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_updated_at ON %I;
      CREATE TRIGGER trg_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', t, t);
  END LOOP;
END;
$$;

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Member'),
    'member'
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auxiliaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE auxiliary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE auxiliary_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE aes_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE aes_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE aes_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aes_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE kdi_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE kdi_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE kdi_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kdi_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read policies (published content)
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published auxiliaries" ON auxiliaries FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read auxiliary categories" ON auxiliary_categories FOR SELECT USING (true);
CREATE POLICY "Public can read leadership" ON leadership FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active ministries" ON ministries FOR SELECT USING (status = 'active');
CREATE POLICY "Public can read membership plans" ON membership_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published AES courses" ON aes_courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published KDI courses" ON kdi_courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read blog categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Public can read public documents" ON documents FOR SELECT USING (access_level = 'public' AND is_published = true);
CREATE POLICY "Public can read active giving funds" ON giving_funds FOR SELECT USING (is_active = true);

-- Service role full access (for Edge Functions)
CREATE POLICY "Service role full access profiles" ON profiles USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access admin_sessions" ON admin_sessions USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access member_sessions" ON member_sessions USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access events" ON events USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access event_registrations" ON event_registrations USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access aes_courses" ON aes_courses USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access aes_lessons" ON aes_lessons USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access aes_enrollments" ON aes_enrollments USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access aes_lesson_progress" ON aes_lesson_progress USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access kdi_courses" ON kdi_courses USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access kdi_lessons" ON kdi_lessons USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access kdi_enrollments" ON kdi_enrollments USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access kdi_lesson_progress" ON kdi_lesson_progress USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access auxiliaries" ON auxiliaries USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access auxiliary_content" ON auxiliary_content USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access documents" ON documents USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access document_categories" ON document_categories USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access credentials" ON credentials USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access announcements" ON announcements USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access prayer_requests" ON prayer_requests USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access leadership" ON leadership USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ministries" ON ministries USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_posts" ON blog_posts USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_categories" ON blog_categories USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access donations" ON donations USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access giving_funds" ON giving_funds USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access membership_plans" ON membership_plans USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access website_pages" ON website_pages USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access media_library" ON media_library USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access system_settings" ON system_settings USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access email_templates" ON email_templates USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access notification_settings" ON notification_settings USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access contact_inquiries" ON contact_inquiries USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA
-- ============================================================

-- Auxiliary Categories
INSERT INTO auxiliary_categories (name, slug, sort_order) VALUES
  ('Women', 'women', 1),
  ('Men', 'men', 2),
  ('Youth', 'youth', 3),
  ('General', 'general', 4)
ON CONFLICT (slug) DO NOTHING;

-- Auxiliaries
INSERT INTO auxiliaries (name, slug, category_id, tagline, description, is_active, is_published, sort_order)
VALUES
  ('Her Voice His Glory', 'her-voice-his-glory',
    (SELECT id FROM auxiliary_categories WHERE slug = 'women'),
    'Women of Excellence, Serving with Purpose',
    'Her Voice His Glory is the women''s ministry of KDCMF, committed to empowering women to walk in their God-given purpose, lead with excellence, and serve with integrity.',
    true, true, 1),
  ('The King''s Men Fellowship', 'kings-men-fellowship',
    (SELECT id FROM auxiliary_categories WHERE slug = 'men'),
    'Men of God, Standing in Covenant',
    'The King''s Men Fellowship is the men''s ministry of KDCMF, dedicated to raising up men of character, covenant, and Kingdom purpose.',
    true, true, 1),
  ('Kingdom Forward', 'kingdom-forward',
    (SELECT id FROM auxiliary_categories WHERE slug = 'youth'),
    'The Next Generation. Moving Forward.',
    'Kingdom Forward is the youth ministry of KDCMF, equipping the next generation of Kingdom leaders with faith, vision, and purpose.',
    true, true, 1)
ON CONFLICT (slug) DO NOTHING;

-- Membership Plans
INSERT INTO membership_plans (name, slug, description, price_monthly, price_annually, member_type, features, sort_order)
VALUES
  ('Individual Clergy', 'individual-clergy',
    'For licensed and ordained clergy seeking fellowship, accountability, and development.',
    25.00, 250.00, 'individual',
    '["Member portal access", "Academy of Episcopal Studies enrollment", "Kingdom Dominion Institute access", "Fellowship directory", "Event discounts", "Digital credential card"]',
    1),
  ('Local Church', 'local-church',
    'For local churches seeking covenant partnership with KDCMF.',
    75.00, 750.00, 'church',
    '["Full member portal access", "Up to 5 clergy profiles", "Ministry directory listing", "Event registration", "All training portals", "Fellowship documents access", "Priority support"]',
    2),
  ('Affiliate Ministry', 'affiliate-ministry',
    'For ministries and para-church organizations aligned with the KDCMF vision.',
    50.00, 500.00, 'affiliate',
    '["Member portal access", "Ministry directory listing", "Event access", "Kingdom Dominion Institute", "Fellowship documents access"]',
    3)
ON CONFLICT (slug) DO NOTHING;

-- Document Categories
INSERT INTO document_categories (name, slug, sort_order) VALUES
  ('Governing Documents', 'governing-documents', 1),
  ('Policies & Procedures', 'policies-procedures', 2),
  ('Training & Development', 'training-development', 3),
  ('Forms & Applications', 'forms-applications', 4),
  ('Meeting Minutes', 'meeting-minutes', 5),
  ('Annual Reports', 'annual-reports', 6)
ON CONFLICT (slug) DO NOTHING;

-- Blog Categories
INSERT INTO blog_categories (name, slug, sort_order) VALUES
  ('Kingdom Teaching', 'kingdom-teaching', 1),
  ('Leadership', 'leadership', 2),
  ('Fellowship News', 'fellowship-news', 3),
  ('Events & Announcements', 'events-announcements', 4),
  ('Member Stories', 'member-stories', 5)
ON CONFLICT (slug) DO NOTHING;

-- Giving Funds
INSERT INTO giving_funds (name, description, sort_order) VALUES
  ('General Fellowship Fund', 'Support the ongoing operations and mission of KDCMF.', 1),
  ('Annual Summit Fund', 'Help fund the KDCMF Annual Summit for pastors and leaders.', 2),
  ('Missions & Outreach', 'Support global and domestic outreach initiatives.', 3),
  ('Scholarship Fund', 'Provide training scholarships for emerging leaders.', 4)
ON CONFLICT DO NOTHING;

-- System Settings
INSERT INTO system_settings (key, value, description) VALUES
  ('site_name', 'Kingdom Dominion Covenant Ministries Fellowship', 'Organization name'),
  ('site_tagline', 'United in Purpose. Building the Kingdom.', 'Site tagline'),
  ('contact_email', 'info@kdcmf.org', 'Primary contact email'),
  ('contact_phone', '', 'Contact phone number'),
  ('address', '', 'Fellowship address'),
  ('presiding_bishop', 'Bishop Owens F. Shepard', 'Current Presiding Bishop name'),
  ('facebook_url', '', 'Facebook page URL'),
  ('youtube_url', '', 'YouTube channel URL'),
  ('instagram_url', '', 'Instagram URL'),
  ('twitter_url', '', 'Twitter/X URL'),
  ('stripe_public_key', '', 'Stripe publishable key'),
  ('sendgrid_from_email', 'no-reply@kdcmf.org', 'SendGrid from email')
ON CONFLICT (key) DO NOTHING;

-- AES Sample Courses
INSERT INTO aes_courses (title, slug, code, description, level, category, duration_hours, price, is_published, sort_order)
VALUES
  ('Introduction to Episcopal Leadership', 'intro-episcopal-leadership', 'AES-101',
    'A foundational course covering the biblical basis, history, and responsibilities of the episcopal office.',
    'introductory', 'Episcopal Studies', 8, 0, true, 1),
  ('The Bishopric: Theology and Practice', 'bishopric-theology-practice', 'AES-201',
    'An in-depth examination of the theology and practical responsibilities of the bishopric in the apostolic tradition.',
    'intermediate', 'Episcopal Studies', 16, 50.00, true, 2),
  ('Church Governance and Administration', 'church-governance-administration', 'AES-202',
    'Equipping bishops and senior leaders with the administrative tools needed to govern effectively.',
    'intermediate', 'Administration', 12, 50.00, true, 3),
  ('Consecration Preparation', 'consecration-preparation', 'AES-301',
    'Comprehensive preparation course for candidates approaching consecration to the bishopric.',
    'advanced', 'Episcopal Studies', 24, 100.00, false, 4)
ON CONFLICT (slug) DO NOTHING;

-- KDI Sample Courses
INSERT INTO kdi_courses (title, slug, code, description, level, category, duration_hours, price, is_published, sort_order)
VALUES
  ('Foundations of Kingdom Living', 'foundations-kingdom-living', 'KDI-101',
    'A discipleship foundation course for all believers covering Kingdom principles, identity, and purpose.',
    'beginner', 'Discipleship', 6, 0, true, 1),
  ('Ministry Leadership Essentials', 'ministry-leadership-essentials', 'KDI-201',
    'Core leadership principles for pastors, ministers, and ministry leaders.',
    'intermediate', 'Leadership', 10, 0, true, 2),
  ('Preaching and Teaching Excellence', 'preaching-teaching-excellence', 'KDI-202',
    'Developing and sharpening the gift of preaching and teaching for Kingdom impact.',
    'intermediate', 'Homiletics', 8, 25.00, true, 3),
  ('Church Planting Fundamentals', 'church-planting-fundamentals', 'KDI-301',
    'A practical guide to planting and establishing a healthy local church.',
    'advanced', 'Church Planting', 20, 75.00, false, 4)
ON CONFLICT (slug) DO NOTHING;

-- Notification Settings
INSERT INTO notification_settings (key, label, description, is_enabled) VALUES
  ('new_member_registration', 'New Member Registration', 'Notify admin when a new member registers', true),
  ('new_event_registration', 'Event Registration', 'Notify admin of new event registrations', true),
  ('new_course_enrollment', 'Course Enrollment', 'Notify admin of new course enrollments', true),
  ('new_contact_inquiry', 'Contact Inquiry', 'Notify admin of new contact form submissions', true),
  ('membership_expiring', 'Membership Expiring', 'Notify members 30 days before membership expires', true),
  ('new_donation', 'Donation Received', 'Notify admin when a donation is received', true),
  ('new_prayer_request', 'Prayer Request', 'Notify leadership of new prayer requests', false)
ON CONFLICT (key) DO NOTHING;
