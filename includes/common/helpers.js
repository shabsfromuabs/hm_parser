function appendHtmlElement(name, target, className = '', props = {}, styles = {}) {
  const element = document.createElement(name);
  element.className = className;
  Object.entries(props).forEach((prop) => {
    element[prop[0]] = prop[1];
  });
  Object.entries(styles).forEach((style) => {
    element.style[style[0]] = style[1];
  });
  target.appendChild(element);
  return element;
};

function sortBy(obj, key) {
  return obj.sort((a, b) => {
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0;
  });
};

function capitalize(str) { return str.substring(0, 1).toUpperCase() + str.substring(1) };

function zeroPaddedNumber(int) { return (int < 10 ? `0${int}` : int.toString()) };
