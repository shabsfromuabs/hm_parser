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
          } else throw 'User credentials are incorrect';
        });
      } else {
        throw response.statusText || response;
      }
    });

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
    zeroPaddedNumber(date.getMonth() + 1),
    zeroPaddedNumber(date.getDate())
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
