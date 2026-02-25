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

// ВОССТАНОВЛЕНЫ ВСЕ ПРОПАВШИЕ СТРОКИ И МАССИВЫ
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
    aiPlaceholder: "Сообщение...",
    shopTitle: "Магазин", orderBtn: "Заказать", deliveryModalTitle: "Заказ товара", productLabel: "Выберите товар:", commentLabel: "Комментарий (опционально):", submitting: "Отправка...", status_new: "Новая", status_progress: "В работе", status_completed: "Выполнено", deleteBtn: "Удалить",
    products: [
      { id: 1, name: "Пудра для стоп", desc: "Абсорбирующая пудра против потливости и запаха." },
      { id: 2, name: "Крем с мочевиной", desc: "Увлажняющий крем для сухой кожи и трещин." },
      { id: 3, name: "Масло для кутикулы", desc: "Профессиональное масло для восстановления." }
    ],
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    aboutText: "Сервис для автоматизации работы подологического центра.", termsTitle: "Пользовательское соглашение", termsText: "Используя приложение, вы соглашаетесь с обработкой данных.", acceptTermsBtn: "Согласен", clinicInfoTitle: "О клинике", clinicInfoExperience: "Более 5 лет опыта", clinicInfoMed: "Стерильный инструмент", clinicInfoTech: "Современное оборудование", clinicInfoNote: "Безопасность превыше всего"
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
    aiPlaceholder: "Хабарлама...",
    shopTitle: "Дүкен", orderBtn: "Тапсырыс беру", deliveryModalTitle: "Тауарға тапсырыс", productLabel: "Тауарды таңдаңыз:", commentLabel: "Пікір (міндетті емес):", submitting: "Жіберілуде...", status_new: "Жаңа", status_progress: "Орындалуда", status_completed: "Аяқталды", deleteBtn: "Жою",
    products: [
      { id: 1, name: "Табан ұнтағы", desc: "Тершеңдік пен иіске қарсы сіңіргіш ұнтақ." },
      { id: 2, name: "Мочевина қосылған крем", desc: "Құрғақ теріге және жарықтарға арналған крем." },
      { id: 3, name: "Кутикула майы", desc: "Қалпына келтіруге арналған кәсіби май." }
    ],
    days: ["Жс", "Дс", "Сс", "Ср", "Бс", "Жм", "Сн"],
    months: ["Қаң", "Ақп", "Нау", "Сәу", "Мам", "Мау", "Шіл", "Там", "Қыр", "Қаз", "Қар", "Жел"],
    aboutText: "Подология орталығының жұмысын автоматтандыру қызметі.", termsTitle: "Пайдаланушы келісімі", termsText: "Қосымшаны пайдалана отырып, сіз деректерді өңдеуге келісесіз.", acceptTermsBtn: "Келісемін", clinicInfoTitle: "Емхана туралы", clinicInfoExperience: "5 жылдан астам тәжірибе", clinicInfoMed: "Стерильді құрал", clinicInfoTech: "Заманауи жабдықтар", clinicInfoNote: "Қауіпсіздік бәрінен жоғары"
  }
};

export type Intent = "INFO" | "PRICE" | "BOOKING" | "SHOP" | "FALLBACK" | "SERVICE_REQUEST" | "CALL_ADMIN" | "GREETING";
export type ActionType = "NONE" | "SWITCH_TAB" | "OPEN_BOOKING_MODAL" | "SHOW_SLOTS" | "CANCEL_BOOKING" | "OPEN_CALL_ADMIN_FORM" | "ADD_NOTE_TO_VISIT" | "SHOP_SEARCH" | "OPEN_TAXI";

export type KBItem = {
  id: string;
  intent: Intent;
  triggers: { keywords: string[] };
  response: { ru: string; kz: string };
  action: { type: ActionType; payload?: any };
};

export const KB: KBItem[] = [
  {
    id: "greet_1",
    intent: "GREETING",
    triggers: { keywords: ["привет", "здравствуйте", "салем", "сәлеметсіз бе", "кто ты", "ты кто", "бот", "что ты умеешь", "ассистент", "добрый день"] },
    response: {
      ru: "Здравствуйте! Я виртуальный ассистент OnAyak AI. Я запрограммирован исключительно для того, чтобы помочь вам записаться на прием, показать цены и рассказать о клинике. Чем могу помочь?",
      kz: "Сәлеметсіз бе! Мен OnAyak AI виртуалды көмекшісімін. Мен тек қабылдауға жазу, бағаларды көрсету және емхана туралы ақпарат беру үшін бағдарламаланғанмын. Немен көмектесе аламын?"
    },
    action: { type: "NONE" }
  },
  {
    id: "bk_start_1",
    intent: "BOOKING",
    triggers: { keywords: ["запиши", "запишите", "записаться", "хочу записаться", "бронь", "бронька", "запись", "қабылдауға жаз", "жазылыңыз", "жазылғым келеді"] },
    response: {
      ru: "Ок. На какой день и время вам удобно? Могу показать свободные окна.",
      kz: "Жақсы. Қай күн және қай уақыт ыңғайлы? Бос уақыттарды көрсетейін."
    },
    action: { type: "OPEN_BOOKING_MODAL", payload: { clearTime: true } }
  },
  {
    id: "price_general_1",
    intent: "PRICE",
    triggers: { keywords: ["цена", "сколько стоит", "прайс", "стоимость", "бағасы", "қанша тұрады", "прайс бар ма"] },
    response: {
      ru: "Открываю прайс. Какая услуга интересует: обработка стоп, вросший ноготь, грибок, стельки?",
      kz: "Прайсты ашамын. Қай қызмет керек: табан, кірген тырнақ, саңырауқұлақ, ұлтарақ?"
    },
    action: { type: "SWITCH_TAB", payload: { tab: "prices" } }
  },
  {
    id: "drink_coffee_1",
    intent: "SERVICE_REQUEST",
    triggers: { keywords: ["хочу кофе", "кофе", "сделайте кофе", "кофе пожалуйста", "coffee", "кофе керек"] },
    response: {
      ru: "Ок. Отправил запрос баристе. Скоро ваш кофе будет готов ☕",
      kz: "Жақсы. Баристаға сұраныс жіберілді. Кофеңіз жақында дайын болады ☕"
    },
    action: { type: "NONE" }
  },
  {
    id: "shop_open_1",
    intent: "SHOP",
    triggers: { keywords: ["магазин", "купить", "заказать", "товар", "наличие", "доставка", "дүкен", "сатып алу", "тапсырыс", "крем", "пудра"] },
    response: {
      ru: "Ок. Открываю магазин профессиональных средств.",
      kz: "Жақсы. Кәсіби құралдар дүкенін ашамын."
    },
    action: { type: "SWITCH_TAB", payload: { tab: "shop" } }
  },
  {
    id: "info_schedule_1",
    intent: "INFO",
    triggers: { keywords: ["график", "режим", "во сколько", "до скольки", "работаете", "жұмыс уақыты", "қашан ашық", "адрес", "где вы"] },
    response: {
      ru: "Мы находимся в Актобе, ул. Молдагуловой 54а. Работаем ежедневно с 08:00 до 22:00. Записать вас?",
      kz: "Біз Ақтөбедеміз, Молдағұлова 54а. Күн сайын 08:00–22:00 жұмыс істейміз. Жазайын ба?"
    },
    action: { type: "NONE" }
  }
];