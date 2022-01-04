const ACCOUNTS = [
  { id: 520859, currency: "uah", name: "Карта Укрсиб [Elite]" },
  { id: 632089, currency: "uah", name: "Скарбничка Укрсиб [Elite]" },
  { id: 19403, currency: "uah", name: "Гаманець [Артем]" },
  { id: 19404, currency: "uah", name: "Гаманець [Наталі]" },

  { id: 509018, currency: "uah", name: "Карта Альфа White [Артем]" },
  { id: 651514, currency: "uah", name: "Скарбничка Альфа [Артем]" },
  { id: 651515, currency: "uah", name: "Карта Альфа Travel [Артем]" },

  { id: 520925, currency: "uah", name: "Карта Альфа White [Наталі]" },
  { id: 632090, currency: "uah", name: "Скарбничка Альфа [Наталі]" },
  { id: 5600774, currency: "uah", name: "Карта Альфа Travel [Наталі]" },

  { id: 509014, currency: "uah", name: "ФОП Укрсиб UAH" },
  { id: 509015, currency: "usd", name: "ФОП Укрсиб USD" },

  { id: 725557, currency: "usd", name: "Карта Укрсиб [Elite] USD" },
  { id: 694162, currency: "usd", name: "Карта Альфа USD [Наталі]" },
  { id: 4719129, currency: "eur", name: "Карта Альфа EUR [Артем]" },
  { id: 694163, currency: "usd", name: "Скарбничка Альфа USD [Наталі]" },
  { id: 19409, currency: "uah", name: "Конверт UAH" },
  { id: 19417, currency: "usd", name: "Конверт USD" },
  { id: 734179, currency: "eur", name: "Конверт EUR" },
];

const getAccounts = () => ACCOUNTS;

const getAccount = (id) => ACCOUNTS.find((acc) => acc.id === id);

const getAccountByName = (name) => ACCOUNTS.find((acc) => acc.name === name);
