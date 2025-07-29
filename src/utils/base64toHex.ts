export const base64ToHex = (base64Data: string): `0x${string}` =>
  `0x${Buffer.from(base64Data, 'base64').toString('hex')}`
