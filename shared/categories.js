const CATEGORIES = [
  "Їжа / Магазини", "Їжа / Кафе",
  "Благодійність",
  "Велосипед / Аксесуари", // "Велосипед / Покупка",
  "Зарплата",
  "Зв'язок / Мобільний", "Зв'язок / Інтернет",
  "Здоров'я / Лікарі", "Здоров'я / Ліки", "Здоров'я / Страховка", "Здоров'я / Інше",
  "Квартира / Оренда", "Квартира / Комуналка", "Квартира / Ремонт",
  "Корегування",
  "Краса / Косметика", "Краса / Послуги",
  "Одяг / Одяг", "Одяг / Взуття", "Одяг / Аксесуари", "Одяг / Ремонт",
  "Побут / Побутова хімія і гігієна", "Побут / Посуд", "Побут / Меблі", "Побут / Різне",
  "Подарунки / Друзям і рідним", "Подарунки / Колегам", "Подарунки / Собі",
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
  "Цифрові продукти / Музика", "Цифрові продукти / ПЗ",
  "Інвестиції"
];

const CATEGORIES_DESCRIPTION_MATCHES = [
  {
    keywords: ['BILLA', 'SILPO', 'LOTOK'],
    details: (keyword) => ({ category: 'Їжа / Магазини', description: `Продуктии в ${keyword}` })
  },
  {
    keywords: ['NOVUS', 'LOMONOS MAGAZIN PRODUK', 'LOMONOS PRODUKTOVIY'],
    details: { category: 'Їжа / Магазини', description: `Продуктии в Novus` }
  },
  {
    keywords: ['SHOP ATB'],
    details: { category: 'Їжа / Магазини', description: `Продуктии в АТБ` }
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
    keywords: ['Uber BV'],
    details: { category: 'Проїзд / Таксі', description: 'Таксі Uber' }
  },
  {
    keywords: ['BOOKINGUZGOV', 'UZ.GOV.UA'],
    details: { category: 'Подорожі / Переїзд', description: 'Квитки на потяг' }
  },
  {
    keywords: ['RESERVED', 'MOHITO', 'CROPPTOWN', 'HOUSE', 'NEW YORKER', 'ZARA', 'BEFREE', 'OLKO', 'OGGI', 'STRADIVARIUS'],
    details: (keyword) => ({ category: 'Одяг / Одяг', description: `Одяг в ${keyword}` })
  },
  {
    keywords: ['INTERTOP'],
    details: (keyword) => ({ category: 'Одяг / Взуття', description: `Взятту в ${keyword}` })
  }
];

const UKRSIB_CATEGORY_MATCHES = [
  {
    ukrsibCategory: 'Продуктові магазини',
    details: { category: "Їжа / Магазини", description: `Продуктии в магазині` },
  },
  {
    ukrsibCategory: 'Метро',
    details: { category: 'Проїзд / Громадський траспорт', description: 'Метро' }
  },
  {
    ukrsibCategory: 'Кафе та ресторани',
    details: { category: 'Розваги / Кафе ресторани клуби' }
  },
  {
    ukrsibCategory: 'Аптеки',
    details: { category: "Здоров'я / Ліки" }
  },
  {
    ukrsibCategory: 'Спортивні товари',
    details: { category: 'Спорт / Спорядження' }
  },
  {
    ukrsibCategory: 'Кіно та театри',
    details: { category: 'Розваги / Кіно' }
  },
  {
    ukrsibCategory: 'Догляд за собою',
    details: { category: 'Краса / Косметика' }
  },
  {
    ukrsibCategory: 'Потяг',
    details: { category: 'Подорожі / Переїзд' }
  },
  {
    ukrsibCategory: "Меблі та інтер'єр",
    details: { category: 'Побут / Різне' }
  },
  {
    ukrsibCategory: 'Проценти за депозитом',
    details: { category: 'Інвестиції', description: 'Проценти за накопичувальним рахунком' }
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

const guessByUkrsibCategory = (uksibCategory) => {
  const match = UKRSIB_CATEGORY_MATCHES.find((cat) => cat.ukrsibCategory === uksibCategory);
  if (match) return match.details;
};

const guessTransactionDetails = ({ description, ukrsibCategory }) => (
  guessByDescription(description) || guessByUkrsibCategory(ukrsibCategory) || {}
);
