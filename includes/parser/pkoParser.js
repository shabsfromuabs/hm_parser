const TRANSFER_MATCHERS = [
  {
    matcher: /Переказ на рахунок ARTEM SHABLII/,
    transactionInfo: ({ amount }) => ({
      description: `Transfer from Millenium to PKO`,
      from: "Millennium PLN",
      to: "PKO PLN",
      fromAmount: amount,
      toAmount: amount,
    }),
  },
  {
    matcher: /Зняття готівки з банкомату/,
    transactionInfo: ({ amount }) => ({
      description: `Зняття готівки з банкомату`,
      from: "PKO PLN",
      to: "Гаманець PLN [Наталі]",
      fromAmount: amount,
      toAmount: amount,
    }),
  },
];

const SPECIAL_MATCHERS = [];

const getBasicTransactionDetails = async (row, rows) => {
  const date = getDate(row, rows).getTime();
  const amount = getAmount(row);
  const description = getDescription(row);

  return [date, amount, description];
};

const getDate = (row, rows) => {
  let prevSibling = row.previousSibling;
  let dateContainer;

  for (let i = 0; i < rows.length; i++) {
    if (prevSibling.children.length == 1) {
      dateContainer = prevSibling;
      break;
    }
    prevSibling = prevSibling.previousSibling;
  }

  const dateStr = dateContainer.innerText;
  const [dayStr, monthStr, yearStr] = dateStr
    .match(/\d+\.\d+\.\d+/)[0]
    .split(".");

  const date = parseInt(dayStr);
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);

  return new Date(year, month - 1, date);
};

const getAmount = (row) => {
  // Expences will have minus sign at beginning like "-10,00 PLN"
  const amountStr = row.querySelectorAll("td")[3].innerText;
  const cleanAmount = amountStr.replace(/\s|PLN|USD/g, "").replace(",", ".");

  // NOTE: Expense should be negative numbers in HM, so keep 'minus' sign
  return parseFloat(cleanAmount);
};

const getDescription = (row) => {
  const desc = row.querySelectorAll("td")[1].innerText;
  const additionalDesc = row.querySelectorAll("td")[2].innerText;

  return `${additionalDesc} ${desc}`
    .replace("Оплата карткою ", "")
    .replace("Karta Płatnicza", "")
    .replace("\n", " ");
};

const getBankProposedCategory = () => {};

const markRowWithColor = (row, color) => (row.style.backgroundColor = color);

class PkoParser {
  constructor() {
    const account = getAccountByName("PKO PLN");

    chrome.runtime.onMessage.addListener(async (request) => {
      if (request.command === "parse") {
        const allRows = document.querySelectorAll("form table tbody tr");
        const rows = [];

        for (let i = 0; i < allRows.length; i++) {
          if (allRows[i].children.length > 1) rows.push(allRows[i]);
        }

        const parsedTransactions = await parse(account, rows);
        chrome.storage.local.set({ parsedTransactions, account });
      }
    });
  }
}

new PkoParser();
