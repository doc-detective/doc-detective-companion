// On extension button click
chrome.action.onClicked.addListener(function (tab) {
  // Inject dialog CSS
  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ['dialog.css']
  });
  // Create or remove dialog
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['dialog.js']
  });
})