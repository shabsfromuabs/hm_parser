const parse = (account, rows) => {
  const transactions = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const transaction = getTransactionFromRow(account, row);
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

const getTransactionFromRow = (account, row) => {
  // Convert date to integer for further saving in chrome extension store
  const date = getDate(row).getTime();
  const amount = getAmount(row);
  const description = getDescription(row);
  const spenderName = getSpenderName(row);

  const transferTransactionDetails = getTransferAssociatedWithTransaction({
    amount,
    description,
    account,
    spenderName,
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
  });

  const { description: descriptionGuess, category: categoryGuess } =
    guessTransactionDetails({
      description,
      bankCategory: getBankProposedCategory(row),
    });

  const finialDescription = [
    spenderName && `[${spenderName}]`,
    descriptionGuess || description,
  ].join(" ");

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
