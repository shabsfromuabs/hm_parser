const CATEGORIES = [
  "Їжа / Магазини", "Їжа / Кафе",
  "Благодійність",
  "Велосипед / Аксесуари", // "Велосипед / Покупка",
  "Зв'язок / Мобільний", "Зв'язок / Інтернет",
  "Здоров'я / Лікарі", "Здоров'я / Ліки", "Здоров'я / Страховка", "Здоров'я / Інше",
  "Квартира / Оренда", "Квартира / Комуналка", "Квартира / Ремонт",
  "Корегування",
  "Краса / Косметика", "Краса / Послуги",
  "Одяг / Одяг", "Одяг / Взуття", "Одяг / Аксесуари", "Одяг / Ремонт",
  "Побут / Побутова хімія і гігієна", "Побут / Посуд", "Побут / Меблі", "Побут / Різне",
  "Подарунки / Друзям і рідним", "Подарунки / Колегам", "Подарунки / Собі", "Допомога батькам",
  "Подорожі / Оренда машини", "Подорожі / Заправка машини", "Подорожі / Переїзд",
  "Подорожі / Транспорт", "Подорожі / Харчування", "Подорожі / Проживання", "Подорожі / Екскурсії", "Подорожі / Сувеніри",
  "Подорожі / Віза", "Подорожі / Путівки",
  "Подорожі / Різне", "Подорожі / Речі для подорожей",
  "Послуги / Банківські", "Послуги / Державні",
  "Проїзд / Громадський траспорт", "Проїзд / Таксі",
  "Розваги / Активний відпочинок", "Розваги / Вдома і на природі", "Розваги / Кафе ресторани клуби",
  "Розваги / Концерти", "Розваги / Кіно", "Розваги / Різне",
  "Секс / Контрацепція",
  "Спорт / Спорядження", "Спорт / Тренування", "Спорт / Харчування",
  "Тварини / Ветеринарія", "Тварини / Різне",
  "Техніка / Електроніка", "Техніка / Побутова", "Техніка / Обсллуговування", "Техніка / Ремонт",
  "ФОП / Консалтинг", "ФОП / Податки", "ФОП / Суборенда",
  "Цифрові продукти / Музика", "Цифрові продукти / ПЗ", "Цифрові продукти / Ігри",
  "Доходи / Інвестиції", "Доходи / Кешбек", "Доходи / Подарунки",
  "Зарплата"
];

const CATEGORIES_DESCRIPTION_MATCHES = [
  {
    keywords: ['KYIVSKYI METRO'],
    details: { category: "Проїзд / Громадський траспорт", description: 'Метро' }
  },
  {
    keywords: ['BILLA', 'SILPO', 'LOTOK', 'VELMART', 'AUCHAN', 'SHOP ATB', 'SUPERMARKETEKO', 'METRO', 'SamMarket'],
    details: (keyword) => {
      const shopNames = {
        'BILLA': 'Billa',
        'SILPO': 'Сільпо',
        'SLPO': 'Сільпо',
        'LOTOK': 'Лоток',
        'VELMART': 'Велмарт',
        'AUCHAN': 'Ашан',
        'SHOP ATB': 'АТБ',
        'SUPERMARKETEKO': 'Еко маркет',
        'METRO': 'Metro',
        'SamMarket': 'Сам маркет',
      };
      return { category: 'Їжа / Магазини', description: `Продуктии в "${shopNames[keyword]}"` };
    }
  },
  {
    keywords: ['NOVUS', 'LOMONOS MAGAZIN PRODUK', 'LOMONOS PRODUKTOVIY'],
    details: { category: 'Їжа / Магазини', description: 'Продуктии в "Novus"' }
  },
  {
    keywords: ['RPRODUKTOVIYMAGAZIN', 'MAGAZINMARKET'],
    details: { category: "Їжа / Магазини", description: 'Продуктии в магазині' }
  },
  {
    keywords: ['McDonald'],
    details: { category: 'Їжа / Кафе', description: "Обід в McDonald's" }
  },
  {
    keywords: ['EVROSMAK'],
    details: { category: 'Їжа / Кафе', description: 'Обід на роботі в бізнес центрі' }
  },
  {
    keywords: ['EVRASIYA'],
    details: { category: 'Розваги / Кафе ресторани клуби', description: 'Вечеря в Євразії' }
  },
  {
    keywords: ['EPITSENTR', 'EPICENTR'],
    details: { category: 'Побут / Побутова хімія і гігієна', description: 'Покупки в Епіцентрі' }
  },
  {
    keywords: ['Uber BV', 'UBERTRIP', 'UBER trip'],
    details: { category: 'Проїзд / Таксі', description: 'Таксі Uber' }
  },
  {
    keywords: ['TAXIFY', 'TXFY.ME'],
    details: { category: 'Проїзд / Таксі', description: 'Таксі TAXIFY' }
  },
  {
    keywords: ['WFPTAXI'],
    details: { category: 'Проїзд / Таксі', description: 'Таксі Uklon' }
  },
  {
    keywords: ['BOOKINGUZGOV', 'UZ.GOV.UA'],
    details: { category: 'Подорожі / Переїзд', description: 'Квитки на потяг' }
  },
  {
    keywords: ['RESERVED', 'MOHITO', 'CROPPTOWN', 'CROPP TOWN', 'HOUSE', 'NEW YORKER', 'ZARA', 'BEFREE', 'OLKO', 'OGGI', 'STRADIVARIUS'],
    details: (keyword) => ({ category: 'Одяг / Одяг', description: `Одяг в "${keyword}"` })
  },
  {
    keywords: ['INTERTOP'],
    details: (keyword) => ({ category: 'Одяг / Взуття', description: `Взятту в "${keyword}"` })
  },
  {
    keywords: ['SALONKRASY'],
    details: { category: 'Краса / Послуги', description: 'Стрижка' }
  },
  {
    keywords: ['Утримання податку'],
    details: { category: 'Послуги / Державні', description: 'Податок на доходи' }
  },
  {
    keywords: ['ЗАРАХУВАННЯ З/П', 'ЗАРАХ.З/П'],
    details: { category: 'Зарплата', description: 'Зарплата' }
  },
  {
    keywords: ['Виплата нарах. відсотків'],
    details: { category: 'Доходи / Інвестиції', description: 'Проценти за накопичувальним рахунком' }
  },
  {
    keywords: ['винагороди в рамках акції Cash back'],
    details: { category: 'Доходи / Кешбек', description: 'Кешбек за кредиткою' }
  },
  {
    keywords: ['Google Music'],
    details: { category: 'Цифрові продукти / Музика', description: 'Підписка Google Music' }
  }
];

const BANK_CATEGORY_MATCHES = [
  // Urksib
  {
    bankCategory: 'Продуктові магазини',
    details: { category: "Їжа / Магазини", description: 'Продуктии в магазині' },
  },
  {
    bankCategory: 'Метро',
    details: { category: 'Проїзд / Громадський траспорт', description: 'Метро' }
  },
  {
    bankCategory: 'Кафе та ресторани',
    details: { category: 'Розваги / Кафе ресторани клуби' }
  },
  {
    bankCategory: 'Аптеки',
    details: { category: "Здоров'я / Ліки" }
  },
  {
    bankCategory: 'Спортивні товари',
    details: { category: 'Спорт / Спорядження' }
  },
  {
    bankCategory: 'Кіно та театри',
    details: { category: 'Розваги / Кіно' }
  },
  {
    bankCategory: 'Догляд за собою',
    details: { category: 'Краса / Косметика' }
  },
  {
    bankCategory: 'Потяг',
    details: { category: 'Подорожі / Переїзд' }
  },
  {
    bankCategory: "Меблі та інтер'єр",
    details: { category: 'Побут / Різне' }
  },
  {
    bankCategory: 'Проценти за депозитом',
    details: { category: 'Доходи / Інвестиції', description: 'Проценти за накопичувальним рахунком' }
  }
];

const getCategories = () => CATEGORIES;

const guessByDescription = (description) => {
  let matchedKeyword;
  const match = CATEGORIES_DESCRIPTION_MATCHES.find((cat) => {
    return cat.keywords.find((keyword) => {
      if (description.match(new RegExp(keyword, 'i'))) {
        matchedKeyword = keyword;
        return true;
      }
    });
  });
  if (match) {
    return typeof match.details === 'function' ? match.details(matchedKeyword) : match.details;
  }
};

const guessByBankCategory = (bankCategory) => {
  const match = BANK_CATEGORY_MATCHES.find((cat) => cat.bankCategory === bankCategory);
  if (match) return match.details;
};

const guessTransactionDetails = ({ description, bankCategory }) => (
  guessByDescription(description) || guessByBankCategory(bankCategory) || {}
);
