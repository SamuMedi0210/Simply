import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AutomationConfig {
  id: string;
  user_id: string;
  auto_verify_enabled: boolean;
  verify_interval: number;
  shortcuts_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AutomationLog {
  id: string;
  config_id: string;
  action_type: string;
  status: string;
  details: Record<string, any>;
  created_at: string;
}

export interface CouponResult {
  id: string;
  config_id: string;
  merchant_id: string;
  coupon_code: string;
  is_valid: boolean;
  discount_amount: string;
  tested_at: string;
}
