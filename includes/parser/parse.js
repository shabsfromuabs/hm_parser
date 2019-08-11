const parse = (account, rows) => {
  const transactions = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const transaction = {};

    try {
      // Convert to integer for further saving in chrome extension store
      transaction.date = getDate(row).getTime();

      const amount = getAmount(row);
      const description = getDescription(row);
      const spenderName = getSpenderName(row);

      transaction.originalDescription = description;

      const transferTransactionDetails = getTransferAssociatedWithTransaction({
        amount, description, account, spenderName
      });

      if (transferTransactionDetails) {
        // This is a transfer transaction
        transaction.type = 'transfer';
        transaction.fromAmount = Math.abs(transferTransactionDetails.fromAmount || amount);
        transaction.toAmount = Math.abs(transferTransactionDetails.toAmount || amount);
        transaction.description = transferTransactionDetails.description;
        const from = getAccountByName(transferTransactionDetails.from);
        const to = getAccountByName(transferTransactionDetails.to);
        transaction.fromAccountId = from && from.id;
        transaction.toAccountId = to && to.id;
      } else {
        // This is a regular transaction
        transaction.type = amount < 0 ? 'expense' : 'income';
        transaction.amount = amount;
        transaction.accountId = account.id;
        const { description: descriptionGuess, category: categoryGuess } = guessTransactionDetails({
          description,
          bankCategory: getBankProposedCategory(row)
        });
        transaction.description = [
          spenderName && `[${spenderName}]`,
          (descriptionGuess || description)
        ].join(' ');
        transaction.category = categoryGuess;
      }

      transactions.push(transaction);
      markRowWithColor(row, 'rgba(0, 128, 0, 0.2)');
    } catch (e) {
      console.warn(row.innerText, e);
      markRowWithColor(row, 'rgba(255, 0, 0, 0.2)');
    }
  }
  console.log(transactions);
  return transactions;
};
