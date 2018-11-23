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

const getAccount = (id) => ACCOUNTS.find((acc) => acc.id === id);

const getAccountByName = (name) => ACCOUNTS.find((acc) => acc.name === name);