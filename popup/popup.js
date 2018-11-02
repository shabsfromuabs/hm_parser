const initializeButton = document.querySelector('#initialize');
const credentialsForm = document.querySelector('#credentials-form');
let lastTransactions = {};

// Add proper content script to currently open page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab.url && currentTab.url.startsWith('https://online.ukrsibbank.com/ibank')) {
    chrome.tabs.executeScript(currentTab.id, { file: 'includes/ukrsibParser.js' });
    initializeButton.innerText = 'Initialize parser';
  } else if (currentTab.url && currentTab.url.startsWith('https://app.hmbee.ru/app')) {
    chrome.tabs.executeScript(tabs[0].id, { file: 'includes/hm.js' });
    initializeButton.innerText = 'Initialize uploader';
  }
  chrome.tabs.insertCSS(tabs[0].id, { file: 'includes/styles.css' });
});

// lastTransactions is a object with dates of last transactions saved to HM
chrome.storage.sync.get('lastTransactions', (result) => {
  console.log('lastTransactions loaded', result.lastTransactions);
  lastTransactions = result.lastTransactions;
});

// Send "initialize" command to page, which will parse page using parser on a page
initializeButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'initialize', lastTransactions: lastTransactions });
  });
});

chrome.storage.sync.get('credentials', (result) => {
  console.log('credentials loaded', result.credentials);
  const credentials = result.credentials || {};
  credentialsForm.querySelector('input[name="email"]').value = credentials.email || null;
  credentialsForm.querySelector('input[name="password"]').value = credentials.password || null;
});

credentialsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(credentialsForm);
  chrome.storage.sync.set({ 'credentials': {
    email: data.get('email'), password: data.get('password') }
  });
});
