const CATEGORIES = [
  "Їжа / Кафе",
  "Їжа / Магазини",
  "Їжа / Питна вода",

  "Благодійність",

  "Будинок / Дизайн іртер'єру",
  "Будинок / Оформлення документів",
  "Будинок / Покупка",

  "Відрядження / Переїзд",
  "Відрядження / Різне",
  "Відрядження / Транспорт",
  "Відрядження / Харчування",

  "Дитина / Великі покупки",
  "Дитина / Гігієна і косметика",
  "Дитина / Одяг",
  "Дитина / Різне",
  "Дитина / Харчування",

  "Допомога батькам",

  "Доходи / Інвестиції",
  "Доходи / Кешбек",
  "Доходи / Подарунки",

  "Зарплата",

  "Зв'язок / Інтернет",
  "Зв'язок / Мобільний",

  "Здоров'я / Інше",
  "Здоров'я / Лікарі",
  "Здоров'я / Ліки",
  "Здоров'я / Страховка",

  "Квартира / Комуналка",
  "Квартира / Оренда",
  "Квартира / Ремонт",

  "Корегування",

  "Краса / Косметика",
  "Краса / Послуги",

  "Навчання / Мовні курси",

  "Одяг / Аксесуари",
  "Одяг / Взуття",
  "Одяг / Одяг",
  "Одяг / Ремонт",

  "Побут / Меблі",
  "Побут / Побутова хімія і гігієна",
  "Побут / Посуд",
  "Побут / Різне",

  "Подарунки / Друзям і рідним",
  "Подарунки / Колегам",
  "Подарунки / Собі",

  "Подорожі / Автопрокат",
  "Подорожі / Витрати на авто",
  "Подорожі / Відрядження",
  "Подорожі / Екскурсії",
  "Подорожі / Заправка машини",
  "Подорожі / Переїзд",
  "Подорожі / Проживання",
  "Подорожі / Путівки",
  "Подорожі / Різне",
  "Подорожі / Сувеніри",
  "Подорожі / Транспорт",
  "Подорожі / Харчування",

  "Послуги / Банківські",
  "Послуги / Державні",

  "Проїзд / Громадський траспорт",
  "Проїзд / Міжміський",
  "Проїзд / Таксі",

  "Розваги / Активний відпочинок",
  "Розваги / Вдома і на природі",
  "Розваги / Кафе ресторани клуби",
  "Розваги / Концерти",
  "Розваги / Кіно",
  "Розваги / Різне",

  "Спорт / Спорядження",
  "Спорт / Тренування",

  "Техніка / Електроніка",
  "Техніка / Побутова",

  "ФОП / Консалтинг",
  "ФОП / Податки",
  "ФОП / Суборенда",

  "Цифрові продукти / Ігри",
  "Цифрові продукти / Музика",
  "Цифрові продукти / ПЗ"
];

const CATEGORIES_DESCRIPTION_MATCHES = [
  {
    keywords: ['KYIVSKYI METRO'],
    details: { category: "Проїзд / Громадський траспорт", description: 'Метро' }
  },
  {
    keywords: ['UBER', 'BOLT', 'WFPTAXI'],
    details: (keyword) => {
      const taxiNames = {
        'UBER': 'Uber',
        'BOLT': 'Bolt',
        'WFPTAXI': 'Uklon'
      };
      return { category: 'Проїзд / Таксі', description: `Таксі ${taxiNames[keyword]}` };
    }
  },
  {
    keywords: ['BOOKINGUZGOV', 'UZ.GOV.UA'],
    details: { category: 'Подорожі / Переїзд', description: 'Квитки на потяг' }
  },
  {
    keywords: ['AVIS PREPAID'],
    details: { category: 'Подорожі / Автопрокат', description: 'Оренда авто в Avis' }
  },
  {
    keywords: ['BILLA', 'SILPO', 'NOVUS', 'LOMONOS MAGAZIN PRODUK', 'LOMONOS PRODUKTOVIY', 'LOTOK', 'VELMART', 'AUCHAN',
      'SHOP ATB', 'SUPERMARKETEKO', 'METRO', 'SamMarket', 'MAGAZINKOLO', 'MEGAMARKET'],
    details: (keyword) => {
      const shopNames = {
        'BILLA': 'Billa',
        'SILPO': 'Сільпо',
        'SLPO': 'Сільпо',
        'NOVUS': 'Novus',
        'LOMONOS MAGAZIN PRODUK': 'Novus',
        'LOMONOS PRODUKTOVIY': 'Novus',
        'LOTOK': 'Лотку',
        'VELMART': 'Велмарті',
        'AUCHAN': 'Ашані',
        'SHOP ATB': 'АТБ',
        'SUPERMARKETEKO': 'Еко маркет',
        'METRO': 'Metro',
        'SamMarket': 'Сам маркет',
        'MAGAZINKOLO': 'Kolo',
        'MEGAMARKET': 'Мегамаркеті'
      };
      return { category: 'Їжа / Магазини', description: `Продуктии в "${shopNames[keyword]}"` };
    }
  },
  {
    keywords: ['RPRODUKTOVIYMAGAZIN', 'MAGAZINMARKET', 'MINI MARKET'],
    details: { category: "Їжа / Магазини", description: 'Продуктии в магазині' }
  },
  {
    keywords: ['McDonald', 'KFC', 'AROMAKAVA'],
    details: (keyword) => {
      const cafeNames = {
        'McDonald': "McDonald's",
        'KFC': "KFC",
        'AROMAKAVA': "Aroma Kava",
      };
      return { category: 'Їжа / Кафе', description: `Обід в "${cafeNames[keyword]}"` };
    }
  },
  {
    keywords: ['Evrosmak', 'Dolchesalaterija', 'Cafe Dinners'],
    details: (keyword) => ({ category: 'Їжа / Кафе', description: `Обід на роботі в "${keyword}"` })
  },
  {
    keywords: ['UA KIYEV Ivana F Yizha', /Yizha.+KIYEV/],
    details: { category: 'Їжа / Кафе', description: 'Бургери на роботі "під мостом"' }
  },
  {
    keywords: ['EVRASIYA', 'EVRAZIYAYA', 'PESTO CAFE', 'GENATSVALEIHIN', 'Restoran Mill'],
    details: (keyword) => {
      const cafeNames = {
        'EVRASIYA': 'Євразії',
        'EVRAZIYAYA': 'Євразії',
        'PESTO CAFE': 'Pesto Cafe',
        'GENATSVALEIHIN': 'Геніцвалі і Хінкалі',
        'Restoran Mill': 'Mill Hub'
      };
      return { category: 'Розваги / Кафе ресторани клуби', description: `Вечеря в "${cafeNames[keyword]}"` };
    }
  },
  {
    keywords: ['EPITSENTR', 'EPICENTR'],
    details: { category: 'Побут / Побутова хімія і гігієна', description: 'Покупки в Епіцентрі' }
  },
  {
    keywords: ['RESERVED', 'MOHITO', 'CROPPTOWN', 'CROPP TOWN', 'HOUSE', 'NEW YORKER', 'ZARA', 'BEFREE', 'OLKO',
      'OGGI', 'STRADIVARIUS'],
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
    keywords: ['Google Music'],
    details: { category: 'Цифрові продукти / Музика', description: 'Підписка Google Music' }
  },
  {
    keywords: ['EMAYDI GRU'],
    details: { category: "Здоров'я / Лікарі", description: 'Прийом лікаря в клініці "R+"' }
  },
  {
    keywords: ['ЗАРАХУВАННЯ З/П', 'ЗАРАХ.З/П'],
    details: { category: 'Зарплата', description: 'Зарплата' }
  },
  {
    keywords: ['Утримання податку'],
    details: { category: 'Послуги / Державні', description: 'Податок на доходи' }
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
    keywords: ['Перерахування винагороди згідно транзакції'],
    details: { category: 'Доходи / Кешбек', description: 'Кешбек за CashYouClub' }
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
    return typeof match.details === 'function' ? match.details(matchedKeyword, description) : match.details;
  }
};

const guessByBankCategory = (bankCategory) => {
  const match = BANK_CATEGORY_MATCHES.find((cat) => cat.bankCategory === bankCategory);
  if (match) return match.details;
};

const guessTransactionDetails = ({ description, bankCategory }) => (
  guessByDescription(description) || guessByBankCategory(bankCategory) || {}
);
