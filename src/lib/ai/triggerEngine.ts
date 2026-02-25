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

export function analyzeInput(rawText: string, lang: 'ru' | 'kz'): AnalyzeResult {
  const text = normalizeText(rawText);
  
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
      if (text.includes(kw)) score += 1;
    }
    
    if (forcedBooking && item.intent === 'BOOKING') score += 2; 

    if (score > 0) {
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      } else if (score === maxScore && bestMatch) {
        if (INTENT_PRIORITY[item.intent] > INTENT_PRIORITY[bestMatch.intent]) {
          bestMatch = item;
        }
      }
    }
  }

  let finalIntent: Intent = bestMatch ? bestMatch.intent : "FALLBACK";
  
  // ВОТ НОВАЯ ФРАЗА, КОГДА ОН НЕ ПОНЯЛ:
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