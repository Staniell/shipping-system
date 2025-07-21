export function kFormatter(num: number | string) {
  const numericValue = typeof num === 'string' ? parseInt(num) : num

  if (isNaN(numericValue)) {
    return '0'
  }

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(numericValue)
}
