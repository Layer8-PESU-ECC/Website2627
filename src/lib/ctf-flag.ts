export const CTF_FLAG_FORMAT = "Layer8{...}";

// Shared by the browser's HTML validation and the server-side actions.
// The body must be non-empty and cannot contain nested braces or line breaks.
export const CTF_FLAG_INPUT_PATTERN = String.raw`Layer8\{[^{}\r\n]+\}`;

const CTF_FLAG_PATTERN = new RegExp(`^${CTF_FLAG_INPUT_PATTERN}$`);

export function isCanonicalCtfFlag(value: string) {
  return value.length <= 512 && CTF_FLAG_PATTERN.test(value);
}
