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
  guest_email text NOT NULL,
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

-- RLS Policies for rsvp_responses
CREATE POLICY "Anyone can insert RSVP"
  ON rsvp_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can view RSVPs"
  ON rsvp_responses
  FOR SELECT
  TO authenticated
  USING (false);

-- RLS Policies for guest_messages
CREATE POLICY "Anyone can insert guest messages"
  ON guest_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view guest messages"
  ON guest_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);
