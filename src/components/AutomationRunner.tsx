import { useEffect } from 'react';
import { useAutomation } from '../hooks/useAutomation';
import {
  startAutoVerification,
  stopAutoVerification,
  setupKeyboardShortcuts,
  readFromClipboard,
  fillCouponForm,
  copyToClipboard,
  clickVerifyButton,
  findCouponCodeInput,
} from '../scripts/automation';

export function AutomationRunner() {
  const { config, addLog, addCouponResult } = useAutomation();

  useEffect(() => {
    if (!config) return;

    if (config.auto_verify_enabled) {
      startAutoVerification(
        config.verify_interval,
        () => {
          addLog('auto_click', 'success', { message: 'Botón verificado automáticamente' });
        },
        (error) => {
          addLog('auto_click', 'error', { error });
        }
      );
    } else {
      stopAutoVerification();
    }

    return () => {
      stopAutoVerification();
    };
  }, [config?.auto_verify_enabled, config?.verify_interval]);

  useEffect(() => {
    if (!config?.shortcuts_enabled) return;

    const cleanup = setupKeyboardShortcuts(
      async () => {
        const clipboardText = await readFromClipboard();
        if (clipboardText) {
          await addCouponResult(clipboardText, true);
          addLog('shortcut', 'success', {
            action: 'valid_coupon',
            code: clipboardText,
          });
        }
      },
      async () => {
        const clipboardText = await readFromClipboard();
        if (clipboardText) {
          await addCouponResult(clipboardText, false);
          addLog('shortcut', 'success', {
            action: 'invalid_coupon',
            code: clipboardText,
          });
        }
      },
      async () => {
        const input = findCouponCodeInput();
        if (input && input.value) {
          const success = await copyToClipboard(input.value);
          if (success) {
            addLog('clipboard_copy', 'success', { code: input.value });
          }
        }
      },
      () => {
        addLog('shortcut', 'success', { action: 'next_coupon' });
      },
      () => {
        const success = clickVerifyButton();
        if (success) {
          addLog('manual_verify', 'success', { message: 'Verificación manual' });
        }
      }
    );

    return cleanup;
  }, [config?.shortcuts_enabled]);

  return null;
}
