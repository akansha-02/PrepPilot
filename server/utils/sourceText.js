export function normalizeSourceText(value) {
  return String(value || '').replace(/\r\n/g, '\n').trim();
}