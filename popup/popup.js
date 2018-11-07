class Popup {
  constructor() {
    this.initializeButton = document.querySelector('#initialize');
    this.credentialsForm = document.querySelector('#credentials-form');
    this.lastTransactions = {};
    this.loadLastTransactions();
    this.loadCredentials();
    this.addContentScripts();
    this.addEventListeners();
  }

  // lastTransactions is a object with dates of last transactions saved to HM like:
  // { ukrsib: 12345667, alfa: 823423412 }
  // Where key is a banking alias, and value is a date of last transaction added (date.getTime())
  loadLastTransactions() {
    chrome.storage.sync.get('lastTransactions', (result) => {
      console.log('lastTransactions loaded', result.lastTransactions);
      this.lastTransactions = result.lastTransactions;
    });
  }

  // Loads email and password of HM account and sets to from fields
  loadCredentials() {
    chrome.storage.sync.get('credentials', (result) => {
      console.log('credentials loaded', result.credentials);
      const credentials = result.credentials || {};
      this.credentialsForm.querySelector('input[name="email"]').value = credentials.email || null;
      this.credentialsForm.querySelector('input[name="password"]').value = credentials.password || null;
    });
  }

  // Add proper content script to currently open page
  addContentScripts() {
    console.log('ADDsript');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.url && currentTab.url.startsWith('https://online.ukrsibbank.com/ibank')) {
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/ukrsibParser.js' });
        this.initializeButton.innerText = 'Initialize parser';
      } else if (currentTab.url && currentTab.url.startsWith('https://app.hmbee.ru/app')) {
        chrome.tabs.executeScript(tabs[0].id, { file: 'includes/hm.js' });
        this.initializeButton.innerText = 'Initialize uploader';
        console.log('ADDEDsript');
      }
      // Add styling
      chrome.tabs.insertCSS(tabs[0].id, { file: 'includes/styles.css' });
    });
  }

  addEventListeners() {
    // Send "initialize" command to content script on page
    this.initializeButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { command: 'initialize', lastTransactions: this.lastTransactions });
      });
    });

    // Save credentials on form submit
    this.credentialsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(this.credentialsForm);
      chrome.storage.sync.set({ 'credentials': {
          email: data.get('email'), password: data.get('password') }
      });
    });
  }
}

new Popup();
