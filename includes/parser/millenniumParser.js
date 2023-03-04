const TRANSFER_MATCHERS = [
  {
    matcher: /From: ARTEM SHABLII/,
    transactionInfo: ({ amount }) => ({
      description: `Transfer from Millenium USD to PLN`,
      from: 'Millennium USD',
      to: 'Millennium PLN',
      fromAmount: undefined,
      toAmount: amount,
    }),
  },
  {
    matcher: /To: ARTEM SHABLII/i,
    transactionInfo: ({ amount }) => ({
      description: 'Transfer from Millenium USD to PLN',
      from: 'Millennium USD',
      to: 'Millennium PLN',
      fromAmount: amount,
      toAmount: undefined,
    }),
  },
];

const SPECIAL_MATCHERS = [];

const getBasicTransactionDetails = async (row) => {
  const date = getDate(row).getTime();
  const amount = getAmount(row);
  const description = getDescription(row);

  return [date, amount, description];
};

const getDate = (row) => {
  const dateStr = row
    .querySelector(".SettlementDate")
    .innerText.split(" / ")[0];
  const date = parseInt(dateStr.split("-")[0]);
  const month = parseInt(dateStr.split("-")[1]);
  const year = parseInt(dateStr.split("-")[2]);

  return new Date(year, month - 1, date);
};

const getAmount = (row) => {
  const amountStr = row
    .querySelector(".Amount.MNText.StandardListAmount")
    .innerText.replace(/\s|PLN|USD/g, "")
    .replace(',', '');

  // NOTE: Expense should be negative numbers in HM, so keep "minus" sign
  return parseFloat(amountStr);
};

const getDescription = (row) => {
  return row
    .querySelector(".DescriptionRow")
    .innerText.replace(/Description: /, "");
};

const getBankProposedCategory = () => {};

const markRowWithColor = (row, color) => (row.style.backgroundColor = color);

class MillenniumParser {
  constructor() {
    const accountName = document.querySelector("#SelectedAccount_select")
      .selectedOptions[0].text;
    const currency = accountName.match(/USD|PLN/)[0];
    const account = getAccountByName(`Millennium ${currency}`);

    chrome.runtime.onMessage.addListener(async (request) => {
      if (request.command === "parse") {
        const rows = [...document.querySelectorAll(".ActionRow")];
        // First element is not a transaction
        rows.shift();

        const parsedTransactions = await parse(account, rows);
        chrome.storage.local.set({ parsedTransactions, account });
      }
    });
  }
}

new MillenniumParser();
