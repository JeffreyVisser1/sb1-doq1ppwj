/*
  # Study Status Tracking System Schema

  1. New Tables
    - `study_status`
      - `id` (uuid, primary key)
      - `study_token` (text, unique identifier for the study)
      - `status` (text, current status of the study)
      - `timestamp` (timestamptz, when the status was updated)
      - `created_at` (timestamptz, when the study was first created)
      - `completed_at` (timestamptz, when the study was completed)

  2. Security
    - Enable RLS on `study_status` table
    - Add policy for authenticated users to read study status data
    - Add policy for service role to insert/update study status

  3. Demo Data
    - Insert sample study status records with different states and timestamps
*/

-- Create the study_status table
CREATE TABLE IF NOT EXISTS study_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_token text NOT NULL,
  status text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_status CHECK (status IN (
    'send_complete',
    'received_central',
    'sent_to_ai',
    'ai_processing',
    'results_received'
  ))
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_study_status_token ON study_status(study_token);
CREATE INDEX IF NOT EXISTS idx_study_status_created_at ON study_status(created_at);

-- Enable RLS
ALTER TABLE study_status ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users"
  ON study_status
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access"
  ON study_status
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert demo data
INSERT INTO study_status (study_token, status, timestamp, created_at, completed_at)
VALUES
  -- Completed study (all stages)
  ('STUDY001', 'results_received', now() - interval '10 minutes', now() - interval '1 hour', now() - interval '10 minutes'),
  ('STUDY001', 'ai_processing', now() - interval '20 minutes', now() - interval '1 hour', null),
  ('STUDY001', 'sent_to_ai', now() - interval '30 minutes', now() - interval '1 hour', null),
  ('STUDY001', 'received_central', now() - interval '40 minutes', now() - interval '1 hour', null),
  ('STUDY001', 'send_complete', now() - interval '50 minutes', now() - interval '1 hour', null),

  -- Study in progress (currently in AI processing)
  ('STUDY002', 'ai_processing', now() - interval '5 minutes', now() - interval '30 minutes', null),
  ('STUDY002', 'sent_to_ai', now() - interval '10 minutes', now() - interval '30 minutes', null),
  ('STUDY002', 'received_central', now() - interval '15 minutes', now() - interval '30 minutes', null),
  ('STUDY002', 'send_complete', now() - interval '20 minutes', now() - interval '30 minutes', null),

  -- Recently started study
  ('STUDY003', 'send_complete', now() - interval '5 minutes', now() - interval '5 minutes', null),

  -- Additional completed studies for statistics
  ('STUDY004', 'results_received', now() - interval '2 hours', now() - interval '3 hours', now() - interval '2 hours'),
  ('STUDY005', 'results_received', now() - interval '3 hours', now() - interval '4 hours', now() - interval '3 hours'),
  ('STUDY006', 'results_received', now() - interval '4 hours', now() - interval '5 hours', now() - interval '4 hours'),
  ('STUDY007', 'results_received', now() - interval '5 hours', now() - interval '6 hours', now() - interval '5 hours'),
  ('STUDY008', 'ai_processing', now() - interval '30 minutes', now() - interval '2 hours', null);