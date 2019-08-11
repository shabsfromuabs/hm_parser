// Runs in background. Can communicate with popup and included scripts

// Register to ShowPageAction on some domains
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'online.ukrsibbank.com' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'my.alfabank.com.ua' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'app.hmbee.ru' },
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// Expense/Income/Transfer
//
// subtype: "e" / "i" / "t"
// description: "10.55 Розхід" / "10.55 Дохід" / "Переказ"
//
// category: "Їжа / Магазини"
// date: "2019-08-10"
// transfer_type: "a"
// type: "unplanned"
// virtual_id: -1

// Expense/Income
//
// account_id: 19403
// currency: "uah"
// real_amount: -10.55 / 10.55

// Transfer
//
// transfer_from_id: 19403
// account_id: 19403
// real_amount: 25.65
// currency: "uah"
//
// transfer_to_id: 19417
// transfer_to_amount: 1.01
// transfer_to_currency: null // "usd"
