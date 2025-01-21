const parse = async (rows, options) => {
  const transactions = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const transaction = await getTransactionFromRow(row, rows, options);
      transactions.push(transaction);
      markRowWithColor(row, "rgba(0, 128, 0, 0.2)");
    } catch (e) {
      console.warn(row.innerText, e);
      markRowWithColor(row, "rgba(255, 0, 0, 0.2)");
    }
  }

  console.log(transactions);
  return transactions;
};

const getTransferAssociatedWithTransaction = ({
  amount,
  description,
  account,
  spenderName,
  currencyAmountStr,
}) => {
  const transferMatcher = TRANSFER_MATCHERS.find((tm) =>
    description.match(new RegExp(tm.matcher, "i"))
  );
  if (transferMatcher) {
    return transferMatcher.transactionInfo({
      amount,
      description,
      account,
      spenderName,
      currencyAmountStr,
    });
  }
  return null;
};

const getSpecialTransactionDetails = ({
  amount,
  description,
  account,
  spenderName,
  currencyAmountStr,
}) => {
  const specialMatcher = SPECIAL_MATCHERS.find((tm) =>
    description.match(new RegExp(tm.matcher, "i"))
  );
  if (specialMatcher) {
    return specialMatcher.transactionInfo({
      amount,
      description,
      account,
      spenderName,
      currencyAmountStr,
    });
  }
  return null;
};

const getTransactionFromRow = async (row, rows, options) => {
  // Convert date to integer for further saving in chrome extension store
  const [account, date, amount, description, spenderName, currencyAmount, currencyName] =
    await getBasicTransactionDetails(row, rows, options);

  const currencyAmountStr =
    currencyAmount && `(${currencyAmount} ${currencyName})`;

  const transferTransactionDetails = getTransferAssociatedWithTransaction({
    amount,
    description,
    account,
    spenderName,
    currencyAmountStr,
  });

  if (transferTransactionDetails) {
    // This is a transfer transaction
    const from = getAccountByName(transferTransactionDetails.from);
    const to = getAccountByName(transferTransactionDetails.to);

    return {
      type: "transfer",
      fromAmount: Math.abs(transferTransactionDetails.fromAmount || amount),
      toAmount: Math.abs(transferTransactionDetails.toAmount || amount),
      description: transferTransactionDetails.description,
      fromAccountId: from && from.id,
      toAccountId: to && to.id,
      date,
      originalDescription: description,
    };
  }

  const specialTransactionDetails = getSpecialTransactionDetails({
    amount,
    description,
    account,
    spenderName,
    currencyAmountStr,
  });

  const { description: descriptionGuess, category: categoryGuess } =
    guessTransactionDetails({
      description,
      bankCategory: getBankProposedCategory(row),
    });

  const finialDescription = [
    spenderName && `[${spenderName}]`,
    currencyAmountStr && currencyAmountStr,
    descriptionGuess || description,
  ]
    .filter((v) => v)
    .join(" ");

  const transaction = {
    accountId: account.id,
    amount: amount,
    category: categoryGuess,
    description: finialDescription,
    type: amount < 0 ? "expense" : "income",
  };

  return {
    ...transaction,
    ...specialTransactionDetails,
    date,
    originalDescription: description,
  };
};
