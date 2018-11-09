const TRANSACTION_TYPE_CODES = { expense: 'e', income: 'i', transfer: 't' };

let token;
let exportBtn;

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
  const currency = getAccount(accountId).currency;
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
