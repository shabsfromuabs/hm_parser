const WISE_ACCOUNTS = { 32828969: "USD", 33761471: "EUR", 37329507: "PLN" };

const UA_MOTHS_NAMES = [
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

const EN_MOTHS_NAMES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
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
    },
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
    },
  },
];

const SPECIAL_MATCHERS = [];

const getBasicTransactionDetails = async (row) => {
  const account = getAccount();
  const date = getDate(row).getTime();
  const amount = getAmount(row);
  const description = getDescription(row);

  return [account, date, amount, description];
};

const getAccount = () => {
  const wiseAccountId = window.location.pathname.replace("/balances/", "");
  const currency = WISE_ACCOUNTS[wiseAccountId];
  return getAccountByName(`Wise ${currency}`);
};

const getDate = (row) => {
  const dateStr = row.parentElement.previousElementSibling.innerText;
  const now = new Date();

  if (dateStr === "Сьогодні" || dateStr === "Today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (dateStr === "Учора" || dateStr === "Yesterday") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  } else {
    const [date, month, yearStr] = dateStr.split(" ");
    const year = yearStr ? parseInt(yearStr) : now.getFullYear();
    const shortMonth = month.substring(0, 3).toLowerCase();
    let monthNumber = UA_MOTHS_NAMES.findIndex((e) => e === shortMonth);
    
    if (monthNumber < 0) {
      monthNumber = EN_MOTHS_NAMES.findIndex((e) => e === shortMonth);
    }
    if (monthNumber < 0) {
      throw "Can't parse month name"
    }

    return new Date(year, monthNumber, parseInt(date));
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
  return row.querySelector("p").innerText;
};

const getBankProposedCategory = (row) => {
  return row
    .querySelector('[role="img"]')
    .querySelector("[data-testid]")
    ?.getAttribute("data-testid")
    ?.replace("-icon", "");
};

const markRowWithColor = (row, color) => (row.style.backgroundColor = color);

class WiseParser {
  constructor() {
    chrome.runtime.onMessage.addListener(async (request) => {
      if (request.command === "parse") {
        const rows = document.querySelectorAll(
          '#main a[data-testid="activity-summary"]'
        );
        
        const parsedTransactions = await parse(rows);
        chrome.storage.local.set({ parsedTransactions, account: "wise" });
      }
    });
  }
}

new WiseParser();
