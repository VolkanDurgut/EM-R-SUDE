/*
  # Create Media Uploads Table

  ## Overview
  Creates a table for tracking media (photos/videos) uploaded by wedding guests.
  Actual files will be stored in Supabase Storage (wedding-media bucket).
*/

-- Medya yüklemeleri tablosu
CREATE TABLE IF NOT EXISTS media_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_name text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,      -- Supabase Storage'daki yol
  file_type text NOT NULL,      -- 'image' | 'video'
  file_size integer,            -- Byte cinsinden
  table_number text,            -- Hangi masadan yüklendi (Opsiyonel)
  created_at timestamptz DEFAULT now()
);

-- RLS (Row Level Security) Aktifleştirme
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

-- Herkes (anonim veya giriş yapmış) medya yükleme kaydı oluşturabilir
CREATE POLICY "Anyone can insert media"
  ON media_uploads 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sadece giriş yapmış kullanıcılar (Yönetici / Emir & Sude) yüklenenleri görebilir
CREATE POLICY "Only authenticated can view media"
  ON media_uploads 
  FOR SELECT
  TO authenticated
  USING (true);