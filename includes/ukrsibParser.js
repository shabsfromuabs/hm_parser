// Last 4 digits of the card ro each user
const USERS = { '5076': 'Artem', '9292': 'Natali', '8110': 'Artem' };
// Account ids in Honey Money system
const ACCOUNTS = {
  walletArtem: 19403,
  walletNatali: 19404,
  cardAccount: 520859,
  entrepreneurAccount: 509014,
  visaDebitAccount: 509018
};
const OPERATION_MATCHERS = {
  withdrawFromATM: 'Отримання готівки в банкоматі',
  topUpFromEntrepreneurAccount: 'Б/г зарахування з іншого рахунку Клієнта',
  // transferToAlfaCredit: 'Переказ грошових коштів на картковий рахунок через MasterCard\\Visa\\CARD2CARD UA ALFACC KIEV UKR',
  transferToAlfaDebit: 'Переказ грошових коштів на картковий рахунок через MasterCard\\Visa',
  generalTransfer: 'Переказ грошових коштів'
};
const CATEGORIES_BY_DESCRIPTION = [
  {
    category: 'Продукти',
    keywords: [
      'SHOP BILLA',
      'UNIVERSAMSILPO',
      'SILPO',
      'LOTOK',
      'Lomonos MAGAZINPRODUKT'
    ]
  },
  {
    category: 'Кафе і ресторани',
    keywords: ['McDonald']
  },
  {
    category: 'Транспорт / Таксі',
    keywords: ['Uber BV']
  },
  {
    category: 'Транспорт / Метро',
    keywords: ['METROPOLITEN']
  },
  {
    category: 'Одяг',
    keywords: [
      'RESERVED',
      'MOHITO',
      'CROPPTOWN',
      'HOUSE',
      'NEW YORKER',
      'ZARA',
      'BEFREE',
      'OLKO',
      'OGGI',
      'STRADIVARIUS'
    ]
  },
  {
    category: 'Взуття',
    keywords: ['INTERTOP']
  }
];



// appendHtmlElement

const appendHtmlElement = (name, target, props = {}, styles = {}) => {
  const element = document.createElement(name);
  Object.entries(props).forEach((prop) => {
    element[prop[0]] = prop[1];
  });
  Object.entries(styles).forEach((style) => {
    element.style[style[0]] = style[1];
  });
  target.appendChild(element);
  return element;
};



// Helpers

const markRow = (row, color) => {
  row.style.boxShadow = `15px 0px 10px -10px inset ${color}`;
  const errorPane = row.querySelector('.hm-error');
  if (errorPane) errorPane.remove();
};

const addUiPane = (row, checked = false) => {
  const uiPane = row.querySelector('.hm-ui');
  if (!uiPane) {
    const panel = appendHtmlElement('div', row, { className: 'hm-ui' }, { display: 'table-row' });
    appendHtmlElement('input', panel, { type: 'checkbox', className: 'hm-checkbox', checked });
  }
};

const markSuccess = (row) => {
  markRow(row, '#00cd8e');
  addUiPane(row, true);
};

const markIgnored = (row) => {
  markRow(row, 'grey');
  addUiPane(row, false);
};

const markError = (row, text) => {
  markRow(row, 'red');
  appendHtmlElement('div', row, { innerText: text, className: 'hm-error' }, { display: 'table-row' });
};

class UkrsibParser {
  constructor() {
    this.saveBtn = null;
    this.parseBtn = null;
    this.startDate = null;
    this.parsedTransactions = [];

    chrome.runtime.onMessage.addListener((request) => {
      if (request.command === 'initialize') {
        console.log(request.lastTransactions);
        this.setStartDate(request.lastTransactions);
        this.addActionButtons();
      }
    });
  }

  setStartDate(lastTransactions) {
    if (lastTransactions && lastTransactions.ukrsib) {
      // start date will be passed as an integer through messages
      this.startDate = new Date(lastTransactions.ukrsib);
      // Increment date so parsing will start from the next day after last date
      this.startDate.setDate(this.startDate.getDate() + 1);
    }
  }

  addActionButtons() {
    const props = { className: 'hm-floating-btn' };
    this.saveBtn = appendHtmlElement('button', document.body,
      Object.assign({}, props, { innerText: 'Save parsed transactions' }),
      { bottom: '50px' }
    );
    this.parseBtn = appendHtmlElement('button', document.body,
      Object.assign({}, props, { innerText: 'Parse transactions' }),
      { bottom: '100px' }
    );
    this.saveBtn.onclick = () => {
      chrome.storage.sync.set({ 'parsedTransactions': this.parsedTransactions });
    };
    this.parseBtn.onclick = () => this.parsedTransactions = this.parse();
  }

  parse() {
    const transactions = [];
    const rows = document.querySelectorAll('.data .transactionItemPanel');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const transaction = {};

      try {
        const shouldIncludeCheckbox = row.querySelector('input.hm-checkbox');
        const dateStr = row.querySelector('.cell.date .date').innerText;
        const dayStr = dateStr.split('.')[0];
        const monthStr = dateStr.split('.')[1];
        const transactionDate = new Date(
          new Date().getFullYear(),
          parseInt(monthStr) - 1,
          dayStr
        );
        // Convert to integer for further saving in chrome extension store
        transaction.date = transactionDate.getTime();

        // First of all pay attention on user selection (if present)
        if (shouldIncludeCheckbox) {
          if (!shouldIncludeCheckbox.checked) {
            markIgnored(row);
            continue;
          }
        } else if (this.startDate && transactionDate < this.startDate) {
          markIgnored(row);
          continue;
        }

        let user;
        const accountDesc = row.querySelector('.cell.description .tool').innerText;
        const lastNumbersMatch = accountDesc.match(/\d{4}$/);
        if (lastNumbersMatch) {
          user = USERS[lastNumbersMatch[0]];
        }

        const amountStr = row
          .querySelector('.cell.amount .sum')
          .innerText.replace(/\s/g, '')
          .replace(',', '.');
        transaction.amount = Math.abs(parseFloat(amountStr));

        const description = row
          .querySelector('.cell.description .alias')
          .innerText.replace(/\\/g, ' ')
          .replace(/:віртуальною карткою \*\*\*\*\d+\./, '')
          .replace('Оплата товарів послуг ', '');

        if (description.match(OPERATION_MATCHERS.withdrawFromATM)) {
          if (!user) {
            markError(row, "Can't detect account where money were withdrawn");
            continue;
          }
          transaction.accountInfo = {
            fromId: ACCOUNTS.cardAccount,
            toId: ACCOUNTS[`wallet${user}`]
          };
          transaction.type = 'transfer';
          transaction.description = 'Зняття готівки в банкоматі';
        } else if (description.match(OPERATION_MATCHERS.topUpFromEntrepreneurAccount)) {
          transaction.accountInfo = {
            fromId: ACCOUNTS.entrepreneurAccount,
            toId: ACCOUNTS.visaDebitAccount
          };
          transaction.type = 'transfer';
          transaction.description = 'Переказ на карту АльфаБанк Visa Депозитна';
        } else if (description.match(OPERATION_MATCHERS.transferToAlfaDebit)) {
          transaction.accountInfo = {
            fromId: ACCOUNTS.cardAccount,
            toId: ACCOUNTS.cardAccount
          };
          transaction.type = 'transfer';
          transaction.description = 'Переказ коштів з раухку ФОП';
        } else if (description.match(OPERATION_MATCHERS.topUpFromEntrepreneurAccount)) {
          markError(row, "Unhandled money transfer");
          continue;
        } else {
          transaction.accountInfo = ACCOUNTS.cardAccount;
          transaction.type = 'expense';
          // Expense should be negative number
          transaction.amount = -1 * transaction.amount;
          transaction.description = [user, description].join(': ');
          // Trying to guess category
          CATEGORIES_BY_DESCRIPTION.forEach((cat) => {
            cat.keywords.forEach((keyword) => {
              if (description.match(new RegExp(keyword, 'i'))) {
                transaction.category = cat.category;
              }
            });
          });
          if (!transaction.category) {
            // TODO: Add icon category to category matching
            const icon = row.querySelector('.category .image');
            icon.dispatchEvent(new Event('mouseover'));
            const categoryTooltip = document.querySelector('.ui-tooltip-content');
            icon.dispatchEvent(new Event('mouseout'));
            transaction.category = '***' + categoryTooltip.innerText;
          }
        }

        transactions.push(transaction);
        markSuccess(row);
      } catch (e) {
        console.warn(row.innerText, e);
      }
    }
    console.info(transactions);
    return transactions;
  }
}

new UkrsibParser();
