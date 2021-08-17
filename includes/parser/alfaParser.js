const detectCurrentAccount = (cardNumber) => {
  if (cardNumber === "5355xxxxxxx1188")
    return getAccountByName("Карта Альфа White [Артем]");
  else if (cardNumber === "4102xxxxxxx4587")
    return getAccountByName("Карта Альфа Travel [Артем]");
  else if (cardNumber === "5355xxxxxxx7060")
    return getAccountByName("Карта Альфа Credit [Артем]");
  else if (cardNumber === "4102xxxxxxx7527")
    return getAccountByName("Карта Альфа [Наталі]");
  return null;
};

const TRANSFER_MATCHERS = [
  {
    matcher: "Зняття готівки в банкоматі",
    transactionInfo: ({ account }) => {
      userNameMatch = account.name.match(/(Артем|Наталі)/);

      return {
        description: "Зняття готівки в банкоматі",
        from: account.name,
        to: `Гаманець [${userNameMatch[1]}]`,
      };
    },
  },
  {
    matcher: /Переказ на (власний рахунок|рахунок дружини) в іншому банку/,
    transactionInfo: ({ account }) => ({
      description: "Переказ на карту Альфа",
      from: "Карта Укрсиб [Elite]",
      to: account.name,
    }),
  },
  {
    matcher: "Поповнення Дохідного сейфу",
    transactionInfo: ({ account }) => {
      userNameMatch = account.name.match(/(Артем|Наталі)/);

      return {
        description: "Поповнення Дохідного сейфу",
        from: account.name,
        to: `Скарбничка Альфа [${userNameMatch[1]}]`,
      };
    },
  },
  {
    matcher: "Зняття коштів з Дохідного сейфу",
    transactionInfo: ({ account }) => {
      userNameMatch = account.name.match(/(Артем|Наталі)/);

      return {
        description: "Зняття з Дохідного сейфу",
        from: `Скарбничка Альфа [${userNameMatch[1]}]`,
        to: account.name,
      };
    },
  },
  {
    matcher: "Списання переказу коштів з СКР на СКР",
    transactionInfo: ({ account }) => ({
      description: "Переказ на карту Travel",
      from: "Карта Альфа White [Артем]",
      to: "Карта Альфа Travel [Артем]",
    }),
  },
  {
    matcher: "Зарахування переказу коштів з СКР на СКР",
    transactionInfo: ({ account }) => ({
      description: "Переказ на карту Travel",
      from: "Карта Альфа White [Артем]",
      to: "Карта Альфа Travel [Артем]",
    }),
  },
];

const getDate = (row) => {
  const dateStr = row.querySelector("td.column-1").innerText;
  const [dayStr, monthStr, yearStr] = dateStr.split(".");
  return new Date(yearStr, parseInt(monthStr) - 1, dayStr);
};

const getAmount = (row) => {
  const amountStr = row
    .querySelector("td.column-4")
    .innerText.replace(/\s/g, "")
    .replace(",", ".");
  // NOTE: Expense should be negative numbers in HM, so keep "minus" sign
  return parseFloat(amountStr);
};

const getDescription = (row) => {
  return row
    .querySelector("td.column-3")
    .innerText.replace("(", " ")
    .replace(")", " ")
    .replace("Покупка ", "")
    .replace("POS Purchase - ", "");
};

const getBankProposedCategory = () => {};

const getSpenderName = () => {};

const getTransferAssociatedWithTransaction = ({
  amount,
  description,
  account,
  spenderName,
}) => {
  const transferMatcher = TRANSFER_MATCHERS.find((tm) =>
    description.match(new RegExp(tm.matcher, "i"))
  );
  if (transferMatcher) {
    return transferMatcher.transactionInfo({
      amount,
      description,
      account,
      spenderName,
    });
  }
  return null;
};

const markRowWithColor = (row, color) => {
  row
    .querySelectorAll("td")
    .forEach((td) => (td.style.backgroundColor = color));
};

class AlfaParser {
  constructor() {
    const cardName = document.querySelector(".card-primary").innerText;
    const account = detectCurrentAccount(cardName);
    if (!account) alert("Can't detect account");

    chrome.runtime.onMessage.addListener((request) => {
      if (request.command === "parse") {
        console.log("parsing");
        chrome.storage.local.set({
          parsedTransactions: parse(
            account,
            document.querySelectorAll("table.x-acct-operations tbody tr")
          ),
          account,
        });
      }
    });
  }
}

new AlfaParser();
