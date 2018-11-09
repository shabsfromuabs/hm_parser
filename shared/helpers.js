const appendHtmlElement = (name, target, props = {}, styles = {}) => {
  const element = document.createElement(name);
  Object.entries(props).forEach((prop) => {
    element[prop[0]] = prop[1];
  });
  Object.entries(styles).forEach((style) => {
    element.style[style[0]] = style[1];
  });
  target.appendChild(element);
  return element;
};

const appendParsedInfo = (container) => {
  let input;
  let select;
  let parsedInfoWrap = container.querySelector('.hm-parsed-info');

  if (!parsedInfoWrap) {
    parsedInfoWrap = appendHtmlElement('div', container, { className: 'hm-parsed-info' }, { display: 'table-cell' });
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
