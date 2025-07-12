/**
 * Format Utilities
 * 
 * Utility functions for formatting various data types including currency,
 * numbers, dates, and other common formatting needs.
 */

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format a percentage
 * @param value - The decimal value to format as percentage (0.85 = 85%)
 * @param decimals - Number of decimal places (default: 0)
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 0, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
} 