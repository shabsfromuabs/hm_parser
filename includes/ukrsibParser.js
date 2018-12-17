// Last 4 digits of the card ro each user
const USERS = { '5076': 'Артем', '9292': 'Наталі', '8110': 'Наталі' };

const TRANSFER_OPERATION_MATCHERS = {
  withdrawFromATM: 'Отримання готівки в банкоматі',
  topUpFromEntrepreneurAccount: 'Б/г зарахування з іншого рахунку Клієнта',
  generalTransfer: 'Переказ грошових коштів'
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
        console.log('initialize parser');
        this.setStartDate();
        this.addActionButtons();
      }
    });
  }

  setStartDate() {
    // lastUkrsibTransaction is an integer representation of a date when last transaction was exported to HM, like: 823423412
    chrome.storage.sync.get('lastUkrsibTransaction', (result) => {
      console.log('lastUkrsibTransaction loaded', result.lastUkrsibTransaction);

      if (result.lastUkrsibTransaction) {
        // start date will be passed as an integer through messages
        this.startDate = new Date(result.lastUkrsibTransaction);
        // Increment date so parsing will start from the next day after last date
        this.startDate.setDate(this.startDate.getDate() + 1);
      }
    });
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
        const [dayStr, monthStr, yearStr] = dateStr.split('.');
        const transactionDate = new Date(yearStr, parseInt(monthStr) - 1, dayStr);
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

        if (description.match(TRANSFER_OPERATION_MATCHERS.withdrawFromATM)) {
          if (!user) {
            markError(row, "Can't detect account where money were withdrawn");
            continue;
          }
          transaction.accountInfo = {
            fromId: getAccountByName('Карта Укрсиб [Elite]').id,
            toId: getAccountByName(`Гаманець [${user}]`).id
          };
          transaction.amount = Math.abs(transaction.amount);
          transaction.type = 'transfer';
          transaction.description = 'Зняття готівки в банкоматі';
        } else if (description.match(TRANSFER_OPERATION_MATCHERS.topUpFromEntrepreneurAccount)) {
          transaction.accountInfo = {
            fromId: getAccountByName('ФОП Укрсиб UAH').id,
            toId: getAccountByName('Карта Укрсиб [Elite]').id
          };
          transaction.amount = Math.abs(transaction.amount);
          transaction.type = 'transfer';
          transaction.description = 'Переказ коштів з раухку ФОП';
        } else if (description.match(TRANSFER_OPERATION_MATCHERS.generalTransfer)) {
          markWarning(row, 'Unhandled money transfer');
          continue;
        } else {
          transaction.accountInfo = getAccountByName('Карта Укрсиб [Elite]').id;
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
    chrome.storage.sync.set({ parsedTransactions: transactions, transactionsSource: 'ukrsib' });
    return transactions;
  }
}

new UkrsibParser();
