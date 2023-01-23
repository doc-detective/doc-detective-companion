var browser = require("webextension-polyfill");

const dialogBody = `
<div class="heading">
    <p>Doc Detective Companion</p>
    <button class="settings">
        <svg viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
    </button>
</div>
<div id="selector" class="code">
    <p id="selectorDisplay">
    </p>
    <button class="copy">
        <svg viewBox="0 0 24 24">
            <path fill="currentColor"
                d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
        </svg>
    </button>
</div>
<div id="storage" style="display:none;">
</div>`;

async function toggleDisplay() {
  // Identify if doc-detective dialog exists
  let dialog = document.getElementById("doc-detective");
  if (!dialog) {
    let dialog = document.createElement("div");
    dialog.id = "doc-detective";
    dialog.innerHTML = dialogBody;
    document.body.appendChild(dialog);
    let storage = document.getElementById("storage");
    let storageSync = await loadStorage();
    console.log(storageSync);
    storage.innerHTML = JSON.stringify(storageSync);
    const copyButtons = document.querySelectorAll("#doc-detective .copy");
    for (const button of copyButtons) {
      button.addEventListener("click", () => { copySelector(); })
    }
    const settingsButton = document.querySelector("#doc-detective .settings");
    settingsButton.addEventListener("click", () => { openOptions(); })
  } else {
    // If exists, remove it
    dialog.remove();
  }
}

async function loadStorage() {
  let storage = await browser.storage.sync.get(
    [
      "defaultBehaviorIDs",
      "defaultBehaviorClasses",
      "defaultBehaviorTags",
      "defaultBehaviorAttributes",
      "allowedIDs",
      "allowedClasses",
      "allowedTags",
      "allowedAttributes",
      "disallowedIDs",
      "disallowedClasses",
      "disallowedTags",
      "disallowedAttributes",
      "modeAllowedIDs",
      "modeAllowedClasses",
      "modeAllowedTags",
      "modeAllowedAttributes",
      "modeDisallowedIDs",
      "modeDisallowedClasses",
      "modeDisallowedTags",
      "modeDisallowedAttributes",
      "customSettings"
    ]
  );
  storage.defaultBehaviorIDs = (storage.defaultBehaviorIDs === "true") ? true : false;
  storage.defaultBehaviorClasses = (storage.defaultBehaviorClasses === "true") ? true : false;
  storage.defaultBehaviorTags = (storage.defaultBehaviorTags === "true") ? true : false;
  storage.defaultBehaviorAttributes = (storage.defaultBehaviorAttributes === "true") ? true : false;
  storage.allowedIDs = splitAndTrim(storage.allowedIDs);
  storage.allowedClasses = splitAndTrim(storage.allowedClasses);
  storage.allowedTags = splitAndTrim(storage.allowedTags);
  storage.allowedAttributes = splitAndTrim(storage.allowedAttributes);
  storage.disallowedIDs = splitAndTrim(storage.disallowedIDs);
  storage.disallowedClasses = splitAndTrim(storage.disallowedClasses);
  storage.disallowedTags = splitAndTrim(storage.disallowedTags);
  storage.disallowedAttributes = splitAndTrim(storage.disallowedAttributes);
  return storage;
}

function splitAndTrim(string) {
  if (!string) return [];
  let result = string.split(",").map(element => element.trim()).filter(element => element !== '');
  return result;
}

function openOptions() {
  browser.runtime.sendMessage({
    "action": "openOptionsPage"});
}

function copySelector() {
  const selectorDisplay = document.getElementById("selectorDisplay");
  copyText = selectorDisplay.innerText;
  navigator.clipboard.writeText(copyText);
  console.log("Copied the text: " + copyText);
}

toggleDisplay();
