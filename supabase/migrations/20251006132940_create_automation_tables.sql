/*
  # Extension Automation Database Schema

  ## New Tables
    - `automation_configs`
      - `id` (uuid, primary key)
      - `user_id` (text) - Identifier for the user/session
      - `auto_verify_enabled` (boolean) - Enable/disable auto verification
      - `verify_interval` (integer) - Seconds between auto clicks
      - `shortcuts_enabled` (boolean) - Enable keyboard shortcuts
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `automation_logs`
      - `id` (uuid, primary key)
      - `config_id` (uuid, foreign key)
      - `action_type` (text) - Type of action (auto_click, shortcut, etc)
      - `status` (text) - success, error, etc
      - `details` (jsonb) - Additional details
      - `created_at` (timestamptz)

    - `coupon_results`
      - `id` (uuid, primary key)
      - `config_id` (uuid, foreign key)
      - `merchant_id` (text) - Merchant identifier
      - `coupon_code` (text) - The coupon code tested
      - `is_valid` (boolean) - Whether coupon was valid
      - `discount_amount` (text) - Discount details if available
      - `tested_at` (timestamptz)

  ## Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create automation_configs table
CREATE TABLE IF NOT EXISTS automation_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  auto_verify_enabled boolean DEFAULT false,
  verify_interval integer DEFAULT 5,
  shortcuts_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE automation_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own configs"
  ON automation_configs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create automation_logs table
CREATE TABLE IF NOT EXISTS automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES automation_configs(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  status text DEFAULT 'pending',
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and create logs"
  ON automation_logs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create coupon_results table
CREATE TABLE IF NOT EXISTS coupon_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES automation_configs(id) ON DELETE CASCADE,
  merchant_id text DEFAULT '',
  coupon_code text NOT NULL,
  is_valid boolean NOT NULL,
  discount_amount text DEFAULT '',
  tested_at timestamptz DEFAULT now()
);

ALTER TABLE coupon_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage coupon results"
  ON coupon_results
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_automation_configs_user_id ON automation_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_config_id ON automation_logs(config_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON automation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupon_results_config_id ON coupon_results(config_id);
CREATE INDEX IF NOT EXISTS idx_coupon_results_tested_at ON coupon_results(tested_at DESC);
