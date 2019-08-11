TRANSACTION_TYPE_CODES = { expense: 'e', income: 'i', transfer: 't' };

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

const createTransaction = ({
  token,
  type,
  date,
  amount,
  fromAmount,
  toAmount,
  accountId,
  fromAccountId,
  toAccountId,
  category = null,
  description = null
}) => {
  const formattedDate = [
    date.getFullYear(),
    zeroPaddedNumber(date.getMonth() + 1),
    zeroPaddedNumber(date.getDate())
  ].join('-');

  const commonFields = {
    subtype: TRANSACTION_TYPE_CODES[type],
    category,
    date: formattedDate,
    transfer_type: 'a',
    type: 'unplanned',
    virtual_id: -1
  };

  const transaction =
    type !== 'transfer' ?
      {
        ...commonFields,
        description: [Math.abs(amount), description].join(' '),
        account_id: accountId,
        currency: getAccount(accountId).currency,
        real_amount: amount
      } : {
        ...commonFields,
        description,
        // From
        transfer_from_id: fromAccountId,
        account_id: fromAccountId,
        real_amount: fromAmount,
        currency: getAccount(fromAccountId).currency,
        // To
        transfer_to_id: toAccountId,
        transfer_to_amount: toAmount,
        transfer_to_currency: getAccount(toAccountId).currency
      };

  console.log(transaction);

  return fetch('/api/transaction', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      hm_source: 'HM3',
      user_email: 'shabsfromuabs@gmail.com',
      user_token: token
    },
    body: JSON.stringify({ transaction })
  });
};
