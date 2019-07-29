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

      const transferTransactionDetails = getTransferAssociatedWithTransaction({
        amount, description, account, spenderName
      });

      if (transferTransactionDetails) {
        // This is a transfer transaction
        transaction.type = 'transfer';
        transaction.amount = transferTransactionDetails.amount || Math.abs(amount);
        transaction.description = transferTransactionDetails.description;
        const from = getAccountByName(transferTransactionDetails.to);
        const to = getAccountByName(transferTransactionDetails.from);
        transaction.accountInfo = {
          fromId: from && from.id,
          toId: to && to.id,
        };
      } else {
        // This is a regular transaction
        transaction.type = amount < 0 ? 'expense' : 'income';
        transaction.amount = amount;
        transaction.accountInfo = account.id;
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
    } catch (e) {
      console.warn(row.innerText, e);
      row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    }
  }
  console.log(transactions);
  return transactions;
};
