var browser = require("webextension-polyfill");

// On extension button click (Chrome - Manifest v3)
browser.action.onClicked.addListener((tab) => insertDialog(tab));

function insertDialog(tab) {
  // Inject dialog CSS
  browser.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['dialog.css']
  });
  // Create or remove dialog
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['dialog.js']
  });
}