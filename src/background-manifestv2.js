var browser = require("webextension-polyfill");

// On extension button click (Firefox - Manifest v2)
browser.browserAction.onClicked.addListener((tab) => insertDialog(tab));

// On message received
browser.runtime.onMessage.addListener(function (message) {
  switch (message.action) {
    case "openOptionsPage":
      openOptionsPage();
      break;
    default:
      break;
  }
});

// Open options page
function openOptionsPage() {
  browser.runtime.openOptionsPage();
}

// Set default options
async function setDefaultOptions() {
  let options = await browser.storage.sync.get("customOptions");
  if (options.customOptions !== "true") {
    browser.storage.sync.set({
      defaultBehaviorIDs: "true",
      defaultBehaviorClasses: "true",
      defaultBehaviorTags: "true",
      defaultBehaviorAttributes: "false",
      allowedIDs: "",
      allowedClasses: "",
      allowedTags: "",
      allowedAttributes: "",
      disallowedIDs: "",
      disallowedClasses: "",
      disallowedTags: "",
      disallowedAttributes: "",
      modeAllowedIDs: "exact",
      modeAllowedClasses: "exact",
      modeAllowedTags: "exact",
      modeAllowedAttributes: "exact",
      modeDisallowedIDs: "exact",
      modeDisallowedClasses: "exact",
      modeDisallowedTags: "exact",
      modeDisallowedAttributes: "exact"
    });
  }
}

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