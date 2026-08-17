export function shortenAddress(address: string, visibleCharacters = 4) {
  return `${address.slice(0, visibleCharacters + 2)}…${address.slice(-visibleCharacters)}`;
}
