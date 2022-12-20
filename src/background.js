var browser = require("webextension-polyfill");

// On extension button click
browser.browserAction.onClicked.addListener(function (tab) {
  // Inject dialog CSS
  browser.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ['dialog.css']
  });
  // Create or remove dialog
  browser.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['dialog.js']
  });
})