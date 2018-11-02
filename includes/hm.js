const ACCOUNTS = {
  19403: { currency: 'uah', name: 'Гаманець [Артем]' },
  19404: { currency: 'uah', name: 'Гаманець [Наталі]' },
  520859: { currency: 'uah', name: 'MC Укрсиб [Elite]' },
  520925: { currency: 'uah', name: 'Visa Альфа [Наталі]' },
  19408: { currency: 'uah', name: 'Карта "Приватбанк"' },
  22936: { currency: 'uah', name: 'MC Альфа Кредитна [Артем]' },
  509018: { currency: 'uah', name: 'Visa Альфа Депозитна [Артем]' },
  19405: { currency: 'uah', name: 'Visa Ощадбанк [Артем]' },
  19406: { currency: 'uah', name: 'Visa Ощадбанк Virtual [Артем]' },
  19409: { currency: 'uah', name: 'Конверт UAH' },
  19417: { currency: 'usd', name: 'Конверт USD' },
  509014: { currency: 'uah', name: 'ФОП Укрсиб UAH' },
  509015: { currency: 'usd', name: 'ФОП Укрсиб USD' },
  509017: { currency: 'uah', name: 'ФОП CreditAgricole UAH' },
  509016: { currency: 'usd', name: 'ФОП CreditAgricole USD' },
  509019: { currency: 'uah', name: 'Депозит Альфа UAH [Артем]' },
  513027: { currency: 'usd', name: 'Депозит Альфа USD [Наталі]' },
  19414: { currency: 'uah', name: 'Депозит Ощадбанк UAH [Артем]' },
  64604: { currency: 'usd', name: 'Банківська ячейка USD' },
  64605: { currency: 'uah', name: 'Банківська ячейка EUR' },
  25408: { currency: 'usd', name: 'Вадим USD' },
  19647: { currency: 'uah', name: 'Карта \"Моя картка\" \"Ощадбанк\"' },
  19411: { currency: 'uah', name: 'Мобільні заощадження \"Ощадбанк\"' },
  19410: { currency: 'uah', name: 'Коробка UAH' },
  19418: { currency: 'uah', name: 'Коробка EUR' },
  19413: { currency: 'uah', name: 'Депозит \"Мегабанк\"' },
  19416: { currency: 'usd', name: 'Депозит \"Мегабанк\" USD' },
  19412: { currency: 'uah', name: 'Депозит \"Мегабанк\" Палажченко' },
  19415: { currency: 'uah', name: 'Депозит \"Укргазбанк\"' },
  25283: { currency: 'uah', name: 'Вадим' },
  23395: { currency: 'uah', name: 'Жман' },
  19407: { currency: 'uah', name: 'Карта \"Мегабанк\"' },
  66137: { currency: 'usd', name: 'Жман USD' },
  26542: { currency: 'uah', name: 'Олег Гончаренко' },
};

const TRANSACTION_TYPE_CODES = { expense: 'e', income: 'i', transfer: 't' };

let token;
let exportBtn;

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
  const props = { className: 'hm-floating-btn', innerText: 'Parse transactions'};
  exportBtn = appendHtmlElement('button', document.body, props);
  exportBtn.onclick = exportTransactions;
};

const zeroPadded = (int) => (int < 10 ? `0${int}` : int.toString());

const createTransaction = (
  token,
  type,
  date,
  amount,
  accountInfo, // accountId OR { fromId: x, toId: y }
  description = null,
  category = null
) => {
  const formattedDate = [
    date.getFullYear(),
    zeroPadded(date.getMonth() + 1),
    zeroPadded(date.getDate())
  ].join('-');

  const accountId = type === 'transfer' ? accountInfo.toId : accountInfo;
  const currency = ACCOUNTS[accountId].currency;
  const subtype = TRANSACTION_TYPE_CODES[type];

  const params = {
    transaction: {
      account_id: accountId,
      category,
      currency,
      date: formattedDate,
      description,
      real_amount: amount,
      subtype,
      type: 'unplanned',
      virtual_id: -1
    }
  };

  if (type === 'transfer') {
    const transaction = params.transaction;
    transaction.transfer_from_id = accountInfo.fromId;
    transaction.transfer_to_amount = amount;
    transaction.transfer_to_currency = null;
    transaction.transfer_to_id = accountInfo.toId;
    transaction.transfer_type = 'a';
  }

  return fetch('/api/transaction', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      hm_source: 'HM3',
      user_email: 'shabsfromuabs@gmail.com',
      user_token: token
    },
    body: JSON.stringify(params)
  });
};

const getToken = (email, password) =>
  fetch('/api/user_session', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      remember_me: true,
      from: 'hm3'
    })
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          if (data.status === 'success') {
            return data.user.authentication_token;
          }
          else throw 'User credentials are incorrect';
        });
      } else {
        throw response.statusText || response;
      }
    });

function exportTransactions() {
  chrome.storage.sync.get('parsedTransactions', (result) => {
    console.log('parsedTransactions', result.parsedTransactions);
    result.parsedTransactions.forEach((tr) => {
      console.log('TR:', tr);
      createTransaction(token, tr.type, new Date(tr.date), tr.amount, tr.accountInfo, tr.description, tr.category)
        .then(() => {
          // Remember last transaction's date
          chrome.storage.sync.set({ 'lastTransactions': { ukrsib: new Date(tr.date).getTime() } });
          // TODO: Display success
        })
        .catch((e) => {
          console.warn(e);
          // TODO: Display error
        });
    });
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'initialize') {

    chrome.storage.sync.get('credentials', (result) => {
      const credentials = result.credentials || {};
      getToken(credentials.email, credentials.password)
        .then((tock) => {
          token = tock;
          addActionButtons();
        })
        .catch((e) => {
          console.warn(e);
          alert(e.message || e);
        });
    });
  }
});
