const TRANSFER_MATCHERS = [
  {
    matcher: /From: ARTEM SHABLII/,
    transactionInfo: ({ amount }) => ({
      description: `Transfer from Millenium USD to PLN`,
      from: "Millennium USD",
      to: "Millennium PLN",
      fromAmount: undefined,
      toAmount: amount,
    }),
  },
  {
    matcher: /To: ARTEM SHABLII/i,
    transactionInfo: ({ amount }) => ({
      description: "Transfer from Millenium USD to PLN",
      from: "Millennium USD",
      to: "Millennium PLN",
      fromAmount: amount,
      toAmount: undefined,
    }),
  },
];

const SPECIAL_MATCHERS = [];

const getBasicTransactionDetails = async (row, rows, options) => {
  const account = getAccount(row, options.accountGroup);
  const date = getDate(row, rows).getTime();
  const amount = getAmount(row);
  const description = getDescription(row);

  return [account, date, amount, description];
};

const getAccount = (row, accountGroup) => {
  const accountCurrency =
    row
      .querySelectorAll("div:not([role='img'])")[4]
      .querySelectorAll("span")[2]
      .innerText.match(/(PLN|USD)/)[0] || "PLN";

  const accountName =
    accountGroup === "personal"
      ? `Millenium 360 ${accountCurrency} [Personal]`
      : `Millennium ${accountCurrency}`;

  return getAccountByName(accountName);
};

const getDate = (row, rows) => {
  let prevSibling = row.parentElement.previousSibling;
  let dateContainer;

  for (let i = 0; i < rows.length; i++) {
    if (prevSibling.querySelector("[aria-label='Calendar icon']")) {
      dateContainer = prevSibling;
      break;
    }
    prevSibling = prevSibling.previousSibling;
  }

  const dateStr = dateContainer.innerText;
  if (dateStr === "Today") return new Date();

  const date = parseInt(dateStr.split(".")[0]);
  const month = parseInt(dateStr.split(".")[1]);
  const year = parseInt(dateStr.split(".")[2]);

  return new Date(year, month - 1, date);
};

const getAmount = (row) => {
  const amountStr = row
    .querySelectorAll("div:not([role='img'])")[4]
    .innerText.replace(/\s/g, "")
    .replace(",", ".");
  // NOTE: Expense should be negative numbers in HM, so keep "minus" sign
  return parseFloat(amountStr);
};

const getDescription = (row) => {
  const descParts = row
    .querySelectorAll("div:not([role='img'])")[2]
    .querySelectorAll("span");
  const name = descParts[0].innerText;
  // const paymentType = descParts[1].innerText;
  const details = descParts[2].innerText;
  if (name == details) return name;
  return `${name} ${details}`;
};

const getBankProposedCategory = () => {};

const markRowWithColor = (row, color) => (row.style.backgroundColor = color);

class MillenniumParser {
  constructor() {
    chrome.runtime.onMessage.addListener(async (request) => {
      if (request.command === "parse") {
        const rows = [
          ...document.querySelectorAll("[data-testid='transactionTile']"),
        ];

        const isPersonal = document
          .querySelector(".MuiPaper-root")
          ?.innerText?.match(/Millennium 360/);

        const accountGroup = isPersonal ? "personal" : "business";
        const filtersForm = document.querySelector("main").childNodes[0];

        appendHtmlElement("div", filtersForm, "", {
          innerText: `Detected ${accountGroup} acount`,
          style: "background: yellow",
        });

        const parsedTransactions = await parse(rows, { accountGroup });
        chrome.storage.local.set({ parsedTransactions, account: "millenium" });
      }
    });
  }
}

new MillenniumParser();
