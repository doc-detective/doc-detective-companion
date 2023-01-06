var browser = require("webextension-polyfill");

function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        defaultBehaviorIDs: document.querySelector("#defaultBehaviorIDs").value,
        defaultBehaviorClasses: document.querySelector("#defaultBehaviorClasses").value,
        defaultBehaviorTags: document.querySelector("#defaultBehaviorTags").value,
        defaultBehaviorAttributes: document.querySelector("#defaultBehaviorAttributes").value,
        allowedIDs: document.querySelector("#allowedIDs").value,
        allowedClasses: document.querySelector("#allowedClasses").value,
        allowedTags: document.querySelector("#allowedTags").value,
        allowedAttributes: document.querySelector("#allowedAttributes").value,
        disallowedIDs: document.querySelector("#disallowedIDs").value,
        disallowedClasses: document.querySelector("#disallowedClasses").value,
        disallowedTags: document.querySelector("#disallowedTags").value,
        disallowedAttributes: document.querySelector("#disallowedAttributes").value,
        modeAllowedIDs: document.querySelector("#modeAllowedIDs").value,
        modeAllowedClasses: document.querySelector("#modeAllowedClasses").value,
        modeAllowedTags: document.querySelector("#modeAllowedTags").value,
        modeAllowedAttributes: document.querySelector("#modeAllowedAttributes").value,
        modeDisallowedIDs: document.querySelector("#modeDisallowedIDs").value,
        modeDisallowedClasses: document.querySelector("#modeDisallowedClasses").value,
        modeDisallowedTags: document.querySelector("#modeDisallowedTags").value,
        modeDisallowedAttributes: document.querySelector("#modeDisallowedAttributes").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#defaultBehaviorIDs").value = result.defaultBehaviorIDs || "true";
        document.querySelector("#defaultBehaviorClasses").value = result.defaultBehaviorClasses || "true";
        document.querySelector("#defaultBehaviorTags").value = result.defaultBehaviorTags || "true";
        document.querySelector("#defaultBehaviorAttributes").value = result.defaultBehaviorAttributes || "false";
        document.querySelector("#allowedIDs").value = result.allowedIDs || "";
        document.querySelector("#allowedClasses").value = result.allowedClasses || "";
        document.querySelector("#allowedTags").value = result.allowedTags || "";
        document.querySelector("#allowedAttributes").value = result.allowedAttributes || "";
        document.querySelector("#disallowedIDs").value = result.disallowedIDs || "";
        document.querySelector("#disallowedClasses").value = result.disallowedClasses || "";
        document.querySelector("#disallowedTags").value = result.disallowedTags || "";
        document.querySelector("#disallowedAttributes").value = result.disallowedAttributes || "";
        document.querySelector("#modeAllowedIDs").value = result.allowedIDs || "exact";
        document.querySelector("#modeAllowedClasses").value = result.allowedClasses || "exact";
        document.querySelector("#modeAllowedTags").value = result.allowedTags || "exact";
        document.querySelector("#modeAllowedAttributes").value = result.allowedAttributes || "exact";
        document.querySelector("#modeDisallowedIDs").value = result.disallowedIDs || "exact";
        document.querySelector("#modeDisallowedClasses").value = result.disallowedClasses || "exact";
        document.querySelector("#modeDisallowedTags").value = result.disallowedTags || "exact";
        document.querySelector("#modeDisallowedAttributes").value = result.disallowedAttributes || "exact";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get(
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
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
