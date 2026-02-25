export function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  // Удаляем лишние пробелы
  normalized = normalized.replace(/\s+/g, ' ');
  // Заменяем разделители времени (например 13-00, 13.00 на 13:00)
  normalized = normalized.replace(/(\d{1,2})[-.](\d{2})/g, '$1:$2');
  // Транслитерация частых опечаток
  normalized = normalized.replace(/ё/g, 'е');
  return normalized;
}