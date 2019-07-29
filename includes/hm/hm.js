class HmUploader {
  TRANSACTION_TYPES = ['income', 'expense', 'transfer'];
  TRANSACTION_TYPE_CODES = { expense: 'e', income: 'i', transfer: 't' };

  constructor() {
    this.wrapper = document.querySelector('#app');
    this.setToken();
    this.setTransactions();
    this.preparePage();

    setTimeout(() => {
      console.log('token', this.token);
      console.log('transactions', this.transactions);
    }, 1000);
  }

  setToken() {
    chrome.storage.sync.get('credentials', (result) => {
      const credentials = result.credentials || {};
      getToken(credentials.email, credentials.password)
        .then((token) => {
          this.token = token;
        })
        .catch((e) => {
          console.warn(e);
          alert(`Unable to get token: ${e.message || e}`);
        });
    });
  }

  setTransactions() {
    chrome.storage.sync.get('parsedTransactions', (result) => {
      this.transactions = sortBy(result.parsedTransactions, 'date');
      this.transactionRows = {};
      this.renderTransactions();
      this.addCheckboxListener();
      this.addTogglesListener();
    });
  }

  preparePage() {
    this.wrapper.innerHTML = '';
    appendHtmlElement('link', document.head, '', {
      rel: 'stylesheet',
      href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
    });
    this.container = appendHtmlElement('div', this.wrapper, 'container transactions-container');
  }

  renderTransactions() {
    this.transactions.forEach((tr, i) => {
      const rowClass = `row transaction-row ${i % 2 === 0 ? 'even' : 'odd'}`;
      const form = appendHtmlElement('form', this.container, rowClass, { id: `transaction-row-${i}` });

      const colControls = appendHtmlElement('div', form, 'col-2');
      const colAmount = appendHtmlElement('div', form, 'col-2');
      const colSelects = appendHtmlElement('div', form, 'col-4');
      const colDescription = appendHtmlElement('div', form, 'col-4');
      this.transactionRows[i] = { form, colControls, colAmount, colSelects, colDescription };

      this.renderTransactionControls(tr, i);
      this.renderTransactionDetails(tr, i);
    });
  }

  addCheckboxListener() {
    document.querySelectorAll('input[name="should_export_transaction"]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const transactionId = e.target.getAttribute('data-transaction-id');
        const { form } = this.transactionRows[transactionId];
        form.querySelectorAll('input[type="text"], select, textarea').forEach((element) => (
          e.target.checked ? element.removeAttribute('disabled') : element.setAttribute('disabled', true)
        ));
      }, false);
    });
  }

  addTogglesListener() {
    document.querySelectorAll('input[name="transaction_type"]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const transactionId = e.target.getAttribute('data-transaction-id');
        const { form } = this.transactionRows[transactionId];
        const newTransactionType = e.target.value;
        const prevTransactionType = form.getAttribute('data-transaction-type');

        // Make selected toggle button active
        const btnGroup = e.target.parentElement.parentElement;
        for (let i = 0; i < btnGroup.children.length; i++) {
          btnGroup.children[i].classList.remove('active');
        }
        e.target.parentElement.classList.add('active');

        // Render new transaction details
        const transaction = this.getTransactionDetails(form, prevTransactionType);
        this.renderTransactionDetails(this.convertTransactionToType(transaction, newTransactionType), transactionId);
      }, false);
    });
  }

  renderTransactionControls(tr, id) {
    const { colControls } = this.transactionRows[id];
    const row = appendHtmlElement('div', colControls, 'row');

    // Add checkbox control identifying that transaction should be exported to HM
    const colCheckbox = appendHtmlElement('div', row, 'col-auto');
    addPrettyCheckbox(colCheckbox, 'should_export_transaction', 'true', true)
      .querySelector('input').setAttribute('data-transaction-id', id);

    // Add toggles identifying transaction type
    const colToggle = appendHtmlElement('div', row, 'col-auto');
    const togglesWrap = appendHtmlElement('div', colToggle, 'btn-group-vertical btn-group-sm btn-group-toggle');
    this.TRANSACTION_TYPES.forEach((type) => (
      addToggleBtn(togglesWrap, 'transaction_type', type, tr.type === type, id)
        .querySelector('input').setAttribute('data-transaction-id', id)
    ));
  }

  renderTransactionDetails(tr, id) {
    const { form, colAmount, colSelects, colDescription } = this.transactionRows[id];
    // Clear existing HTML
    colAmount.innerHTML = '';
    colSelects.innerHTML = '';
    colDescription.innerHTML = '';
    // Update data-type (needed to detect type changes)
    form.setAttribute('data-transaction-type', tr.type);

    // Date
    appendHtmlElement('input', colAmount, '', { type: 'hidden', name: 'transaction_date', value: tr.date });
    // Description
    addTextAraFormGroup(colDescription, 'transaction_description', tr.description);
    // Category
    addCategoriesSelect(colSelects, 'transaction_category', tr.category, tr.type === 'transfer' ? 'd-none' : '');

    if (tr.type === "expense" || tr.type === "income") {
      this.renderRegularTransaction(tr, colAmount, colSelects);
    } else if (tr.type === 'transfer') {
      this.renderTransfer(tr, colAmount, colSelects);
    }
  }

  renderRegularTransaction(tr, colAmount, colSelects) {
    // Amount
    addTextFromGroup(colAmount, 'transaction_amount', tr.amount, 'hm-amount');
    // Account
    addAccountsSelect(colSelects, 'transaction_account', tr.accountInfo);
  }

  renderTransfer(tr, colAmount, colSelects) {
    // Amounts
    addTextFromGroup(colAmount, 'transaction_amount_from', tr.amount);
    addTextFromGroup(colAmount, 'transaction_amount_to', tr.amount);
    // Accounts
    addAccountsSelect(colSelects, 'transaction_account_from', tr.accountInfo.fromId);
    addAccountsSelect(colSelects, 'transaction_account_to', tr.accountInfo.toId);
  }

  getTransactionDetails(form, typeOverride = null) {
    const formData = new FormData(form);
    const type = typeOverride || formData.get('transaction_type');
    const amount = type === 'transfer' ?
      // TODO: add 'transaction_amount_to'
      formData.get('transaction_amount_from') :
      formData.get('transaction_amount');

    const accountInfo = type === 'transfer' ?
      {
        fromId: formData.get('transaction_account_from'),
        toId: formData.get('transaction_account_to')
      } : formData.get('transaction_account');

    return {
      accountInfo,
      amount,
      category: formData.get('transaction_category'),
      date: formData.get('transaction_date'),
      description: formData.get('transaction_description'),
      type
    };
  }

  convertTransactionToType(transaction, type) {
    if (transaction.type === type) return transaction;
    if (type === 'transfer') {
      // income/expense => transfer
      return { ...transaction, type: 'transfer', accountInfo: { fromId: transaction.accountInfo } };
    } else if (transaction.type === 'transfer') {
      // transfer => income/expense
      return { ...transaction, type, accountInfo: transaction.accountInfo.fromId };
    } else {
      // income => expense / expense => income
      return { ...transaction, type };
    }
  }

  // [Math.abs(amount), desc].join(' ')
  // exportTransaction(this.transactions, 0);
  exportTransaction(transactions, i) {
    const tr = transactions[i];
    if (!tr) return null;
    return createTransaction(token, tr.type, new Date(tr.date), tr.amount, tr.accountInfo, tr.description, tr.category)
      .then(() => {
        // TODO: Display success
      })
      .catch((e) => {
        // TODO: Display error
        console.warn(e);
      });
  }
}

new HmUploader();
