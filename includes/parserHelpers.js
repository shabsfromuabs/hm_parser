const appendParsedInfo = (container) => {
  let input;
  let select;
  let parsedInfoWrap = container.querySelector('.hm-parsed-info');

  if (!parsedInfoWrap) {
    parsedInfoWrap = appendHtmlElement('td', container, { className: 'hm-parsed-info', colSpan: 2 }, { display: 'table-cell' });
    input = appendHtmlElement('input', parsedInfoWrap, { type: 'text', className: 'hm-description' });
    select = appendHtmlElement('select', parsedInfoWrap, { className: 'hm-category' });
    appendHtmlElement('option', select, { innerText: '' });
    getCategories().map((cat) => {
      appendHtmlElement('option', select, { innerText: cat });
    });
  } else {
    input = parsedInfoWrap.querySelector('.hm-description');
    select = parsedInfoWrap.querySelector('.hm-category');
  }

  return { input, select };
};

const markRow = (row, color) => {
  row.style.boxShadow = `15px 0px 10px -10px inset ${color}`;
};

const removeError = (row) => {
  const errorPane = row.querySelector('.hm-error');
  const warningPane = row.querySelector('.hm-warning');
  if (errorPane) errorPane.remove();
  if (warningPane) warningPane.remove();
};

const addUiPane = (row) => {
  const uiPane = row.querySelector('.hm-ui');
  if (!uiPane) {
    return appendHtmlElement('div', row, { className: 'hm-ui' }, { display: 'table-row' });
  }
  return uiPane;
};

const addCheckbox = (uiPane, checked = false) => {
  let wrapper = uiPane.querySelector('.hm-checkbox-wrap');
  if (!wrapper) {
    wrapper = appendHtmlElement('td', uiPane, { className: 'hm-checkbox-wrap' }, { display: 'table-cell' });
    appendHtmlElement('input', wrapper, { type: 'checkbox', className: 'hm-should-parse', checked });
  }
  return wrapper;
};

const markSuccess = (row, transaction) => {
  markRow(row, '#00cd8e');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, true);
  const { input, select } = appendParsedInfo(uiPane);
  input.value = transaction.description;
  select.value = transaction.category;
};

const markIgnored = (row) => {
  markRow(row, 'grey');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, false);
};

const markWarning = (row, text) => {
  markRow(row, '#eace2e');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, true);
  appendHtmlElement('div', uiPane, { innerText: text, className: 'hm-warning' }, { display: 'table-cell' });
};

const markError = (row, text) => {
  markRow(row, 'red');
  removeError(row);
  const uiPane = addUiPane(row);
  addCheckbox(uiPane, true);
  appendHtmlElement('div', uiPane, { innerText: text, className: 'hm-error' }, { display: 'table-cell' });
};
