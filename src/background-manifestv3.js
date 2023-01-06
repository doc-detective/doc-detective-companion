var browser = require("webextension-polyfill");

// On extension button click (Chrome - Manifest v3)
browser.action.onClicked.addListener((tab) => insertDialog(tab));
browser.runtime.onInstalled.addListener(setDefaultOptions());

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