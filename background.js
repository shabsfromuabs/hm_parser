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
          pageUrl: { hostPrefix: 'wise.com' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'www.bankmillennium.pl' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'www.ipko.pl' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'app.hmbee.ru' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostPrefix: 'www.otodom.pl' },
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
