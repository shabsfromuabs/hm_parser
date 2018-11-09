const ACCOUNTS = [
  { id: 19403, currency: 'uah', name: 'Гаманець [Артем]' },
  { id: 19404, currency: 'uah', name: 'Гаманець [Наталі]' },
  { id: 520859, currency: 'uah', name: 'MC Укрсиб [Elite]' },
  { id: 520925, currency: 'uah', name: 'Visa Альфа [Наталі]' },
  { id: 19408, currency: 'uah', name: 'Карта "Приватбанк"' },
  { id: 22936, currency: 'uah', name: 'MC Альфа Кредитна [Артем]' },
  { id: 509018, currency: 'uah', name: 'Visa Альфа Депозитна [Артем]' },
  { id: 19405, currency: 'uah', name: 'Visa Ощадбанк [Артем]' },
  { id: 19406, currency: 'uah', name: 'Visa Ощадбанк Virtual [Артем]' },
  { id: 19409, currency: 'uah', name: 'Конверт UAH' },
  { id: 19417, currency: 'usd', name: 'Конверт USD' },
  { id: 509014, currency: 'uah', name: 'ФОП Укрсиб UAH' },
  { id: 509015, currency: 'usd', name: 'ФОП Укрсиб USD' },
  { id: 509017, currency: 'uah', name: 'ФОП CreditAgricole UAH' },
  { id: 509016, currency: 'usd', name: 'ФОП CreditAgricole USD' },
  { id: 509019, currency: 'uah', name: 'Депозит Альфа UAH [Артем]' },
  { id: 513027, currency: 'usd', name: 'Депозит Альфа USD [Наталі]' },
  { id: 19414, currency: 'uah', name: 'Депозит Ощадбанк UAH [Артем]' },
  { id: 64604, currency: 'usd', name: 'Банківська ячейка USD' },
  { id: 64605, currency: 'uah', name: 'Банківська ячейка EUR' },
  { id: 25408, currency: 'usd', name: 'Вадим USD' },
  { id: 19647, currency: 'uah', name: 'Карта \"Моя картка\" \"Ощадбанк\"' },
  { id: 19411, currency: 'uah', name: 'Мобільні заощадження \"Ощадбанк\"' },
  { id: 19410, currency: 'uah', name: 'Коробка UAH' },
  { id: 19418, currency: 'uah', name: 'Коробка EUR' },
  { id: 19413, currency: 'uah', name: 'Депозит \"Мегабанк\"' },
  { id: 19416, currency: 'usd', name: 'Депозит \"Мегабанк\" USD' },
  { id: 19412, currency: 'uah', name: 'Депозит \"Мегабанк\" Палажченко' },
  { id: 19415, currency: 'uah', name: 'Депозит \"Укргазбанк\"' },
  { id: 25283, currency: 'uah', name: 'Вадим' },
  { id: 23395, currency: 'uah', name: 'Жман' },
  { id: 19407, currency: 'uah', name: 'Карта \"Мегабанк\"' },
  { id: 66137, currency: 'usd', name: 'Жман USD' },
  { id: 26542, currency: 'uah', name: 'Олег Гончаренко' },
];

const CATEGORIES = ["Інвестиції", "Благодійність", "Велосипед", "Велосипед / Аксесуари", "Зарплата",
  "Зв'язок", "Зв'язок / Інтернет", "Зв'язок / Мобільний",
  "Здоров'я", "Здоров'я / Інше", "Здоров'я / Лікарі", "Здоров'я / Ліки", "Здоров'я / Страховка",
  "Квартира", "Квартира / Комуналка", "Квартира / Оренда", "Квартира / Ремонт",
  "Корегування", "Особисті витрати",
  "Краса", "Краса / Косметика", "Краса / Послуги",
  "Одяг", "Одяг / Аксесуари", "Одяг / Білизна", "Одяг / Верхній", "Одяг / Взуття", "Одяг / Ремонт", "Одяг / Різне",
  "Побут", "Побут / Гігієна", "Побут / Меблі", "Побут / Посуд", "Побут / Різне", "Побут / Хімія",
  "Подарунки", "Подарунки / Друзям", "Подарунки / Колегам", "Подарунки / Рідним", "Подарунки / Собі",
  "ФОП", "ФОП / Консалтинг", "ФОП / Суборенда", "Податки",
  "Подорожі", "Подорожі / Віза", "Подорожі / Заправка машини", "Подорожі / Оренда машини", "Подорожі / Переїзд",
  "Подорожі / Проживання", "Подорожі / Путівки", "Подорожі / Різне", "Подорожі / Сувеніри", "Подорожі / Транспорт",
  "Подорожі / Харчування", "Речі для подорожей",
  "Послуги", "Послуги / Банківські", "Послуги / Державні", "Послуги / Страхові",
  "Продукты", "Продукты / Їжа", "Продукты / Обід на роботі",
  "Проїзд", "Проїзд / Міжміський", "Проїзд / По місту", "Проїзд / Таксі",
  "Розваги", "Розваги / Активний відпочинок", "Розваги / Вдома", "Розваги / Гульки з друзями", "Розваги / Клуби і бари",
  "Розваги / Концерти", "Розваги / Ресторани", "Розваги / Різне",
  "Секс", "Секс / Контрацепція",
  "Спорт", "Спорт / Спорядження", "Спорт / Тренування", "Спорт / Харчування",
  "Тварини", "Тварини / Ветеринарія", "Тварини / Коти",
  "Техніка", "Техніка / Електроніка", "Техніка / Обсллуговування", "Техніка / Побутова", "Техніка / Ремонт",
  "Цифрові продукти", "Цифрові продукти / Музика", "Цифрові продукти / ПЗ", "Цифрові продукти / Сервіси"];

const CATEGORIES_DESCRIPTION_MATCHES = [
  {
    category: 'Продукти',
    keywords: ['SHOP BILLA', 'UNIVERSAMSILPO', 'SILPO', 'LOTOK', 'NOVUS', 'Lomonos MAGAZINPRODUKT']
  },
  {
    category: 'Кафе і ресторани',
    keywords: ['McDonald']
  },
  {
    category: 'Проїзд / Таксі',
    keywords: ['Uber BV']
  },
  {
    category: 'Проїзд / По місту',
    keywords: ['METROPOLITEN', 'KYIVSKYI METRO']
  },
  {
    category: 'Подорожі / Переїзд',
    keywords: ['BOOKINGUZGOV']
  },
  {
    category: 'Одяг',
    keywords: ['RESERVED', 'MOHITO', 'CROPPTOWN', 'HOUSE', 'NEW YORKER', 'ZARA', 'BEFREE', 'OLKO', 'OGGI', 'STRADIVARIUS']
  },
  {
    category: 'Взуття',
    keywords: ['INTERTOP']
  }
];

const UKRSIB_CATEGORY_MATCHES = [
  { ukrsibCategory: 'Аптеки', category: "Здоров'я / Ліки" },
  { ukrsibCategory: 'Кафе та ресторани', category: 'Розваги / Ресторани' },
  { ukrsibCategory: 'Метро', category: 'Проїзд / По місту' },
  { ukrsibCategory: 'Спортивні товари', category: 'Спорт / Спорядження' },
  { ukrsibCategory: 'Продуктові магазини', category: 'Продукты / Їжа' },
  { ukrsibCategory: 'Кіно та театри', category: 'Розваги / Різне' },
  { ukrsibCategory: 'Догляд за собою', category: 'Краса / Косметика' },
  { ukrsibCategory: 'Потяг', category: 'Подорожі / Переїзд' },
  { ukrsibCategory: "Меблі та інтер'єр", category: 'Побут / Різне' },
  { ukrsibCategory: 'Проценти за депозитом', category: 'Інвестиції' }
];

const getAccount = (id) => ACCOUNTS.find((acc) => acc.id === id);

const getAccountByName = (name) => ACCOUNTS.find((acc) => acc.name === name);

const getCategories = () => CATEGORIES;

const guessCategoryByDescription = (description) => {
  const guessedCategory = CATEGORIES_DESCRIPTION_MATCHES.find((cat) => {
    return cat.keywords.find((keyword) => {
      if (description.match(new RegExp(keyword, 'i'))) return true;
    });
  });
  return guessedCategory && guessedCategory.category;
};

const guessCategoryByUkrsibCategory = (uksibCategory) => {
  const guessedCategory = UKRSIB_CATEGORY_MATCHES.find((cat) => cat.ukrsibCategory === uksibCategory);
  return guessedCategory && guessedCategory.category;
};
