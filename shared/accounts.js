const ACCOUNTS = [
  { id: 19403, currency: 'uah', name: 'Гаманець [Артем]' },
  { id: 19404, currency: 'uah', name: 'Гаманець [Наталі]' },
  { id: 520859, currency: 'uah', name: 'Карта Укрсиб [Elite]' },
  { id: 520925, currency: 'uah', name: 'Карта Альфа [Наталі]' },
  { id: 509018, currency: 'uah', name: 'Карта Альфа Debit [Артем]' },
  // Regular
  { id: 19408, currency: 'uah', name: 'Карта Приват [Наталі]' },
  { id: 22936, currency: 'uah', name: 'Карта Альфа Credit [Артем]' },
  { id: 651515, currency: 'uah', name: 'Карта Альфа Travel [Артем]' },
  { id: 19405, currency: 'uah', name: 'Карта Ощад [Артем]' },
  { id: 19406, currency: 'uah', name: 'Карта Ощад Virtual [Артем]' },
  { id: 19409, currency: 'uah', name: 'Конверт UAH' },
  { id: 19417, currency: 'usd', name: 'Конверт USD' },
  { id: 509014, currency: 'uah', name: 'ФОП Укрсиб UAH' },
  { id: 509015, currency: 'usd', name: 'ФОП Укрсиб USD' },
  { id: 509017, currency: 'uah', name: 'ФОП CreditAgricole UAH' },
  { id: 509016, currency: 'usd', name: 'ФОП CreditAgricole USD' },
  { id: 509019, currency: 'uah', name: 'Депозит Альфа UAH [Артем]' },
  { id: 513027, currency: 'usd', name: 'Депозит Альфа USD [Наталі]' },
  { id: 64604, currency: 'usd', name: 'Банківська ячейка USD' },
  { id: 64605, currency: 'uah', name: 'Банківська ячейка EUR' },
  { id: 632089, currency: 'uah', name: 'Скарбничка Укрсиб [Elite]' },
  { id: 651514, currency: 'uah', name: 'Скарбничка Альфа [Артем]' },
  { id: 632090, currency: 'uah', name: 'Скарбничка Альфа [Наталі]' },
  // Loans
  { id: 25408, currency: 'usd', name: 'Вадим USD' },
  // Hidden
  { id: 19647, currency: 'uah', name: 'Карта Ощад "Моя картка" [Артем]' },
  { id: 19411, currency: 'uah', name: 'Скарбничка Ощад [Артем]' },
  { id: 19410, currency: 'uah', name: 'Коробка UAH' },
  { id: 19418, currency: 'uah', name: 'Коробка EUR' },
  { id: 19413, currency: 'uah', name: 'Депозит Мегабанк UAH [Артем]' },
  { id: 19416, currency: 'usd', name: 'Депозит Мегабанк USD [Артем]' },
  { id: 19412, currency: 'uah', name: 'Депозит Мегабанк UAH [Наталі]' },
  { id: 19415, currency: 'uah', name: 'Депозит Укргаз UAH [Артем]' },
  { id: 19414, currency: 'uah', name: 'Депозит Ощад UAH [Артем]' },
  { id: 19407, currency: 'uah', name: 'Карта Мегабанк [Наталі]' },
  { id: 25283, currency: 'uah', name: 'Вадим' },
  { id: 23395, currency: 'uah', name: 'Жман' },
  { id: 66137, currency: 'usd', name: 'Жман USD' },
  { id: 26542, currency: 'uah', name: 'Олег Гончаренко' },
];

const getAccount = (id) => ACCOUNTS.find((acc) => acc.id === id);

const getAccountByName = (name) => ACCOUNTS.find((acc) => acc.name === name);
