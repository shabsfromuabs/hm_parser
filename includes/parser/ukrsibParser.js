// Last 4 digits of the card ro each spender
const SPENDERS = { '5076': 'Артем', '9292': 'Наталі', '8110': 'Наталі' };

const TRANSFER_MATCHERS = [
  {
    matcher: 'Отримання готівки в банкоматі',
    transactionInfo: ({ account, spenderName }) => ({
      description: 'Зняття готівки в банкоматі',
      from: account.name,
      to: `Гаманець [${spenderName}]`
    })
  },
  {
    matcher: 'Б/г зарахування з іншого рахунку Клієнта',
    transactionInfo: ({ account }) => ({
      description: 'Переказ коштів з раухку ФОП',
      from: 'ФОП Укрсиб UAH',
      to: account.name
    })
  },
  {
    matcher: 'Переказ на власний рахунок Elite накопичувальний',
    transactionInfo: ({ account }) => ({
      description: 'Поповнення накопичувального рахунку',
      from: account.name,
      to: 'Скарбничка Укрсиб [Elite]'
    })
  },
  {
    matcher: 'Переказ на власний рахунок ELITE картковий',
    transactionInfo: ({ account }) => ({
      description: 'Виведеня з накопичувального рахунку',
      from: 'Скарбничка Укрсиб [Elite]',
      to: account.name
    })
  }
];

const getDate = (row) => {
  const dateStr = row.querySelector('.cell.date .date').innerText;
  const [dayStr, monthStr, yearStr] = dateStr.split('.');
  return new Date(yearStr, parseInt(monthStr) - 1, dayStr);
};

const getAmount = (row) => {
  const amountStr = row
    .querySelector('.cell.amount .sum')
    .innerText.replace(/\s/g, '')
    .replace(',', '.');
  // NOTE: Expense should be negative numbers in HM, so keep "minus" sign
  return parseFloat(amountStr);
};

const getDescription = (row) => {
  return row
    .querySelector('.cell.description .alias')
    .innerText.replace(/\\/g, ' ')
    .replace(/:віртуальною карткою \*\*\*\*\d+\./, '')
    .replace('Оплата товарів послуг ', '');
};

const getBankProposedCategory = (row) => {
  const icon = row.querySelector('.category .image');
  icon.dispatchEvent(new Event('mouseover'));
  const categoryTooltip = document.querySelector('.ui-tooltip-content');
  icon.dispatchEvent(new Event('mouseout'));
  return categoryTooltip.innerText;
};

const getSpenderName = (row) => {
  const accountDesc = row.querySelector('.cell.description .tool').innerText;
  const lastNumbersMatch = accountDesc.match(/\d{4}$/);
  if (lastNumbersMatch) {
    return SPENDERS[lastNumbersMatch[0]];
  }
  return '';
};

const getTransferAssociatedWithTransaction = ({ amount, description, account, spenderName }) => {
  const transferMatcher = TRANSFER_MATCHERS.find((tm) => description.match(tm.matcher));
  if (transferMatcher) {
    return transferMatcher.transactionInfo({ amount, description, account, spenderName });
  }
  return null;
};

class UkrsibParser {
  constructor() {
    const account = getAccountByName('Карта Укрсиб [Elite]');

    chrome.runtime.onMessage.addListener((request) => {
      if (request.command === 'parse') {
        console.log('parsing');
        chrome.storage.sync.set({
          parsedTransactions: parse(
            account,
            document.querySelectorAll('.data .transactionItemPanel')
          ),
          account
        });
      }
    });
  }
}

new UkrsibParser();
