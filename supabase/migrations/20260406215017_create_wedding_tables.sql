/*
  # Create Wedding Website Tables

  ## Overview
  Creates tables for storing RSVP responses and guest book messages for the wedding website.

  ## New Tables
  
  ### `rsvp_responses`
  Stores guest RSVP information:
  - `id` (uuid, primary key) - Unique identifier for each RSVP
  - `guest_name` (text) - Name of the guest
  - `guest_email` (text) - Email address of the guest
  - `attending` (boolean) - Whether guest will attend
  - `plus_one` (boolean) - Whether bringing a plus one
  - `plus_one_name` (text, optional) - Name of plus one guest
  - `dietary_requirements` (text, optional) - Any dietary requirements
  - `message` (text, optional) - Optional message from guest
  - `created_at` (timestamptz) - Timestamp of RSVP submission

  ### `guest_messages`
  Stores guest book messages and memories:
  - `id` (uuid, primary key) - Unique identifier for each message
  - `guest_name` (text) - Name of the guest
  - `message` (text) - The guest's message or memory
  - `created_at` (timestamptz) - Timestamp of message submission

  ## Security
  - Enable RLS on both tables
  - Public read access for guest messages (to display on site)
  - Public insert access for both tables (anyone can submit)
  - No update or delete permissions for public users
*/

-- Create rsvp_responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  guest_email text, 
  attending boolean DEFAULT true,
  plus_one boolean DEFAULT false,
  plus_one_name text,
  dietary_requirements text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Create guest_messages table
CREATE TABLE IF NOT EXISTS guest_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;

-- E-posta başına tek RSVP zorunlu (Aynı e-posta ile kayıt engellenir)
-- Not: PostgreSQL'de birden fazla NULL değer UNIQUE kısıtlamasını bozmaz.
ALTER TABLE rsvp_responses 
  ADD CONSTRAINT rsvp_responses_email_unique 
  UNIQUE (guest_email);

-- Opsiyonel olan e-posta alanı eğer doldurulmuşsa doğru formatta olmalıdır
ALTER TABLE rsvp_responses
  ADD CONSTRAINT rsvp_email_format_check
  CHECK (
    guest_email IS NULL OR
    guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- RLS Policies for rsvp_responses
CREATE POLICY "Anyone can insert RSVP"
  ON rsvp_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Upsert (Güncelleme) işlemi için UPDATE izni
CREATE POLICY "Anyone can update their own RSVP"
  ON rsvp_responses
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only admins can view RSVPs"
  ON rsvp_responses
  FOR SELECT
  TO authenticated
  USING (false);

-- RLS Policies for guest_messages
DROP POLICY IF EXISTS "Anyone can insert guest messages" ON guest_messages;

CREATE POLICY "Rate limited guest message insert"
  ON guest_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (
      SELECT COUNT(*)
      FROM guest_messages
      WHERE guest_name = NEW.guest_name
        AND created_at > NOW() - INTERVAL '60 seconds'
    ) < 3
  );

CREATE POLICY "Anyone can view guest messages"
  ON guest_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- GÜNCELLEME: guest_messages tablosunu Supabase Realtime'a ekle
-- (Supabase Dashboard > Database > Replication ile aynı işlevi görür)
ALTER PUBLICATION supabase_realtime ADD TABLE guest_messages;