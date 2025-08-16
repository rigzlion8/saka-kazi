/**
 * Currency utility functions for Kenyan Shillings (KES)
 */

export const CURRENCY = {
  CODE: 'KES',
  SYMBOL: 'KSh',
  NAME: 'Kenyan Shilling',
  LOCALE: 'en-KE'
} as const;

/**
 * Format a number as Kenyan Shillings
 * @param amount - The amount to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted currency string
 */
export function formatKES(
  amount: number, 
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  };

  return new Intl.NumberFormat('en-KE', defaultOptions).format(amount);
}

/**
 * Format a number as Kenyan Shillings with symbol
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the KSh symbol (default: true)
 * @returns Formatted currency string
 */
export function formatKESAmount(amount: number, showSymbol: boolean = true): string {
  if (showSymbol) {
    return `KSh ${amount.toLocaleString('en-KE')}`;
  }
  return amount.toLocaleString('en-KE');
}

/**
 * Format a number as Kenyan Shillings for display (compact format)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatKESCompact(amount: number): string {
  if (amount >= 1000000) {
    return `KSh ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `KSh ${(amount / 1000).toFixed(1)}K`;
  }
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/**
 * Parse a currency string back to a number
 * @param currencyString - The formatted currency string
 * @returns The numeric amount
 */
export function parseKESAmount(currencyString: string): number {
  // Remove currency symbols and commas, then parse
  const cleanString = currencyString.replace(/[KSh,\s]/g, '');
  return parseFloat(cleanString) || 0;
}
