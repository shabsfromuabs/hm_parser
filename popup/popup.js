class Popup {
  constructor() {
    this.initializeButton = document.querySelector("#initialize");
    this.parseButton = document.querySelector("#parse");
    this.openHmButton = document.querySelector("#open-hm");
    this.credentialsForm = document.querySelector("#credentials-form");
    this.setUiElements();
    this.addEventListeners();
  }

  async getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  // Set button text and shows/hides UI elements
  async setUiElements() {
    let currentTab = await this.getCurrentTab();

    if (currentTab.url?.startsWith("https://app.hmbee.ru/app")) {
      this.initializeButton.innerText = "Initialize uploader";
      this.parseButton.classList.add("d-none");
      this.openHmButton.classList.add("d-none");
      this.credentialsForm.classList.remove("d-none");
      this.loadCredentials();
    }
  }

  async addEventListeners() {
    // Includes scripts on the page
    this.initializeButton.addEventListener("click", () =>
      this.addContentScripts()
    );

    let currentTab = await this.getCurrentTab();

    // Send "parse" command to content script on page
    this.parseButton.addEventListener("click", () => {
      chrome.tabs.sendMessage(currentTab.id, { command: "parse" });
    });

    // Save credentials on form submit
    this.credentialsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(this.credentialsForm);
      chrome.storage.local.set({
        credentials: {
          email: data.get("email"),
          password: data.get("password"),
        },
      });
    });
  }

  // Loads email and password of HM account and sets to from fields
  loadCredentials() {
    chrome.storage.local.get("credentials", (result) => {
      const credentials = result.credentials || {};
      this.credentialsForm.querySelector('input[name="email"]').value =
        credentials.email || null;
      this.credentialsForm.querySelector('input[name="password"]').value =
        credentials.password || null;
    });
  }

  // Add proper content script to currently open page
  async addContentScripts() {
    const currentTab = await this.getCurrentTab();
    const target = { tabId: currentTab.id };

    chrome.scripting.executeScript({
      target,
      files: [
        "includes/common/helpers.js",
        "includes/common/accounts.js",
        "includes/common/categories.js",
      ],
    });

    if (currentTab.url?.startsWith("https://online.ukrsibbank.com/ibank")) {
      const files = [
        "includes/parser/ukrsibParser.js",
        "includes/parser/parse.js",
      ];
      chrome.scripting.executeScript({ target, files });
    } else if (currentTab.url?.startsWith("https://my.alfabank.com.ua")) {
      const files = [
        "includes/parser/alfaParser.js",
        "includes/parser/parse.js",
      ];
      chrome.scripting.executeScript({ target, files });
    } else if (currentTab.url?.startsWith("https://wise.com/balances/")) {
      const files = [
        "includes/parser/wiseParser.js",
        "includes/parser/parse.js",
      ];
      chrome.scripting.executeScript({ target, files });
    } else if (currentTab.url?.startsWith("https://www.bankmillennium.pl/")) {
      const files = [
        "includes/parser/millenniumParser.js",
        "includes/parser/parse.js",
      ];
      chrome.scripting.executeScript({ target, files });
    } else if (currentTab.url?.startsWith("https://app.hmbee.ru/app")) {
      const files = [
        "includes/hm/autocompleter.js",
        "includes/hm/uiHelpers.js",
        "includes/hm/helpers.js",
        "includes/hm/hm.js",
      ];
      chrome.scripting.executeScript({ target, files });
      // Add styling
      chrome.scripting.insertCSS({ target, files: ["includes/hm/styles.css"] });
    }
  }
}

new Popup();
