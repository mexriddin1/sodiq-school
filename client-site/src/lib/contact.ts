export function splitContactAddresses(value: string | null | undefined): string[] {
  return String(value || '')
    .split(/\r?\n|\s*\|\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function firstContactAddress(value: string | null | undefined): string {
  return splitContactAddresses(value)[0] || '';
}
