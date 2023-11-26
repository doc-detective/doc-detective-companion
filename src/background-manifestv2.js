var browser = require("webextension-polyfill");

// On extension install/update
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install" || details.reason == "update") {
    setDefaultOptions();
  }
});

// On extension button click (Firefox - Manifest v2)
// browser.browserAction.onClicked.addListener((tab) => insertDialog(tab));
browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id, { action: "togglePanel" });
});

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
      modeDisallowedAttributes: "exact",
    });
  }
}