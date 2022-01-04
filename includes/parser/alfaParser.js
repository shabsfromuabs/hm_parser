const detectCurrentAccount = (cardNumber) => {
  if (cardNumber === "5355xxxxxxx1188")
    return getAccountByName("Карта Альфа White [Артем]");
  else if (cardNumber === "4102xxxxxxx4587")
    return getAccountByName("Карта Альфа Travel [Артем]");
  else if (cardNumber === "4102xxxxxxx7527")
    return getAccountByName("Карта Альфа White [Наталі]");
  else if (cardNumber === "4102xxxxxxx7846")
    return getAccountByName("Карта Альфа Travel [Наталі]");
  return null;
};

const TRANSFER_MATCHERS = [
  {
    matcher: "Зняття готівки в банкоматі",
    transactionInfo: ({ account }) => {
      const userNameMatch = account.name.match(/(Артем|Наталі)/);

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
      const userNameMatch = account.name.match(/(Артем|Наталі)/);

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
      const userNameMatch = account.name.match(/(Артем|Наталі)/);

      return {
        description: "Зняття з Дохідного сейфу",
        from: `Скарбничка Альфа [${userNameMatch[1]}]`,
        to: account.name,
      };
    },
  },
  {
    matcher: "Списання переказу коштів з СКР на СКР",
    transactionInfo: ({ account }) => {
      const userNameMatch = account.name.match(/(Артем|Наталі)/);

      return {
        description: "Переказ на карту Travel",
        from: `Карта Альфа White [${userNameMatch[1]}]`,
        to: `Карта Альфа Travel [${userNameMatch[1]}]`,
      };
    },
  },
  {
    matcher: "Зарахування переказу коштів з СКР на СКР",
    transactionInfo: ({ account }) => {
      const userNameMatch = account.name.match(/(Артем|Наталі)/);

      return {
        description: "Переказ на карту Travel",
        from: `Карта Альфа White [${userNameMatch[1]}]`,
        to: `Карта Альфа Travel [${userNameMatch[1]}]`,
      };
    },
  },
  {
    matcher: /Списання коштів для купівлі валюти \d+\.\d+ (USD|EUR)/,
    transactionInfo: ({ amount, account, description }) => {
      const userNameMatch = account.name.match(/(Артем|Наталі)/);
      const descriptionMatch = description.match(
        /Списання коштів для купівлі валюти (\d+\.\d+) (USD|EUR)/
      );
      const amountInCurrency = parseFloat(descriptionMatch[1]);
      const currency = descriptionMatch[2];

      return {
        description: `Купівля ${amountInCurrency} ${currency}`,
        from: account.name,
        to: `Карта Альфа ${currency} [${userNameMatch[1]}]`,
        fromAmount: amount,
        toAmount: amountInCurrency,
      };
    },
  },
];

const SPECIAL_MATCHERS = [
  {
    matcher: "Утримання податку",
    transactionInfo: ({}) => {
      return {
        skipExport: true,
      };
    },
  },
  {
    matcher: /Виплата нарах.+відсотків/,
    transactionInfo: ({ account }) => {
      const userNameMatch = account.name.match(/(Артем|Наталі)/);
      const acc = getAccountByName(`Скарбничка Альфа [${userNameMatch[1]}]`);

      return {
        accountId: acc && acc.id,
      };
    },
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

const getSpecialTransactionDetails = ({
  amount,
  description,
  account,
  spenderName,
}) => {
  const specialMatcher = SPECIAL_MATCHERS.find((tm) =>
    description.match(new RegExp(tm.matcher, "i"))
  );
  if (specialMatcher) {
    return specialMatcher.transactionInfo({
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
