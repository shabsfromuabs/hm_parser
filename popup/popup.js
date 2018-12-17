class Popup {
  constructor() {
    this.initializeButton = document.querySelector('#initialize');
    this.credentialsForm = document.querySelector('#credentials-form');
    this.loadCredentials();
    this.addContentScripts();
    this.addEventListeners();
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.tabs.executeScript(currentTab.id, { file: 'shared/helpers.js' });
      chrome.tabs.executeScript(currentTab.id, { file: 'shared/accounts.js' });
      chrome.tabs.executeScript(currentTab.id, { file: 'shared/categories.js' });

      if (currentTab.url && currentTab.url.startsWith('https://online.ukrsibbank.com/ibank')) {
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/parserHelpers.js' });
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/ukrsibParser.js' });
        this.initializeButton.innerText = 'Initialize parser';
      } else if (currentTab.url && currentTab.url.startsWith('https://my.alfabank.com.ua')) {
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/parserHelpers.js' });
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/alfaParser.js' });
        this.initializeButton.innerText = 'Initialize parser';
      } else if (currentTab.url && currentTab.url.startsWith('https://app.hmbee.ru/app')) {
        chrome.tabs.executeScript(tabs[0].id, { file: 'includes/hm.js' });
        this.initializeButton.innerText = 'Initialize uploader';
      }
      // Add styling
      chrome.tabs.insertCSS(tabs[0].id, { file: 'includes/styles.css' });
    });
  }

  addEventListeners() {
    // Send "initialize" command to content script on page
    this.initializeButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { command: 'initialize' });
      });
    });

    // Save credentials on form submit
    this.credentialsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(this.credentialsForm);
      chrome.storage.sync.set({ credentials: {
        email: data.get('email'), password: data.get('password') }
      });
    });
  }
}

new Popup();
