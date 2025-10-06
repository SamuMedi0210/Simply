export interface AutomationScript {
  isRunning: boolean;
  intervalId: number | null;
  config: {
    autoVerifyEnabled: boolean;
    verifyInterval: number;
    shortcutsEnabled: boolean;
  };
}

export const automation: AutomationScript = {
  isRunning: false,
  intervalId: null,
  config: {
    autoVerifyEnabled: false,
    verifyInterval: 5,
    shortcutsEnabled: true,
  },
};

export function findVerifyButton(): HTMLButtonElement | null {
  const selectors = [
    'button[data-testid*="verify"]',
    'button[class*="verify"]',
    'button:contains("Verify")',
    'button:contains("verificar")',
    'button:contains("Check")',
    '[role="button"]:contains("verify")',
    '.verify-button',
    '#verify-btn',
  ];

  for (const selector of selectors) {
    try {
      const button = document.querySelector<HTMLButtonElement>(selector);
      if (button && !button.disabled) {
        return button;
      }
    } catch (e) {
      continue;
    }
  }

  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    const text = button.textContent?.toLowerCase() || '';
    if (
      text.includes('verify') ||
      text.includes('verificar') ||
      text.includes('check') ||
      text.includes('apply')
    ) {
      return button as HTMLButtonElement;
    }
  }

  return null;
}

export function clickVerifyButton(): boolean {
  const button = findVerifyButton();
  if (button) {
    button.click();
    return true;
  }
  return false;
}

export function startAutoVerification(interval: number, onSuccess: () => void, onError: (error: string) => void) {
  if (automation.isRunning) {
    return;
  }

  automation.isRunning = true;
  automation.config.autoVerifyEnabled = true;

  automation.intervalId = window.setInterval(() => {
    try {
      const success = clickVerifyButton();
      if (success) {
        onSuccess();
      } else {
        onError('Botón de verificación no encontrado');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, interval * 1000);
}

export function stopAutoVerification() {
  if (automation.intervalId !== null) {
    clearInterval(automation.intervalId);
    automation.intervalId = null;
  }
  automation.isRunning = false;
  automation.config.autoVerifyEnabled = false;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export async function readFromClipboard(): Promise<string> {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return '';
  }
}

export function findCouponCodeInput(): HTMLInputElement | null {
  const selectors = [
    'input[name*="coupon"]',
    'input[name*="promo"]',
    'input[name*="discount"]',
    'input[id*="coupon"]',
    'input[id*="promo"]',
    'input[placeholder*="coupon"]',
    'input[placeholder*="código"]',
    'input[placeholder*="promo"]',
    '[data-testid*="coupon"]',
  ];

  for (const selector of selectors) {
    const input = document.querySelector<HTMLInputElement>(selector);
    if (input) {
      return input;
    }
  }

  return null;
}

export function fillCouponForm(code: string): boolean {
  const input = findCouponCodeInput();
  if (input) {
    input.value = code;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
}

export interface FormField {
  selector: string;
  value: string;
}

export function fillForm(fields: FormField[]): boolean {
  let success = true;
  for (const field of fields) {
    const element = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(field.selector);
    if (element) {
      element.value = field.value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      success = false;
    }
  }
  return success;
}

export function setupKeyboardShortcuts(
  onValidCoupon: () => void,
  onInvalidCoupon: () => void,
  onCopyCoupon: () => void,
  onNextCoupon: () => void,
  onVerifyCoupon: () => void
) {
  const handleKeyPress = async (event: KeyboardEvent) => {
    if (!automation.config.shortcutsEnabled) return;

    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = event.key.toLowerCase();

    switch (key) {
      case 'v':
        event.preventDefault();
        onValidCoupon();
        break;
      case 'p':
        event.preventDefault();
        onInvalidCoupon();
        break;
      case 'c':
        event.preventDefault();
        onCopyCoupon();
        break;
      case 'n':
        event.preventDefault();
        onNextCoupon();
        break;
      case ' ':
        event.preventDefault();
        onVerifyCoupon();
        break;
    }
  };

  document.addEventListener('keydown', handleKeyPress);

  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}
