export function tryHexHexDecode(value: string) {
  if (value.length === 32) {
    // Incorrectly encoded. '30303030303030303030303030306263' should be '00000000000000bc'
    return '0x' + value.split(/(..)/).filter(a => a).map(a => String.fromCharCode(parseInt(a, 16))).join('')
  }
  return value
}
