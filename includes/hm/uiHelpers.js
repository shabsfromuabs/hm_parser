const addTextFromGroup = (target, name, value, className = '') => {
  const formGroup = appendHtmlElement('div', target, 'form-group');
  appendHtmlElement('input', formGroup, `form-control ${className}`, { type: 'text', name, value });
  return formGroup;
};

const addTextAraFormGroup = (target, name, value, className = '') => {
  const formGroup = appendHtmlElement('div', target, 'form-group');
  appendHtmlElement('textarea', formGroup, `form-control ${className}`, { name, rows: 3, value });
  return formGroup;
};

const addSelectFormGroup = (target, options, name, selectedValue, className = '') => {
  const formGroup = appendHtmlElement('div', target, `form-group ${className}`);
  const select = appendHtmlElement('select', formGroup, 'form-control', { name });
  options.map((option) => {
    if (typeof option === 'object') {
      appendHtmlElement('option', select, '', { innerText: option.text, value: option.value });
    } else {
      appendHtmlElement('option', select, '', { innerText: option, value: option });
    }
  });
  select.value = selectedValue;
  return formGroup;
};

const addPrettyCheckbox = (target, name, value, checked) => {
  const check = appendHtmlElement('div', target, 'check');
  const id = `tr-checkbox-${Math.random()}`;
  appendHtmlElement('input', check, '', { type: 'checkbox', name, value, checked, id });
  appendHtmlElement('label', check, '', { htmlFor: id, innerText: value });
  return check;
};

const addToggleBtn = (target, name, value, checked) => {
  const label = appendHtmlElement('label', target, `btn btn-secondary${checked ? ' active' : ''}`, { innerText: value });
  appendHtmlElement('input', label, '', { type: 'radio', name, value, checked });
  return label;
};

const addAccountsSelect = (target, name, selectedId, className = '') => {
  const options = [{ name: '', value: '' }, ...getAccounts()].map((acc) =>
    ({ text: acc.name, value: acc.id })
  );
  return addSelectFormGroup(target, options, name, selectedId, className);
};

const addCategoriesSelect = (target, name, selectedValue, className = '') => {
  const options = ['', ...getCategories()];
  return addSelectFormGroup(target, options, name, selectedValue, className);
};
