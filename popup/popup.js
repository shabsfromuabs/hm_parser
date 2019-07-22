class Popup {
  constructor() {
    this.initializeButton = document.querySelector('#initialize');
    this.parseButton = document.querySelector('#parse');
    this.openHmButton = document.querySelector('#open-hm');
    this.credentialsForm = document.querySelector('#credentials-form');
    this.loadCredentials();
    this.setUiElements();
    this.addEventListeners();
  }

  // Set button text and shows/hides UI elements
  setUiElements() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab.url && currentTab.url.startsWith('https://app.hmbee.ru/app')) {
        this.initializeButton.innerText = 'Initialize uploader';
        this.parseButton.classList.add("d-none");
        this.openHmButton.classList.add("d-none");
        this.credentialsForm.classList.remove("d-none");
        this.loadCredentials();
      }
    });
  }

  // Loads email and password of HM account and sets to from fields
  loadCredentials() {
    chrome.storage.sync.get('credentials', (result) => {
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
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/parse.js' });
      } else if (currentTab.url && currentTab.url.startsWith('https://my.alfabank.com.ua')) {
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/parserHelpers.js' });
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/alfaParser.js' });
        chrome.tabs.executeScript(currentTab.id, { file: 'includes/parse.js' });
      } else if (currentTab.url && currentTab.url.startsWith('https://app.hmbee.ru/app')) {
        chrome.tabs.executeScript(tabs[0].id, { file: 'includes/hm.js' });
        // Add styling
        chrome.tabs.insertCSS(tabs[0].id, { file: 'includes/styles.css' });
      }
    });
  }

  addEventListeners() {
    // Includes scripts on the page
    this.initializeButton.addEventListener('click', () => this.addContentScripts());

    // Send "parse" command to content script on page
    this.parseButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { command: 'parse' });
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
