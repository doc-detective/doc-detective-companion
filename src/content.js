var browser = require("webextension-polyfill");
import { finder } from "@medv/finder";

function splitAndTrim(string) {
  if (!string) return [];
  let result = string.split(",").map(element => element.trim()).filter(element => element !== '');
  return result;
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
      "modeDisallowedAttributes"
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

function assessSelector(selector, allowlist, allowMode, denylist, denyMode, defaultBehavior) {
  let allow;
  let deny;
  let regex;
  let result;

  console.log({ selector, allowlist, allowMode, denylist, denyMode, defaultBehavior });

  if (allowMode === "exact") {
    allow = allowlist.includes(selector);
  } else if (allowMode === "regex") {
    for (const item in allowlist) {
      regex = new RegExp(allowlist[item], "g");
      result = selector.match(regex);
      if (result) allow = true;
    }
  }

  if (denyMode === "exact") {
    deny = denylist.includes(selector);
  } else if (denyMode === "regex") {
    for (const item in denylist) {
      regex = new RegExp(denylist[item],"g");
      result = selector.match(regex);
      if (result) deny = true;
    }
  }

  if (allow) return true;
  if (deny) return false;
  return defaultBehavior;
}

document.addEventListener("click", async (event) => {
  let dialog = document.getElementById("doc-detective");
  if (dialog) {
    let storage = await loadStorage();
    console.log(storage);
    let options = {
      root: document.body,
      idName: (name) => assessSelector(name, storage.allowedIDs, storage.modeAllowedIDs, storage.disallowedIDs, storage.modeDisallowedIDs, storage.defaultBehaviorIDs),
      className: (name) => assessSelector(name, storage.allowedClasses, storage.modeAllowedClasses, storage.disallowedClasses, storage.modeDisallowedClasses, storage.defaultBehaviorClasses),
      tagName: (name) => assessSelector(name, storage.allowedTags, storage.modeAllowedTags, storage.disallowedTags, storage.modeDisallowedTags, storage.defaultBehaviorTags),
      attr: (name, value) => assessSelector(name, storage.allowedAttributes, storage.modeAllowedAttributes, storage.disallowedAttributes, storage.modeDisallowedAttributes, storage.defaultBehaviorAttributes),
      seedMinLength: 1,
      optimizedMinLength: 2,
      threshold: 1000,
      maxNumberOfTries: 10_000,
    };
    const selector = finder(event.target, options);
    // Loop to identify if selector is part of main page
    let inDialog = false;
    let elements = [];
    elements[0] = document.querySelector(selector);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let parent = element.parentElement;
      let parentName = parent.nodeName.toLowerCase();
      if (parentName !== "body") {
        elements.push(parent);
        continue;
      }
      if (
        parentName === "body" &&
        element.nodeName.toLowerCase() === "div" &&
        element.id === "doc-detective"
      ) {
        inDialog = true;
      }
    }
    // Exit early if click is in the dialog
    if (inDialog) return;
    let selectorDisplay = document.getElementById("selectorDisplay");
    event.stopPropagation();
    event.preventDefault();
    selectorDisplay.innerHTML = selector;
  }
});