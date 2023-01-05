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
        disallowedAttributes: document.querySelector("#disallowedAttributes").value
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
            "disallowedAttributes"
        ]
    );
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
