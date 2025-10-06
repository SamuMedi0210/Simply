import { useEffect, useState } from 'react';
import { supabase, AutomationConfig, AutomationLog, CouponResult } from '../lib/supabase';

export function useAutomation() {
  const [config, setConfig] = useState<AutomationConfig | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [results, setResults] = useState<CouponResult[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = 'default-user';

  useEffect(() => {
    loadConfig();
    loadLogs();
    loadResults();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('automation_configs')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig(data);
      } else {
        const newConfig = await createDefaultConfig();
        setConfig(newConfig);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultConfig = async (): Promise<AutomationConfig> => {
    const { data, error } = await supabase
      .from('automation_configs')
      .insert({
        user_id: userId,
        auto_verify_enabled: false,
        verify_interval: 5,
        shortcuts_enabled: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateConfig = async (updates: Partial<AutomationConfig>) => {
    if (!config) return;

    const { data, error } = await supabase
      .from('automation_configs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', config.id)
      .select()
      .single();

    if (error) throw error;
    setConfig(data);
    return data;
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadResults = async () => {
    try {
      const { data, error } = await supabase
        .from('coupon_results')
        .select('*')
        .order('tested_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const addLog = async (actionType: string, status: string, details: Record<string, any> = {}) => {
    if (!config) return;

    const { error } = await supabase
      .from('automation_logs')
      .insert({
        config_id: config.id,
        action_type: actionType,
        status,
        details,
      });

    if (error) throw error;
    await loadLogs();
  };

  const addCouponResult = async (
    couponCode: string,
    isValid: boolean,
    merchantId: string = '',
    discountAmount: string = ''
  ) => {
    if (!config) return;

    const { error } = await supabase
      .from('coupon_results')
      .insert({
        config_id: config.id,
        merchant_id: merchantId,
        coupon_code: couponCode,
        is_valid: isValid,
        discount_amount: discountAmount,
      });

    if (error) throw error;
    await loadResults();
  };

  const clearLogs = async () => {
    if (!config) return;

    const { error } = await supabase
      .from('automation_logs')
      .delete()
      .eq('config_id', config.id);

    if (error) throw error;
    setLogs([]);
  };

  return {
    config,
    logs,
    results,
    loading,
    updateConfig,
    addLog,
    addCouponResult,
    clearLogs,
    refreshLogs: loadLogs,
    refreshResults: loadResults,
  };
}
