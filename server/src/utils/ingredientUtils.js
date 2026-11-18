export function normalizeIngredientName(value) {
  return value
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('vi');
}
