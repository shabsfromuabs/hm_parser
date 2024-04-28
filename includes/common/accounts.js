const ACCOUNTS = [
  { id: 5864643, currency: "usd", name: "Wise USD" },
  { id: 5864642, currency: "eur", name: "Wise EUR" },
  { id: 6200686, currency: "pln", name: "Wise PLN" },

  { id: 7044486, currency: "pln", name: "PKO PLN" },

  { id: 6605436, currency: "pln", name: "Millennium PLN" },
  { id: 6605435, currency: "usd", name: "Millennium USD" },

  { id: 7735655, currency: "pln", name: "Millenium 360 PLN [Personal]" },
  { id: 7753511, currency: "usd", name: "Millenium 360 USD [Personal]" },

  { id: 520859, currency: "uah", name: "Карта Укрсиб [Elite]" },
  { id: 725557, currency: "usd", name: "Карта Укрсиб [Elite] USD" },

  { id: 5699070, currency: "eur", name: "Гаманець EUR [Артем]" },
  { id: 5699505, currency: "eur", name: "Гаманець EUR [Наталі]" },

  { id: 6156804, currency: "pln", name: "Гаманець PLN [Артем]" },
  { id: 6156805, currency: "pln", name: "Гаманець PLN [Наталі]" },

  { id: 4719129, currency: "eur", name: "Карта Альфа EUR [Артем]" },
  { id: 509018, currency: "uah", name: "Карта Альфа White [Артем]" },
  { id: 651515, currency: "uah", name: "Карта Альфа Travel [Артем]" },

  { id: 694162, currency: "usd", name: "Карта Альфа USD [Наталі]" },
  { id: 520925, currency: "uah", name: "Карта Альфа White [Наталі]" },
  { id: 5600774, currency: "uah", name: "Карта Альфа Travel [Наталі]" },

  { id: 509014, currency: "uah", name: "ФОП Укрсиб UAH" },
  { id: 509015, currency: "usd", name: "ФОП Укрсиб USD" },
  { id: 5671545, currency: "usd", name: "Payoneer USD" },

  { id: 19408, currency: "uah", name: "Карта Приват [Наталі]" },
  { id: 632089, currency: "uah", name: "Скарбничка Укрсиб [Elite]" },
  { id: 651514, currency: "uah", name: "Скарбничка Альфа [Артем]" },
  { id: 632090, currency: "uah", name: "Скарбничка Альфа [Наталі]" },
  { id: 694163, currency: "usd", name: "Скарбничка Альфа USD [Наталі]" },

  { id: 19403, currency: "uah", name: "Гаманець [Артем]" },
  { id: 19404, currency: "uah", name: "Гаманець [Наталі]" },

  { id: 19409, currency: "uah", name: "Конверт UAH" },
  { id: 19417, currency: "usd", name: "Конверт USD" },
  { id: 734179, currency: "eur", name: "Конверт EUR" },
];

const getAccounts = () => ACCOUNTS;

const getAccountById = (id) => ACCOUNTS.find((acc) => acc.id === id);

const getAccountByName = (name) => ACCOUNTS.find((acc) => acc.name === name);
