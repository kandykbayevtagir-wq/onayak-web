export const DIRECTOR_ID = 5720865346;
export const ADMIN_ID = 5623597772;
export const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];
export const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
export const TASK_TEMPLATES = ["Заказать бахилы", "Заказать салфетки", "Заказать антисептик", "Стерилизация", "Обзвонить записи", "Вынести мусор"];

export const PRICE_LIST = [
  { category: "Педикюр", items: [{ name: "Обработка стопы", price: 12000 }, { name: "С онихомикозом", price: 15000 }] },
  { category: "Вросший ноготь", items: [{ name: "Удаление сегмента", price: 7000 }, { name: "Тампонирование", price: 1000 }] },
  { category: "Прочее", items: [{ name: "Титановая нить", price: 12000 }, { name: "Осмотр", price: 3000 }] }
];

export const DICT = {
  ru: {
    subtitle: "Центр Подологии", verified: "Verified by OnAyak", address: "Актобе, ул. Алии Молдагуловой 54а",
    insta: "Наш Instagram", applyBtn: "Оставить заявку", modalTitle: "Запись на прием", 
    nameLabel: "Ваше имя", problemLabel: "Выберите проблему:", submitBtn: "Отправить заявку",
    successMsg: "Успешно! Мы свяжемся с вами.", callAdmin: "Позвонить администратору",
    pickDate: "Выберите дату:", pickTime: "Выберите время:", booked: "Занято",
    problems: ["Вросший ноготь", "Грибок", "Мозоли", "Трещины", "Консультация"],
    menuBtn: "Меню", notifications: "Уведомления", emptyNotif: "Нет новых уведомлений",
    tabActive: "Активные", tabDone: "Архив", tabAppointments: "Записи", tabOrders: "Заказы",
    myLeads: "Профиль", leadsTitle: "CRM: Управление", shopTab: "МАГАЗИН", priceTab: "ПРАЙС",
    aiPlaceholder: "Спросите что угодно (например: хочу записаться на 14:00)..."
  },
  kz: {
    subtitle: "Подология орталығы", verified: "OnAyak растаған", address: "Ақтөбе, Әлия Молдағұлова 54а",
    insta: "Біздің Instagram", applyBtn: "Өтінім қалдыру", modalTitle: "Қабылдауға жазылу",
    nameLabel: "Атыңыз", problemLabel: "Мәселені таңдаңыз:", submitBtn: "Өтінімді жіберу",
    successMsg: "Жіберілді! Біз сізбен хабарласамыз.", callAdmin: "Администраторға қоңырау шалу",
    pickDate: "Күнді таңдаңыз:", pickTime: "Уақытты таңдаңыз:", booked: "Бос емес",
    problems: ["Тырнақ өсуі", "Саңырауқұлақ", "Сүйел", "Жарықтар", "Кеңес алу"],
    menuBtn: "Мәзір", notifications: "Хабарламалар", emptyNotif: "Хабарламалар жоқ",
    tabActive: "Белсенді", tabDone: "Мұрағат", tabAppointments: "Жазбалар", tabOrders: "Тапсырыстар",
    myLeads: "Профиль", leadsTitle: "CRM: Басқару", shopTab: "ДҮКЕН", priceTab: "БАҒАЛАР",
    aiPlaceholder: "Кез келген нәрсені сұраңыз (мысалы: бағасы қанша)..."
  }
};

// --- AI MODULE TYPES & KNOWLEDGE BASE ---
export type Intent = "INFO" | "PRICE" | "BOOKING" | "SHOP" | "FALLBACK";
export type ActionType = "NONE" | "SWITCH_TAB" | "OPEN_BOOKING_MODAL" | "PREFILL_FORM" | "SHOP_SEARCH";

export type KBItem = {
  id: string;
  intent: Intent;
  triggers: { keywords: string[] };
  response: { ru: string; kz: string };
  action: { type: ActionType; payload?: any };
};

export const KB: KBItem[] = [
  {
    id: "booking_intent",
    intent: "BOOKING",
    triggers: { keywords: ["записаться", "запиши", "бронь", "жазылу", "уақыт", "прийти", "свободно"] },
    response: {
      ru: "Отличный выбор! Открываю форму записи...",
      kz: "Керемет! Жазылу формасын ашудамын..."
    },
    action: { type: "OPEN_BOOKING_MODAL" }
  },
  {
    id: "price_intent",
    intent: "PRICE",
    triggers: { keywords: ["сколько", "цена", "стоит", "прайс", "бағасы", "қанша", "стоимость"] },
    response: {
      ru: "Наши услуги стоят от 3 000 ₸ до 20 000 ₸. Открываю прайс-лист для вас.",
      kz: "Қызмет бағасы 3 000 ₸ бастап 20 000 ₸ дейін. Баға тізімін ашудамын."
    },
    action: { type: "SWITCH_TAB", payload: { tab: "prices" } }
  },
  {
    id: "shop_intent",
    intent: "SHOP",
    triggers: { keywords: ["купить", "заказать", "товар", "доставка", "крем", "пудра"] },
    response: {
      ru: "У нас есть отличные профессиональные средства. Перевожу вас в магазин.",
      kz: "Бізде кәсіби құралдар бар. Сізді дүкенге ауыстырамын."
    },
    action: { type: "SWITCH_TAB", payload: { tab: "shop" } }
  },
  {
    id: "info_intent",
    intent: "INFO",
    triggers: { keywords: ["подолог", "адрес", "где", "находитесь", "контакты", "график"] },
    response: {
      ru: "Мы находимся по адресу: Актобе, ул. Молдагуловой 54а. Работаем с 08:00 до 22:00. Мы специализируемся на профессиональном уходе за стопами.",
      kz: "Мекенжайымыз: Ақтөбе, Молдағұлова 54а. Жұмыс уақыты: 08:00-ден 22:00-ге дейін."
    },
    action: { type: "NONE" }
  }
];