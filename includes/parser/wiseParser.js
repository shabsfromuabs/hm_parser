const WISE_ACCOUNTS = { 32828969: "USD", 33761471: "EUR", 37329507: "PLN" };

const MOTHS_NAMES = [
  "січ",
  "лют",
  "бер",
  "кві",
  "тра",
  "чер",
  "лип",
  "сер",
  "вер",
  "жов",
  "лис",
  "гру",
];

const TRANSFER_MATCHERS = [
  {
    matcher: /З Вашого балансу \w{3}/,
    transactionInfo: ({ amount, account, description }) => {
      const match = description.match(/З Вашого балансу (\w{3})/i);

      return {
        description: `Conversion from ${match[1]} to ${account.name}`,
        from: `Wise ${match[1]}`,
        to: account.name,
        fromAmount: undefined,
        toAmount: amount,
      };
    }
  },
  {
    matcher: /На Ваш баланс \w{3}/i,
    transactionInfo: ({ amount, account, description }) => {
      const match = description.match(/На Ваш баланс (\w{3})/i);

      return {
        description: `Conversion from ${account.name} to ${match[1]}`,
        from: account.name,
        to: `Wise ${match[1]}`,
        fromAmount: amount,
        toAmount: undefined,
      };
    }
  },
];

const SPECIAL_MATCHERS = [];

const getDate = (row) => {
  const dateStr = row.parentElement.previousElementSibling.innerText;
  const now = new Date();

  if (dateStr === "Сьогодні") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (dateStr === "Учора") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  } else {
    const [date, month] = dateStr.split(" ");
    const shortMonth = month.substring(0, 3);
    const monthNumber = MOTHS_NAMES.findIndex((e) => e === shortMonth);
    return new Date(now.getFullYear(), monthNumber, parseInt(date));
  }
};

const getAmount = (row) => {
  const amountStr = row.childNodes[1].innerText
    .replace(/\s/g, "")
    .replace(",", ".");
  // NOTE: Expense should be negative numbers in HM, so keep "minus" sign
  return parseFloat(amountStr);
};

const getDescription = (row) => {
  return row.querySelector("h5").innerText;
};

const getBankProposedCategory = (row) => {
  return row
    .querySelector('[role="img"]')
    .querySelector("[data-testid]")
    .getAttribute("data-testid")
    .replace("-icon", "");
};

const getSpenderName = () => {};

const markRowWithColor = (row, color) => (row.style.backgroundColor = color);

class WiseParser {
  constructor() {
    const wiseAccountId = window.location.pathname.replace("/balances/", "");
    const currency = WISE_ACCOUNTS[wiseAccountId];
    const account = getAccountByName(`Wise ${currency}`);
    const rows = document.querySelectorAll(
      '#main .m-y-3 h3+div a[data-testid="activity-summary"]'
    );

    chrome.runtime.onMessage.addListener((request) => {
      if (request.command === "parse") {
        chrome.storage.local.set({
          parsedTransactions: parse(account, rows),
          account,
        });
      }
    });
  }
}

new WiseParser();
