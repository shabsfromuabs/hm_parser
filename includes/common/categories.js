const CATEGORIES_DESCRIPTION_MATCHES = [
  // Авто
  {
    details: {
      category: "Авто / Аксесуари",
      description: "Покупки в Автобазі",
    },
    keywords: ["AUTOBAZA"],
  },
  {
    details: (descriptor) => ({
      category: "Авто / Заправка",
      description: `Заправка на "${descriptor}"`,
    }),
    keywords: { okko: "Окко", WOG: "Wog", shell: "Shell", orlen: "ORLEN" },
  },
  {
    details: { category: "Авто / Заправка" },
    keywords: ["AZS"],
  },
  {
    details: { category: "Авто / Догляд" },
    keywords: {
      "BP-WIKING JET WASH": "Мийка BP",
    },
  },
  {
    details: (descriptor) => ({
      category: "Авто / Парковка",
      description: `Парковка ${descriptor}`,
    }),
    keywords: {
      EKSPOTSENTR: "ВДНГ",
      "Interparking Polska": "Interparking",
      EUROPARK: "EUROPARK",
      "PANGO.*WARSZAWA": "Pango.pl",
      PARKOMETR: "Parkometr",
      "apcoa p and c": "apcoa",
      "apcoa.pl": "apcoa",
      "MPSA MPSA": "MPSA",
      "SSPP GDYNIA": "GDYNIA",
      "CAR PARK": "CAR PARK",
      "PARKING NORWIDA": "NORWIDA",
    },
  },
  // Будинок
  {
    details: {
      category: "Будинок / Комуналка",
      description: "Плата за газ",
    },
    keywords: ["IPAY.*UTILITI"],
  },
  // Дитина
  {
    details: (keyword) => ({
      category: "Дитина / Одяг",
      description: `Одяг в "${keyword}"`,
    }),
    keywords: ["Pepco"],
  },
  {
    details: {
      category: "Дитина / Розваги",
      description: "Дитяча кімната",
    },
    keywords: ["Fun Park", "Loopys World"],
  },
  {
    details: {
      category: "Дитина / Розваги",
      description: "Батути Jump city",
    },
    keywords: ["Jc Sp Zoo"],
  },
  // Доходи
  {
    details: (descriptor) => ({
      category: "Доходи / Кешбек",
      description: `Кешбек "${descriptor}"`,
    }),
    keywords: {
      "винагороди в рамках акції Cash back": "за Тревел-картою",
      "Перерахування винагороди згідно транзакції": "Кеш'ю Клаб",
    },
  },
  {
    details: {
      category: "Доходи / Інвестиції",
      description: "Проценти за накопичувальним рахунком",
    },
    keywords: ["Виплата нарах. відсотків"],
  },
  // Зарплата
  {
    details: { category: "Зарплата", description: "Зарплата" },
    keywords: ["ЗАРАХУВАННЯ З/П", "ЗАРАХ.З/П"],
  },
  // Зв'язок
  {
    details: {
      category: "Зв'язок / Мобільний",
      description: "Поповнення мобільного",
    },
    keywords: [
      "EasyPayVodafon",
      "t-Mobile",
      "PRTMN KYIVST",
      "Поповнення мобільного",
    ],
  },
  // Здоров'я
  {
    details: (descriptor) => ({
      category: "Здоров'я / Лікарі",
      description: `Прийом лікаря в клініці ${descriptor}`,
    }),
    keywords: {
      "EMAYDI GRU": "R+",
      "LUX MED": "LUX MED",
    },
  },
  {
    details: { category: "Здоров'я / Ліки", description: "Аптека" },
    keywords: ["Apteka", "SUPERPHARM"],
  },
  // Їжа
  {
    details: (descriptor) => ({
      category: "Їжа / Кафе",
      description: `Їжа в "${descriptor}"`,
    }),
    keywords: {
      McDonald: "McDonald's",
      KFC: "KFC",
      "Gdansk 3 - Osowa": "Max Premium Burgers (Osowa)",
      "Ranch.*Steak.*House": "Ranch Steak House",
      "Lviv.*Kruasan": "Львівські Круасани",
      "FS.*Gatne": "FS Суші в Мегамаркеті",
      "SYTYJ.*KUM": "Ситий Кум",
      pitsasushigori: "Gorilaz Pizza",
      Lepione: "Lepione",
      "Bk Gdynia Rivier": "Burger King",
      "Berlin Doner": "Berlin Doner Kebap",
      "SUSHI WORLD GDYNIA": "SUSHI WORLD GDYNIA",
      "Gdansk Osowa": "Gdansk Osowa",
      "Lodziarnia.*MAMMA.*MIA": "Lodziarnia MAMMA MIA",
      "TEJST WINGERT I WSPOLN": "Surf Burger",
      "DESI KEBAB": "Шаурма на Поморській DESI KEBAB",
      BAIKA: "кавярні BAIKA",
      "PL SBX": "Старбакс",
      Zabka: "Zabka",
      Zappka: "Zabka",
    },
  },
  {
    details: (descriptor) => ({
      category: "Їжа / Кафе",
      description: `Доставка з "${descriptor}"`,
    }),
    keywords: {
      Glovo: "Glovo",
    },
  },
  {
    details: (descriptor) => ({
      category: "Їжа / Обід на роботі",
      description: `Обід на роботі в "${descriptor}"`,
    }),
    keywords: {
      Evrosmak: "Столова на роботі",
      "CHIPOLLONE.*DANIELE": "Dolce Salato",
      Dolchesalaterija: "Dolce Salato",
      DolceSalato: "Dolce Salato",
      "Cafe.*Dinners": "Cafe Dinners",
      "KIYEV.+Yizha": "Бургери Yizha",
      "izha.+KIYEV": "Бургери Yizha",
      dagrasso: "Піца dagrasso.pl",
    },
  },
  {
    details: (descriptor) => ({
      category: "Їжа / Магазини",
      description: `Продуктии в "${descriptor}"`,
    }),
    keywords: {
      BILLA: "Billa",
      SILPO: "Сільпо",
      SLPO: "Сільпо",
      Fora: "Фора",
      NOVUS: "Novus",
      "KRYUKOVSHCHIN.*MCC": "Novus",
      LOTOK: "Лотку",
      VELMART: "Велмарті",
      AUCHAN: "Ашані",
      "SHOP.*ATB": "АТБ",
      SUPERMARKETEKO: "Еко маркет",
      SAMMARKET: "Сам маркет",
      MAGAZINKOLO: "Kolo",
      MEGAMARKET: "Мегамаркеті",
      SPAR: "Spar",
      "VELYKA.*KYSHENYA": "Велика кишеня",
      "LIQPAY.*FOP.*PASHINSKIJ": "Метро",
      "LIQPAY.*FOP.*BARABAN": "Метро",
      "PINGO DOCE": "Pingo Doce",
      LIDL: "Lidl",
      CONTINENTE: "Continente",
      Biedronka: "Biedronka",
      "JMP s.a. biedr": "Biedronka",
      "Express Afro-Indian": "Carefour",
      "Sklep Arkadiusz": "Leviatan",
      "PRZYSTANEK ZDROWIE": "Przystanek Zdrowie",
      CARREFOUR: "Carefour",
      "PIEKARNIA TRADYCYJNA": "Piekarnia Tradycijna",
      "WESOLA PANI": "Wesola Pani",
      eLeclerc: "eLeclerc",
      "PIEKARNIA MIELNIK": "Piekarnia Mielnik",
      "SKLEP GROSZ": "Sklep Grosz",
      LEWIATAN: "LEWIATAN",
      STOKROTKA: "STOKROTKA",
      UKRAINOCZKA: "UKRAINOCZKA",
      "MERKUS SKLEP":  "MERKUS (Galeria Metropolia)",
      "NETTO": "Netto",
    },
  },
  {
    details: {
      category: "Їжа / Магазини",
      description: "Продуктии в магазині",
    },
    keywords: [
      "RPRODUKT.*MAGAZIN",
      "MAGAZIN.*MARKET",
      "MINI.*MARKET",
      "EVEREST.*ROMNY",
    ],
  },
  // Краса
  {
    details: { category: "Краса / Послуги", description: "Стрижка" },
    keywords: ["SALONKRASY", "BARBERWAVE"],
  },
  // Одяг
  {
    details: (keyword) => ({
      category: "Одяг / Взуття",
      description: `Взятту в "${keyword}"`,
    }),
    keywords: ["INTERTOP"],
  },
  {
    details: (keyword) => ({
      category: "Одяг / Одяг",
      description: `Одяг в "${keyword}"`,
    }),
    keywords: [
      "RESERVED",
      "MOHITO",
      "CROPP.*TOWN",
      "HOUSE",
      "NEW.*YORKER",
      "ZARA",
      "BEFREE",
      "OLKO",
      "OGGI",
      "STRADIVARIUS",
      "SINSAY",
      "C&A",
    ],
  },
  // Охорона
  {
    details: {
      category: "Будинок / Охорона",
      description: "камери відеоспостереження",
    },
    keywords: ["Huachenghk"],
  },
  {
    details: {
      category: "Будинок / Охорона",
      description: "Поповнення Ajax Lifecell",
    },
    keywords: ["Поповнення Ajax Lifecell"],
  },
  // Побут
  {
    details: (descriptor) => ({
      category: "Побут / Різне",
      description: `Покупки в "${descriptor}"`,
    }),
    keywords: {
      EPITSENTR: "Епіцентр",
      EPICENTR: "Епіцентр",
      NL3: "Нова Лінія",
      "NOVA LINIYA": "Нова Лінія",
      DOMOSVIT: "Домосвіт",
      JYSK: "JYSK",
      IKEA: "IKEA",
      CASTORAMA: "CASTORAMA",
      "LEROY MERLIN": "LEROY MERLIN",
    },
  },
  {
    details: {
      category: "Побут / Інструмент",
      description: "Інструмент в Дніпро-М",
    },
    keywords: ["Dniprom"],
  },
  // Подорожі
  {
    details: {
      category: "Подорожі / Автопрокат",
      description: "Оренда авто в Avis",
    },
    keywords: ["AVIS"],
  },
  {
    details: {
      category: "Подорожі / Переїзд",
      description: "Квитки на потяг",
    },
    keywords: ["BOOKING.*UZ", "UZ.*GOV.*UA", "bilet.intercity"],
  },
  {
    details: (keyword) => ({
      category: "Подорожі / Речі для подорожей",
      description: `Покупки в "${keyword}"`,
    }),
    keywords: ["Decathlon"],
  },
  // Послуги
  {
    details: {
      category: "Послуги / Державні",
      description: "Податок на доходи",
    },
    keywords: ["Утримання податку"],
  },
  {
    details: {
      category: "Послуги / Банківські",
      description: "Комісія за зарахування ЗП",
    },
    keywords: ["PRZELEW.*ZAGRANICZNY"],
  },
  {
    details: { category: "Послуги / Банківські" },
    keywords: [
      "Альфа.*Чек",
      "M.*Banking",
      "процент.*користування.*кредитом",
      "комісія.*банк",
    ],
  },
  // Проїзд
  {
    details: {
      category: "Проїзд / Громадський траспорт",
      description: "Метро",
    },
    keywords: ["KYIVSKYI.*METRO"],
  },
  {
    details: {
      category: "Проїзд / Громадський траспорт",
      description: "jakdojade",
    },
    keywords: ["jakdojade"],
  },
  {
    details: {
      category: "Проїзд / Громадський траспорт",
      description: "Транспортна карта Лісабон",
    },
    keywords: ["SOFLUSA.*SA"],
  },
  {
    details: (descriptor) => ({
      category: "Проїзд / Таксі",
      description: `Таксі ${descriptor}`,
    }),
    keywords: {
      UBER: "Uber",
      BOLT: "Bolt",
      WFPTAXI: "Uklon",
      UKLON: "Uklon",
    },
  },
  // Розваги
  {
    details: (descriptor) => ({
      category: "Розваги / Активний відпочинок",
      description: descriptor,
    }),
    keywords: {
      SuperPark: "Атракціони в SuperPark в Чабанах",
      KACHELI: "Парк Гойдалок на ВДНГ",
      "Dobriy.*dub": "Лазалка в Мегамаркеті",
    },
  },
  {
    details: (descriptor) => ({
      category: "Розваги / Кафе ресторани клуби",
      description: `Вечеря в "${descriptor}"`,
    }),
    keywords: {
      EVRASIYA: "Євразії",
      EVRAZIYAYA: "Євразії",
      "PESTO CAFE": "Pesto Cafe",
      GENATSVALE: "Геніцвалі і Хінкалі",
      "Restoran Mill": "Mill Hub",
    },
  },
  {
    details: (descriptor) => ({
      category: "Розваги / Кафе ресторани клуби",
      description: descriptor,
    }),
    keywords: {
      Spokoj: "Spokoj Кафе",
      "FOOD WAY GROUP": "Sushi Express",
      "AW Network 17694": "Піцерія біля садочку",
    },
  },
  {
    details: (descriptor) => ({
      category: "Розваги / Кава",
      description: `Кава в "${descriptor}"`,
    }),
    keywords: {
      "Aroma.*Kava": "Aroma Kava",
      Kofein: "Kofein",
      kavovarka: "Кваоварка",
    },
  },
  // Техніка
  {
    details: {
      category: "Техніка / Електроніка",
      description: 'Товари на "Розетка"',
    },
    keywords: ["FKKONTRATKOVYJ.*DIM"],
  },
  // Цифрові продукти
  {
    details: {
      category: "Цифрові продукти / Музика",
      description: "Підписка Google Music",
    },
    keywords: ["Google Music"],
  },
  {
    details: {
      category: "Цифрові продукти / Музика",
      description: "Youtube Premium манжулі",
    },
    keywords: [
      "Перерахування коштів на користь третьої особи за постійним дорученням",
    ],
  },
];

const BANK_CATEGORY_MATCHES = [
  // Urksib
  {
    bankCategory: "Продуктові магазини",
    details: {
      category: "Їжа / Магазини",
      description: "Продуктии в магазині",
    },
  },
  {
    bankCategory: "Метро",
    details: {
      category: "Проїзд / Громадський траспорт",
      description: "Метро",
    },
  },
  {
    bankCategory: "Кафе та ресторани",
    details: { category: "Розваги / Кафе ресторани клуби" },
  },
  {
    bankCategory: "Аптеки",
    details: { category: "Здоров'я / Ліки" },
  },
  {
    bankCategory: "Спортивні товари",
    details: { category: "Спорт / Спорядження" },
  },
  {
    bankCategory: "Кіно та театри",
    details: { category: "Розваги / Кіно" },
  },
  {
    bankCategory: "Догляд за собою",
    details: { category: "Краса / Косметика" },
  },
  {
    bankCategory: "Потяг",
    details: { category: "Подорожі / Переїзд" },
  },
  {
    bankCategory: "Меблі та інтер'єр",
    details: { category: "Побут / Різне" },
  },
  {
    bankCategory: "Проценти за депозитом",
    details: {
      category: "Доходи / Інвестиції",
      description: "Проценти за накопичувальним рахунком",
    },
  },
  // Wise
  {
    bankCategory: "eating-out",
    details: { category: "Їжа / Кафе" },
  },
  {
    bankCategory: "groceries",
    details: { category: "Їжа / Магазини" },
  },
  {
    bankCategory: "entertainment",
    details: { category: "Розваги / Різне" },
  },
  {
    bankCategory: "transport",
    details: { category: "Проїзд / Громадський траспорт" },
  },
  {
    bankCategory: "holidays",
    details: { category: "Подорожі / Проживання" },
  },
  {
    bankCategory: "personal-care",
    details: { category: "Побут / Побутова хімія і гігієна" },
  },
  {
    bankCategory: "bills",
    details: { category: "Квартира / Комуналка" },
  },
];

const guessByDescription = (description) => {
  let matchedDescriptor;

  const match = CATEGORIES_DESCRIPTION_MATCHES.find((cat) => {
    const keywords = cat.keywords;

    if (keywords.length) {
      // array of keywords: ["word1", "word2", /regex3/, /regex4/]
      return keywords.find((keyword) => {
        if (description.match(new RegExp(keyword, "i"))) {
          matchedDescriptor = keyword;
          return true;
        }
      });
    } else {
      // Map of keywords: { "keyword1": "desc1", "keyword2": "desc2" }
      for (const [keyword, desc] of Object.entries(keywords)) {
        if (description.match(new RegExp(keyword, "i"))) {
          matchedDescriptor = desc;
          return true;
        }
      }
    }
  });

  if (match) {
    return typeof match.details === "function"
      ? match.details(matchedDescriptor, description)
      : match.details;
  }
};

const guessByBankCategory = (bankCategory) => {
  const match = BANK_CATEGORY_MATCHES.find(
    (cat) => cat.bankCategory === bankCategory
  );
  if (match) return match.details;
};

const guessTransactionDetails = ({ description, bankCategory }) =>
  guessByDescription(description) || guessByBankCategory(bankCategory) || {};
