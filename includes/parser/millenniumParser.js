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

const getBasicTransactionDetails = async (row) => {
  const date = getDate(row).getTime();
  const amount = getAmount(row);
  const description = getDescription(row);

  return [date, amount, description];
};

const getDate = (row) => {
  const dateContainer =
    row?.querySelector(".SettlementDate") || row.querySelectorAll("td")[1];

  const dateStr = dateContainer.innerText.split(" / ")[0];
  const date = parseInt(dateStr.split("-")[0]);
  const month = parseInt(dateStr.split("-")[1]);
  const year = parseInt(dateStr.split("-")[2]);

  return new Date(year, month - 1, date);
};

const getAmount = (row) => {
  const amountStr = row.querySelector(
    ".Amount.MNText.StandardListAmount"
  )?.innerText;

  const absAmountStr = row.querySelectorAll("td")[3]?.innerText;

  const cleanAmount = (amountStr || `-${absAmountStr}`)
    .replace(/\s|PLN|USD/g, "")
    .replace(",", "");

  // NOTE: Expense should be negative numbers in HM, so keep 'minus' sign
  return parseFloat(cleanAmount);
};

const getDescription = (row) => {
  const container =
    row.querySelector(".DescriptionRow") || row.querySelectorAll("td")[2];

  return container.innerText
    .replace(/Description: /, "")
    .replace("Hold for purchase - ", "")
    .replace("card present ", "")
    .replace("4988XXXXXXXX9916 ", "");
};

const getBankProposedCategory = () => {};

const markRowWithColor = (row, color) => (row.style.backgroundColor = color);

const getParsingData = () => {
  const titlePanle = document.querySelector(".TitlePanel");
  const accSelect = document.querySelector("#SelectedAccount_select");
  const rows = [...document.querySelectorAll(".ActionRow")];

  if (titlePanle?.innerText == "Blocked funds") {
    return ["PLN", rows];
  } else if (accSelect?.selectedOptions[0].text) {
    const accountName = accSelect.selectedOptions[0].text;
    // First element is not a transaction
    rows.shift();
    return [accountName.match(/USD|PLN/)[0], rows];
  }

  return [];
};

class MillenniumParser {
  constructor() {
    chrome.runtime.onMessage.addListener(async (request) => {
      if (request.command === "parse") {
        const [currency, rows] = getParsingData();
        if (!currency) {
          alert("Can't detect currency");
          return;
        }

        const account = getAccountByName(`Millennium ${currency}`);
        const parsedTransactions = await parse(account, rows);
        chrome.storage.local.set({ parsedTransactions, account });
      }
    });
  }
}

new MillenniumParser();
