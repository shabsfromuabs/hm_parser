// Last 4 digits of the card ro each user
const USERS = { '5076': 'Artem', '9292': 'Natali', '8110': 'Artem' };
// Account ids in Honey Money system
const ACCOUNTS = {
  walletArtem: 19403,
  walletNatali: 19404,
  cardAccount: 520859,
  entrepreneurAccount: 509014
};
const WITHDRAW_OPERATION_REGEXP = /Отримання готівки в банкоматі/;
const TOP_UP_OPERATION_REGEXP = 'Б/г зарахування з іншого рахунку Клієнта';
const GENERAL_TRANSFER_REGEXP = /Переказ грошових коштів/;
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

let saveBtn;
let parseBtn;
let startDate;
let parsedTransactions;

const saveParsedTransactions = () => {
  console.log('SAVE', parsedTransactions);
  chrome.storage.sync.set({ 'parsedTransactions': parsedTransactions });
  console.log('SAVED');
  chrome.storage.sync.get('parsedTransactions', (result) => {
    console.log('PARSED TRS:', result.parsedTransactions);
  });
};

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

const addActionButtons = () => {
  const props = { className: 'hm-floating-btn' };
  saveBtn = appendHtmlElement('button', document.body,
    Object.assign({}, props, { innerText: 'Save parsed transactions' }),
    { bottom: '50px' }
  );
  parseBtn = appendHtmlElement('button', document.body,
    Object.assign({}, props, { innerText: 'Parse transactions' }),
    { bottom: '100px' }
  );
  saveBtn.onclick = saveParsedTransactions;
  parseBtn.onclick = () => parsedTransactions = parse();
};

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

function parse() {
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
      } else if (transactionDate < startDate) {
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

      if (description.match(WITHDRAW_OPERATION_REGEXP)) {
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
      } else if (description.match(TOP_UP_OPERATION_REGEXP)) {
        transaction.accountInfo = {
          fromId: ACCOUNTS.entrepreneurAccount,
          toId: ACCOUNTS.cardAccount
        };
        transaction.type = 'transfer';
        transaction.description = 'Переказ коштів з раухку ФОП';
      } else if (description.match(GENERAL_TRANSFER_REGEXP)) {
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
  console.log(transactions);
  return transactions;
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'initialize') {
    console.log(request.lastTransactions);
    if (request.lastTransactions && request.lastTransactions.ukrsib) {
      // start date will be passed as an integer through messages
      startDate = new Date(request.lastTransactions.ukrsib);
      // Increment date so parsing will start from the next day after last date
      startDate.setDate(startDate.getDate() + 1);
    }
    addActionButtons();
  }
});
