/*
  # Create study status tracking table

  1. New Tables
    - `study_status`
      - `id` (uuid, primary key)
      - `study_token` (text, not null)
      - `status` (text, with check constraint)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on `study_status` table
    - Add policy for authenticated users to read
    - Add indexes for performance optimization

  3. Test Data
    - Insert sample studies with different stages of completion
*/

-- Create the study_status table
CREATE TABLE IF NOT EXISTS study_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_token text NOT NULL,
  status text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_status CHECK (
    status IN (
      'send_complete',
      'received_central',
      'sent_to_ai',
      'ai_processing',
      'results_received'
    )
  )
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_study_status_token ON study_status(study_token);
CREATE INDEX IF NOT EXISTS idx_study_status_created_at ON study_status(created_at);

-- Enable RLS
ALTER TABLE study_status ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated users to read study status"
  ON study_status
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert test data
INSERT INTO study_status (study_token, status, timestamp, created_at, completed_at)
VALUES
  ('STUDY007', 'send_complete', now() - interval '30 minutes', now() - interval '30 minutes', now() - interval '25 minutes'),
  ('STUDY007', 'received_central', now() - interval '25 minutes', now() - interval '30 minutes', now() - interval '20 minutes'),
  ('STUDY007', 'sent_to_ai', now() - interval '20 minutes', now() - interval '30 minutes', now() - interval '15 minutes'),
  ('STUDY007', 'ai_processing', now() - interval '15 minutes', now() - interval '30 minutes', now() - interval '5 minutes'),
  ('STUDY007', 'results_received', now() - interval '5 minutes', now() - interval '30 minutes', now()),
  
  ('STUDY008', 'send_complete', now() - interval '15 minutes', now() - interval '15 minutes', now() - interval '10 minutes'),
  ('STUDY008', 'received_central', now() - interval '10 minutes', now() - interval '15 minutes', now() - interval '5 minutes'),
  ('STUDY008', 'sent_to_ai', now() - interval '5 minutes', now() - interval '15 minutes', now()),
  
  ('STUDY009', 'send_complete', now() - interval '5 minutes', now() - interval '5 minutes', now());