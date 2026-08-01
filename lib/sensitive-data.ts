const FINNISH_IBAN = /\bFI\d{16}\b/i;
const FINNISH_PERSONAL_ID = /\b\d{6}[+\-A-Z]\d{3}[0-9A-Z]\b/i;

export function containsRestrictedPersonalData(values: unknown[]): boolean {
  return values.some((value) => {
    if (typeof value !== "string") return false;
    const compact = value.replace(/\s+/g, "").toUpperCase();
    return FINNISH_IBAN.test(compact) || FINNISH_PERSONAL_ID.test(compact);
  });
}
