const detectCurrentAccount = (cardNumber) => {
  if (cardNumber === '4102xxxxxxx5728') return getAccountByName('Карта Альфа Debit [Артем]');
  else if (cardNumber === '4102xxxxxxx4587') return getAccountByName('Карта Альфа Travel [Артем]');
  else if (cardNumber === '5355xxxxxxx7060') return getAccountByName('Карта Альфа Credit [Артем]');
  // TODO: Add card number
  else if (cardNumberi === '') return getAccountByName('Карта Альфа [Наталі]');
  // else if (cardNumber === '4102xxxxxxx4728') return null; // EUR Artem
  return null
};

const TRANSFER_MATCHERS = [
  {
    matcher: 'Зняття готівки в банкоматі',
    transactionInfo: ({ account }) => {
      userNameMatch = account.name.match(/(Артем|Наталі)/);
      return {
        description: 'Зняття готівки в банкоматі',
        from: account.name,
        to: `Гаманець [${userNameMatch[1]}]`
      }
    }
  },
  {
    matcher: 'Зачисление перевода MoneySend',
    transactionInfo: ({ account }) => ({
      description: 'Поповнення з карти Укрсиб',
      from: 'Карта Укрсиб [Elite]',
      to: account.name
    })
  }
];

const getDate = (row) => {
  const dateStr = row.querySelector('td.column-1').innerText;
  const [dayStr, monthStr, yearStr] = dateStr.split('.');
  return new Date(yearStr, parseInt(monthStr) - 1, dayStr);
};

const getAmount = (row) => {
  const amountStr = row.querySelector('td.column-4').innerText
    .replace(/\s/g, '')
    .replace(',', '.');
  // NOTE: Expense should be negative numbers in HM, so keep "minus" sign
  return parseFloat(amountStr);
};

const getDescription = (row) => {
  return row.querySelector('td.column-3').innerText
    .replace('(', ' ')
    .replace(')', ' ')
    .replace('Покупка ', '')
    .replace('POS Purchase - ', '');
};

const getBankProposedCategory = () => {
};

const getSpenderName = () => {
};

const getTransferAssociatedWithTransaction = ({ amount, description, account, spenderName }) => {
  const transferMatcher = TRANSFER_MATCHERS.find((tm) => description.match(tm.matcher));
  if (transferMatcher) {
    return transferMatcher.transactionInfo({ amount, description, account, spenderName });
  }
  return null;
};

class AlfaParser {
  constructor() {
    const cardName = document.querySelector('.card-primary').innerText;
    const account = detectCurrentAccount(cardName);
    if (!account) alert("Can't detect account");

    chrome.runtime.onMessage.addListener((request) => {
      if (request.command === 'parse') {
        console.log('parsing');
        chrome.storage.sync.set({
          parsedTransactions: parse(
            account,
            document.querySelectorAll('table.x-acct-operations tbody tr')
          ),
          account
        });
      }
    });
  }
}

new AlfaParser();
