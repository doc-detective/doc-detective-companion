var browser = require("webextension-polyfill");

const dialogBody = `
<div class="heading">
    <p>Doc Detective Companion</p>
    <div class="buttons">
      <button class="searchOn">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>    </button>
      <button class="searchOff" style="display:none;">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M15.5,14h-0.79l-0.28-0.27C15.41,12.59,16,11.11,16,9.5C16,5.91,13.09,3,9.5,3C6.08,3,3.28,5.64,3.03,9h2.02 C5.3,6.75,7.18,5,9.5,5C11.99,5,14,7.01,14,9.5S11.99,14,9.5,14c-0.17,0-0.33-0.03-0.5-0.05v2.02C9.17,15.99,9.33,16,9.5,16 c1.61,0,3.09-0.59,4.23-1.57L14,14.71v0.79l5,4.99L20.49,19L15.5,14z"/><polygon points="6.47,10.82 4,13.29 1.53,10.82 0.82,11.53 3.29,14 0.82,16.47 1.53,17.18 4,14.71 6.47,17.18 7.18,16.47 4.71,14 7.18,11.53"/></g></g></svg>      </button>
      <button class="recordOn">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.5,16.5v-9l7,4.5L9.5,16.5z"/></g></svg>
      </button>
      <button class="recordOff" style="display:none;">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.5,16.5v-9l7,4.5L9.5,16.5z"/></g></svg>
      </button>
      <button class="settings">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>      </button>
      <button class="close">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>
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
      button.addEventListener("click", () => {
        copySelector();
      });
    }
    const settingsButton = document.querySelector("#doc-detective .settings");
    settingsButton.addEventListener("click", () => {
      openOptions();
    });
  } else {
    // If exists, remove it
    dialog.remove();
  }
}

async function loadStorage() {
  let storage = await browser.storage.sync.get([
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
    "customSettings",
  ]);
  storage.defaultBehaviorIDs =
    storage.defaultBehaviorIDs === "true" ? true : false;
  storage.defaultBehaviorClasses =
    storage.defaultBehaviorClasses === "true" ? true : false;
  storage.defaultBehaviorTags =
    storage.defaultBehaviorTags === "true" ? true : false;
  storage.defaultBehaviorAttributes =
    storage.defaultBehaviorAttributes === "true" ? true : false;
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
  let result = string
    .split(",")
    .map((element) => element.trim())
    .filter((element) => element !== "");
  return result;
}

function openOptions() {
  browser.runtime.sendMessage({
    action: "openOptionsPage",
  });
}

function copySelector() {
  const selectorDisplay = document.getElementById("selectorDisplay");
  const copyText = selectorDisplay.innerText;
  navigator.clipboard.writeText(copyText);
  console.log("Copied the text: " + copyText);
}

toggleDisplay();
