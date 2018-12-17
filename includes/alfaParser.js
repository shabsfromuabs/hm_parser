const detectCurrentAccount = (cardName) => {
  if (cardName.match(/Пакет Ультра/i)) return getAccountByName('Карта Альфа Debit [Артем]');
  else if (cardName.match(/Кредитна карта World/i)) return getAccountByName('Карта Альфа Credit [Артем]');
  else if (cardName.match(/Альфа Travel/i)) return getAccountByName('Карта Альфа Travel [Артем]');
  else if (cardName.match(/Зарплатна карта/i)) return getAccountByName('Карта Альфа [Наталі]');
};

const TRANSFER_OPERATION_MATCHERS = {
  withdrawFromATM: 'Зняття готівки в банкоматі',
  transferFromUkrsib: 'Зачисление перевода MoneySend',
  ignoreTransfer: '(Дохідний|Доходного) сейф'
};

class AlfaParser {
  constructor() {
    this.parseBtn = null;
    this.startDate = null;
    this.parsedTransactions = [];

    chrome.runtime.onMessage.addListener((request) => {
      if (request.command === 'initialize') {
        console.log('init parser. lastTransactionsDates:', request.lastTransactionsDates);
        this.setStartDate(request.lastTransactionsDates);
        this.addActionButtons();
      }
    });
  }

  setStartDate() {
    // lastAlfaTransaction is an integer representation of a date when last transaction was exported to HM, like: 823423412
    chrome.storage.sync.get('lastAlfaTransaction', (result) => {
      console.log('lastAlfaTransaction loaded', result.lastAlfaTransaction);

      if (result.lastAlfaTransaction) {
        // start date will be passed as an integer through messages
        this.startDate = new Date(result.lastAlfaTransaction);
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
    const rows = document.querySelectorAll('table.x-acct-operations tbody tr');
    const cardName = document.getElementById('defaultSettingsId_productName').innerText;
    const currentAccount = detectCurrentAccount(cardName);
    if (!currentAccount) {
      console.warn("Can't detect account");
      return [];
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const transaction = {};

      try {
        const shouldParseCheckbox = row.querySelector('input.hm-should-parse');
        const descriptionInput = row.querySelector('input.hm-description');
        const categorySelect = row.querySelector('select.hm-category');

        const dateStr = row.querySelector('td.column-1').innerText;
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

        const amountStr = row.querySelector('td.column-4').innerText
          .replace(/\s/g, '')
          .replace(',', '.');
        // NOTE: Expense should be negative numbers in HM
        transaction.amount = parseFloat(amountStr);

        const description = row.querySelector('td.column-3').innerText
          .replace('(', ' ')
          .replace(')', ' ')
          .replace('Покупка ', '')
          .replace('POS Purchase - ', '');

        if (description.match(TRANSFER_OPERATION_MATCHERS.withdrawFromATM)) {
          const userNameMatch = currentAccount.name.match(/(Артем|Наталі)/);
          if (!userNameMatch) {
            markError(row, "Can't detect account where money were withdrawn");
            continue;
          }
          transaction.accountInfo = {
            fromId: currentAccount.id,
            toId: getAccountByName(`Гаманець [${userNameMatch[1]}]`).id
          };
          transaction.amount = Math.abs(transaction.amount);
          transaction.type = 'transfer';
          transaction.description = 'Зняття готівки в банкоматі';
        } else if (description.match(TRANSFER_OPERATION_MATCHERS.transferFromUkrsib)) {
          transaction.accountInfo = {
            fromId: getAccountByName('Карта Укрсиб [Elite]').id,
            toId: currentAccount.id
          };
          transaction.amount = Math.abs(transaction.amount);
          transaction.type = 'transfer';
          transaction.description = 'Поповнення з карти Укрсибу';
        } else if (description.match(TRANSFER_OPERATION_MATCHERS.ignoreTransfer)) {
          markWarning(row, 'Переказ з/на дохідний сейф');
          continue;
        } else {
          transaction.accountInfo = currentAccount.id;
          transaction.type = transaction.amount < 0 ? 'expense' : 'income';
          const { description: descriptionGuess, category: categoryGuess } = guessTransactionDetails({ description });
          // First of all pay attention to description input (if present)
          if (descriptionInput) {
            transaction.description = descriptionInput.value
          } else {
            transaction.description = [
              Math.abs(transaction.amount),
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
    chrome.storage.sync.set({ parsedTransactions: transactions, transactionsSource: 'alfa' });
    return transactions;
  }
}

new AlfaParser();
