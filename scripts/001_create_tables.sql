-- Create books table for catalog
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  amazon_url TEXT,
  apple_url TEXT,
  kobo_url TEXT,
  other_url TEXT,
  price DECIMAL(10, 2),
  genre TEXT,
  published_date DATE,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create formats table for supported e-book formats
CREATE TABLE IF NOT EXISTS public.formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  extension TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pages table for editable page content
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table for admin access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Books: public read, admin write
CREATE POLICY "books_public_read" ON public.books FOR SELECT USING (true);
CREATE POLICY "books_admin_insert" ON public.books FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "books_admin_update" ON public.books FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "books_admin_delete" ON public.books FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Formats: public read, admin write
CREATE POLICY "formats_public_read" ON public.formats FOR SELECT USING (true);
CREATE POLICY "formats_admin_insert" ON public.formats FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "formats_admin_update" ON public.formats FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "formats_admin_delete" ON public.formats FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Pages: public read, admin write
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (true);
CREATE POLICY "pages_admin_insert" ON public.pages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "pages_admin_update" ON public.pages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "pages_admin_delete" ON public.pages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Admin users: only super admins can manage
CREATE POLICY "admin_users_read" ON public.admin_users FOR SELECT USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND is_super_admin = true)
);
CREATE POLICY "admin_users_insert" ON public.admin_users FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND is_super_admin = true)
);

-- Insert default formats
INSERT INTO public.formats (name, extension, description, icon, sort_order) VALUES
  ('EPUB', '.epub', 'The most widely supported e-book format. Works with Apple Books, Kobo, and most e-readers except Kindle.', 'book-open', 1),
  ('MOBI', '.mobi', 'Amazon''s older Kindle format. Being phased out in favor of KPF/KF8.', 'tablet-smartphone', 2),
  ('PDF', '.pdf', 'Fixed layout format. Best for documents with specific formatting needs.', 'file-text', 3),
  ('AZW3/KF8', '.azw3', 'Amazon''s current Kindle format with enhanced features.', 'tablet', 4)
ON CONFLICT DO NOTHING;

-- Insert default page content
INSERT INTO public.pages (slug, title, content, meta_description) VALUES
  ('home', 'Home', '{"hero_title": "Welcome to Inkbound", "hero_subtitle": "Quality e-books crafted with care", "featured_section_title": "Featured Books"}', 'Inkbound Books - A small team dedicated to writing and editing quality e-books'),
  ('about', 'About Us', '{"intro": "We are a small team dedicated to writing and editing quality e-books.", "team_members": []}', 'Learn about the Inkbound team'),
  ('catalog', 'Catalog', '{"intro": "Browse our collection of quality e-books"}', 'Browse the Inkbound book catalog')
ON CONFLICT (slug) DO NOTHING;
