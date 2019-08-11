class HmUploader {
  TRANSACTION_TYPES = ['expense', 'income', 'transfer'];
  TRANSACTION_TYPE_TRANSLATES = { expense: 'Розхід', income: 'Дохід', transfer: 'Переказ' };

  constructor() {
    this.wrapper = document.querySelector('#app');
    // Transaction objects loaded from chrome storage
    this.transactions = [];
    // HTML elements associated with each transaction (key = index of transaction, value = hash of HTML elements):
    // { 0: { form: Form, colControls: Div, colAmount: Div, colSelects: Div, colDescription: Div }, ... }
    this.transactionRows = {};

    this.preparePage();
    this.setToken();
    this.setTransactions();

    this.onTransactionTypeChange = this.onTransactionTypeChange.bind(this);
    this.onShouldExportTransactionChanged = this.onShouldExportTransactionChanged.bind(this);
  }

  preparePage() {
    this.wrapper.innerHTML = '';
    appendHtmlElement('link', document.head, '', {
      rel: 'stylesheet',
      href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
    });
    this.container = appendHtmlElement('div', this.wrapper, 'container transactions-container');
  }

  setToken() {
    chrome.storage.local.get('credentials', (result) => {
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
    chrome.storage.local.get('parsedTransactions', (result) => {
      this.transactions = sortBy(result.parsedTransactions, 'date');
      console.log('transactions', this.transactions);
      this.renderTransactions();
      this.addExportBtn();
    });
  }

  renderTransactions() {
    // Index of transaction within 1 day
    let j = 0;

    this.transactions.forEach((tr, i) => {
      // Append date header before first transaction in a list and before first transaction in the day
      if (i === 0 || tr.date !== this.transactions[i - 1].date) {
        this.addDateRow(new Date(tr.date));
        j = 0;
      }

      const rowClass = `row transaction-row ${j % 2 === 0 ? 'even' : 'odd'}`;
      const form = appendHtmlElement('form', this.container, rowClass, { id: `transaction-row-${i}` });

      const colControls = appendHtmlElement('div', form, 'col-2');
      const colAmount = appendHtmlElement('div', form, 'col-2');
      const colSelects = appendHtmlElement('div', form, 'col-4');
      const colDescription = appendHtmlElement('div', form, 'col-4');
      this.transactionRows[i] = { form, colControls, colAmount, colSelects, colDescription };

      this.renderTransactionControls(tr, i);
      this.renderTransactionDetails(tr, i);
      j++;
    });
  }

  addExportBtn() {
    const row = appendHtmlElement('div', this.container, 'row');
    const col = appendHtmlElement('div', row, 'col text-right');
    const exportBtn = appendHtmlElement('button', col, 'btn btn-success btn-lg', { innerText: 'Експортувати' });
    exportBtn.addEventListener('click', () => {
      this.transactions = Object.keys(this.transactionRows).map((id) => (
        this.getTransactionDetails(id)
      )).filter((el) => el != null);
      console.log(this.transactions);
      this.exportTransaction(0);
    }, false);
  }

  // Private

  addDateRow(date) {
    const dateRow = appendHtmlElement('div', this.container, 'row hm-date');
    dateRow.innerText = [date.getDate(), zeroPaddedNumber(date.getMonth() + 1), date.getFullYear()].join('.');
    return dateRow;
  }

  renderTransactionControls(tr, id) {
    const { colControls } = this.transactionRows[id];
    // Clear existing HTML
    colControls.innerHTML = '';
    const row = appendHtmlElement('div', colControls, 'row');

    // Add checkbox control identifying that transaction should be exported to HM
    const colCheckbox = appendHtmlElement('div', row, 'col-auto');
    const checkbox = addCheckbox(colCheckbox, 'should_export_transaction', 'true', true)
      .querySelector('input');
    checkbox.setAttribute('data-transaction-id', id);
    checkbox.addEventListener('change', this.onShouldExportTransactionChanged, false);

    // Add toggles identifying transaction type
    const colToggle = appendHtmlElement('div', row, 'col-auto');
    const togglesWrap = appendHtmlElement('div', colToggle, 'btn-group-vertical btn-group-sm btn-group-toggle');
    this.TRANSACTION_TYPES.forEach((type) => {
      const radioBtn = addToggleBtn(togglesWrap, 'transaction_type', type, tr.type === type, this.TRANSACTION_TYPE_TRANSLATES[type])
        .querySelector('input');
      radioBtn.setAttribute('data-transaction-id', id);
      radioBtn.addEventListener('change', this.onTransactionTypeChange, false);
    });
  }

  onShouldExportTransactionChanged(e) {
    const transactionId = e.target.getAttribute('data-transaction-id');
    const { form } = this.transactionRows[transactionId];

    // Apply changed checkbox value to UI
    e.target.parentElement.classList[e.target.checked ? 'add' : 'remove']('checked');

    // Enable/Disable all inputs in the row
    form.querySelectorAll('input[type="text"], input[type="radio"], select, textarea').forEach((element) => (
      e.target.checked ? element.removeAttribute('disabled') : element.setAttribute('disabled', true)
    ));
  }

  onTransactionTypeChange(e) {
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
    const transaction = this.getTransactionDetails(transactionId, prevTransactionType);
    this.renderTransactionDetails(this.convertTransactionToType(transaction, newTransactionType), transactionId);
  }

  renderTransactionDetails(tr, id) {
    const { form, colAmount, colSelects, colDescription } = this.transactionRows[id];
    // Clear existing HTML
    colAmount.innerHTML = '';
    colSelects.innerHTML = '';
    colDescription.innerHTML = '';
    // Update data-type (needed to detect type changes)
    form.setAttribute('data-transaction-type', tr.type);

    const isTransfer = tr.type === 'transfer';
    // Date
    appendHtmlElement('input', colAmount, '', { type: 'hidden', name: 'transaction_date', value: tr.date });
    // Amount
    addTextFromGroup(colAmount, 'transaction_amount', tr.amount, `hm-amount ${isTransfer ? 'd-none' : ''}`);
    addTextFromGroup(colAmount, 'transaction_amount_from', tr.fromAmount, isTransfer ? '' : 'd-none');
    addTextFromGroup(colAmount, 'transaction_amount_to', tr.toAmount, isTransfer ? '' : 'd-none');
    // Account
    addAccountsSelect(colSelects, 'transaction_account', tr.accountId || tr.fromAccountId, isTransfer ? 'd-none' : '');
    addAccountsSelect(colSelects, 'transaction_account_from', tr.fromAccountId || tr.accountId, !isTransfer ? 'd-none' : '');
    addAccountsSelect(colSelects, 'transaction_account_to', tr.toAccountId || tr.accountId, !isTransfer ? 'd-none' : '');
    // Category
    addCategoriesSelect(colSelects, 'transaction_category', tr.category || '', isTransfer ? 'd-none' : '');
    // Description
    const formGroup = addTextAraFormGroup(colDescription, 'transaction_description', tr.description, 'hm-description');
    formGroup.children[0].setAttribute('title', tr.originalDescription || '');
  }

  getTransactionDetails(id, typeOverride = null) {
    const form = this.transactionRows[id].form;
    const shouldExport = form.querySelector('input[name="should_export_transaction"]').checked;
    if (!shouldExport) return null;
    const formData = new FormData(form);
    const date = formData.get('transaction_date');
    const type = typeOverride || formData.get('transaction_type');
    const amount = formData.get('transaction_amount');
    const fromAmount = formData.get('transaction_amount_from');
    const toAmount = formData.get('transaction_amount_to');
    const accountId = formData.get('transaction_account');
    const fromAccountId = formData.get('transaction_account_from');
    const toAccountId = formData.get('transaction_account_to');
    const category = formData.get('transaction_category');
    const description = formData.get('transaction_description');

    const transaction = {
      type,
      date: parseInt(date || Date.now()),
      category,
      description
    };
    if (type === 'transfer') {
      return {
        ...transaction,
        fromAmount: fromAmount ? parseFloat(fromAmount) : 0,
        toAmount: toAmount ? parseFloat(toAmount) : 0,
        fromAccountId: fromAccountId ? parseInt(fromAccountId) : undefined,
        toAccountId: toAccountId ? parseInt(toAccountId) : undefined
      }
    } else {
      return {
        ...transaction,
        amount: amount ? parseFloat(amount) : 0,
        accountId: accountId ? parseInt(accountId) : undefined
      }
    }
  }

  convertTransactionToType(transaction, type) {
    if (transaction.type === type) return transaction;
    const { amount } = transaction;
    if (type === 'expense') {
      return { ...transaction, type, amount: -1 * Math.abs(amount) };
    }
    return { ...transaction, type, amount: Math.abs(amount) }
  }

  exportTransaction(i) {
    const tr = this.transactions[i];

    if (!tr) return null;
    const { form } = this.transactionRows[i];
    const {
      type,
      date,
      amount,
      fromAmount,
      toAmount,
      accountId,
      fromAccountId,
      toAccountId,
      category,
      description
    } = tr;
    return createTransaction({
      token: this.token,
      type,
      date: new Date(date),
      amount,
      fromAmount,
      toAmount,
      accountId,
      fromAccountId,
      toAccountId,
      category,
      description
    })
      .then(() => {
        form.classList.remove('error');
        form.classList.add('success');
        this.exportTransaction(i + 1);
      })
      .catch((e) => {
        form.classList.remove('success');
        form.classList.add('error');
        console.warn(e);
      });
  }
}

new HmUploader();
