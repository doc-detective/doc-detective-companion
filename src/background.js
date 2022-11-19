// On extension button click
chrome.action.onClicked.addListener(function (tab) {
  // Create or remove dialog
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['display.js']
  });
  // Inject dialog CSS
  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ['dialog.css']
  });
})