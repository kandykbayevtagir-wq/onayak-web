import { KB, Intent, ActionType } from "../../config/constants";
import { normalizeText } from "./preprocess";

export type AnalyzeResult = {
  normalizedText: string;
  intent: Intent;
  confidence: number;
  entities: { time?: string; ambiguous?: boolean };
  response: string;
  action: { type: ActionType; payload?: any };
};

const INTENT_PRIORITY: Record<Intent, number> = {
  BOOKING: 7,
  CALL_ADMIN: 6,
  PRICE: 5,
  SHOP: 4,
  SERVICE_REQUEST: 3,
  INFO: 2,
  GREETING: 1,
  FALLBACK: 0
};

// Вспомогательная функция для нечеткого поиска (алгоритм Левенштейна)
// Позволяет прощать клиентам опечатки вроде "зопиши", "праис" и т.д.
function isFuzzyMatch(word: string, target: string, maxDistance: number): boolean {
  if (Math.abs(word.length - target.length) > maxDistance) return false;
  
  const matrix = Array(target.length + 1).fill(null).map(() => Array(word.length + 1).fill(null));

  for (let i = 0; i <= word.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= target.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= target.length; j++) {
    for (let i = 1; i <= word.length; i++) {
      const indicator = word[i - 1] === target[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // вставка
        matrix[j - 1][i] + 1, // удаление
        matrix[j - 1][i - 1] + indicator // замена
      );
    }
  }
  return matrix[target.length][word.length] <= maxDistance;
}

export function analyzeInput(rawText: string, lang: 'ru' | 'kz'): AnalyzeResult {
  const text = normalizeText(rawText);
  // Разбиваем текст пользователя на отдельные слова для поиска опечаток
  const words = text.split(/\s+/); 
  
  let time: string | undefined;
  let ambiguous = false;
  const timeRegex = /\b([01]?\d|2[0-3])[:.\- ]([0-5]\d)\b/g;
  const timeMatches = [...text.matchAll(timeRegex)];
  
  if (timeMatches.length > 0) {
    const rawTime = timeMatches[0][0];
    const [h, m] = rawTime.split(':');
    time = `${h.padStart(2, '0')}:${m}`; 
    if (timeMatches.length > 1) ambiguous = true;
  }

  let forcedBooking = !!time;
  let bestMatch = null;
  let maxScore = 0;

  for (const item of KB) {
    let score = 0;
    
    for (const kw of item.triggers.keywords) {
      // 1. Сначала проверяем точное вхождение всей фразы (дает больше баллов)
      if (text.includes(kw)) {
        score += 2; 
      } else {
        // 2. Если точного совпадения нет, проверяем нечеткое совпадение по словам
        const kwWords = kw.split(/\s+/);
        let matchCount = 0;
        
        for (const kWord of kwWords) {
          // Допускаем 1 опечатку для коротких слов, 2 для длинных (>4 букв)
          const maxDist = kWord.length > 4 ? 2 : 1;
          if (words.some(w => isFuzzyMatch(w, kWord, maxDist))) {
            matchCount++;
          }
        }
        
        // Если все слова из ключевой фразы нашлись с учетом опечаток
        if (matchCount === kwWords.length) {
          score += 1;
        }
      }
    }
    
    if (forcedBooking && item.intent === 'BOOKING') score += 2; 

    if (score > 0) {
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      } else if (score === maxScore && bestMatch) {
        // Разрешаем конфликты интентов с помощью приоритетов
        if (INTENT_PRIORITY[item.intent] > INTENT_PRIORITY[bestMatch.intent]) {
          bestMatch = item;
        }
      }
    }
  }

  let finalIntent: Intent = bestMatch ? bestMatch.intent : "FALLBACK";
  
  let responseText = bestMatch ? (bestMatch.response as any)[lang] : (lang === 'ru' 
    ? "Простите, я не понимаю. Я запрограммирован только на запись, выдачу прайса и базовой информации. Напишите «хочу записаться» или «покажи прайс»." 
    : "Кешіріңіз, түсінбедім. Мен тек жазылу, бағалар және базалық ақпарат беруге бағдарламаланғанмын. «Жазылу» немесе «бағасы» деп жазыңыз.");
    
  let actionData = bestMatch ? bestMatch.action : { type: "NONE" as ActionType };

  if (finalIntent === 'BOOKING' && time) {
    const h = parseInt(time.split(':')[0], 10);
    if (h < 8 || h >= 22) {
      responseText = lang === 'ru' 
        ? "Мы работаем с 08:00 до 22:00. Пожалуйста, выберите время в этом диапазоне." 
        : "Біз 08:00-ден 22:00-ге дейін жұмыс істейміз. Осы аралықтағы уақытты таңдаңыз.";
      actionData = { type: "OPEN_BOOKING_MODAL", payload: { clearTime: true } };
      time = undefined; 
    } else {
      responseText = lang === 'ru' 
        ? `Отлично, открываю форму записи. Время ${time} уже выбрано.` 
        : `Тамаша, жазылу формасын ашамын. Уақыт ${time} таңдалды.`;
    }
  }

  return {
    normalizedText: text,
    intent: finalIntent,
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0,
    entities: { time, ambiguous },
    response: responseText,
    action: actionData
  };
}