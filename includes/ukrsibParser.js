// Last 4 digits of the card ro each user
const USERS = { '5076': 'Артем', '9292': 'Наталі', '8110': 'Артем' };

const OPERATION_MATCHERS = {
  withdrawFromATM: 'Отримання готівки в банкоматі',
  topUpFromEntrepreneurAccount: 'Б/г зарахування з іншого рахунку Клієнта',
  // transferToAlfaCredit: 'Переказ грошових коштів на картковий рахунок через MasterCard Visa',
  transferToAlfaDebit: 'Переказ грошових коштів на картковий рахунок через MasterCard Visa',
  generalTransfer: 'Переказ грошових коштів'
};

// Helpers

const markRow = (row, color) => {
  row.style.boxShadow = `15px 0px 10px -10px inset ${color}`;
};

const removeError = (row) => {
  const errorPane = row.querySelector('.hm-error');
  const warningPane = row.querySelector('.hm-warning');
  if (errorPane) errorPane.remove();
  if (warningPane) warningPane.remove();
};

const addUiPane = (row) => {
  const uiPane = row.querySelector('.hm-ui');
  if (!uiPane) {
    return appendHtmlElement('div', row, { className: 'hm-ui' }, { display: 'table-row' });
  }
  return uiPane;
};

const addCheckbox = (uiPane, checked = false) => {
  let wrapper = uiPane.querySelector('.hm-checkbox-wrap');
  if (!wrapper) {
    wrapper = appendHtmlElement('div', uiPane, { className: 'hm-checkbox-wrap' }, { display: 'table-cell' });
    appendHtmlElement('input', wrapper, { type: 'checkbox', className: 'hm-should-parse', checked });
  }
  return wrapper;
};

const markSuccess = (row, transaction) => {
  markRow(row, '#00cd8e');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, true);
  const { input, select } = appendParsedInfo(uiPane);
  input.value = transaction.description;
  select.value = transaction.category;
};

const markIgnored = (row) => {
  markRow(row, 'grey');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, false);
};

const markWarning = (row, text) => {
  markRow(row, '#eace2e');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, true);
  appendHtmlElement('div', uiPane, { innerText: text, className: 'hm-warning' }, { display: 'table-cell' });
};

const markError = (row, text) => {
  markRow(row, 'red');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, true);
  appendHtmlElement('div', uiPane, { innerText: text, className: 'hm-error' }, { display: 'table-cell' });
};

const getUkrsibCategory = (row) => {
  const icon = row.querySelector('.category .image');
  icon.dispatchEvent(new Event('mouseover'));
  const categoryTooltip = document.querySelector('.ui-tooltip-content');
  icon.dispatchEvent(new Event('mouseout'));
  return categoryTooltip.innerText;
};

class UkrsibParser {
  constructor() {
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
    const props = { className: 'hm-floating-btn', innerText: 'Parse Transactions' };
    this.parseBtn = appendHtmlElement('button', document.body, props);
    this.parseBtn.onclick = () => this.parsedTransactions = this.parse();
  }

  parse() {
    const transactions = [];
    const rows = document.querySelectorAll('.data .transactionItemPanel');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const transaction = {};

      try {
        const shouldParseCheckbox = row.querySelector('input.hm-should-parse');
        const descriptionInput = row.querySelector('input.hm-description');
        const categorySelect = row.querySelector('select.hm-category');
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
        if (shouldParseCheckbox) {
          if (!shouldParseCheckbox.checked) {
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
        // NOTE: Expense should be negative numbers in HM
        transaction.amount = parseFloat(amountStr);

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
            fromId: getAccountByName('MC Укрсиб [Elite]').id,
            toId: getAccountByName(`Гаманець [${user}]`).id
          };
          transaction.amount = Math.abs(transaction.amount);
          transaction.type = 'transfer';
          transaction.description = 'Зняття готівки в банкоматі';
        } else if (description.match(OPERATION_MATCHERS.topUpFromEntrepreneurAccount)) {
          transaction.accountInfo = {
            fromId: getAccountByName('ФОП Укрсиб UAH').id,
            toId: getAccountByName('MC Укрсиб [Elite]').id
          };
          transaction.amount = Math.abs(transaction.amount);
          transaction.type = 'transfer';
          transaction.description = 'Переказ коштів з раухку ФОП';
        // } else if (description.match(OPERATION_MATCHERS.transferToAlfaDebit)) {
        //   transaction.accountInfo = {
        //     fromId: getAccountByName('MC Укрсиб [Elite]').id,
        //     toId: getAccountByName('Visa Альфа Депозитна [Артем]').id
        //   };
        //   transaction.amount = Math.abs(transaction.amount);
        //   transaction.type = 'transfer';
        //   transaction.description = 'Переказ на карту АльфаБанк Visa Депозитна';
        } else if (description.match(OPERATION_MATCHERS.generalTransfer)) {
          markWarning(row, "Unhandled money transfer");
          continue;
        } else {
          transaction.accountInfo = getAccountByName('MC Укрсиб [Elite]').id;
          transaction.type = transaction.amount < 0 ? 'expense' : 'income';
          const { description: descriptionGuess, category: categoryGuess } = guessTransactionDetails({
            description,
            ukrsibCategory: getUkrsibCategory(row)
          });
          // First of all pay attention to description input (if present)
          if (descriptionInput) {
            transaction.description = descriptionInput.value
          } else {
            transaction.description = [
              Math.abs(transaction.amount),
              user && `[${user}]`,
              (descriptionGuess || description)
            ].join(' ');
          }
          // First of all pay attention to category select (if present)
          transaction.category = categorySelect ? categorySelect.value : categoryGuess;
        }

        transactions.push(transaction);
        markSuccess(row, transaction);
      } catch (e) {
        console.warn(row.innerText, e);
      }
    }
    console.info(transactions);
    chrome.storage.sync.set({ 'parsedTransactions': transactions });
    return transactions;
  }
}

new UkrsibParser();
