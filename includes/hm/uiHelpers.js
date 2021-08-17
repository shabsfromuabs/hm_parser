const addTextFromGroup = (target, name, value, className = '') => {
  const formGroup = appendHtmlElement('div', target, `form-group ${className}`);
  appendHtmlElement('input', formGroup, 'form-control', { type: 'text', name, value });
  return formGroup;
};

const addTextAraFormGroup = (target, name, value, className = '') => {
  const formGroup = appendHtmlElement('div', target, `form-group ${className}`);
  appendHtmlElement('textarea', formGroup, 'form-control', { name, rows: 3, value });
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

const addCheckbox = (target, name, value, checked) => {
  const label = appendHtmlElement('label', target, `ui-checkbox${checked ? ' checked' : ''}`, { innerText: value });
  appendHtmlElement('input', label, '', { type: 'checkbox', name, value, checked });
  return label;
};

const addToggleBtn = (target, name, value, checked, btnText) => {
  const label = appendHtmlElement('label', target, `btn btn-secondary${checked ? ' active' : ''}`, { innerText: btnText });
  appendHtmlElement('input', label, '', { type: 'radio', name, value, checked });
  return label;
};

const addAccountsSelect = (target, name, selectedId, className = '') => {
  const options = [{ name: '', value: '' }, ...getAccounts()].map((acc) =>
    ({ text: acc.name, value: acc.id })
  );
  return addSelectFormGroup(target, options, name, selectedId, className);
};

const addCategoriesSelect = (target, name, selectedValue, className = '', categories) => {
  // const categories = getCategories();
  const formGroup = addTextFromGroup(target, name, selectedValue, className);
  const input = formGroup.querySelector('input');

  autocomplete({
    input: input,
    minLength: 0,
    fetch(text, update) {
      const regex = new RegExp(text, 'i');
      var suggestions = categories.filter(cat => cat.match(regex));
      update(suggestions);
    },
    render(item) {
      var div = document.createElement('div');
      div.innerText = item;
      return div;
    },
    onSelect(item) {
      input.value = item;
    }
  });
  return formGroup;
};
