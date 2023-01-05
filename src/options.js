var browser = require("webextension-polyfill");

function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        preferredID: document.querySelector("#preferredID").value,
        preferredClass: document.querySelector("#preferredClass").value,
        preferredTag: document.querySelector("#preferredTag").value,
        preferredAttribute: document.querySelector("#preferredAttribute").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#preferredID").value = result.preferredID || "";
        document.querySelector("#preferredClass").value = result.preferredClass || "";
        document.querySelector("#preferredTag").value = result.preferredTag || "";
        document.querySelector("#preferredAttribute").value = result.preferredAttribute || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get(["preferredID", "preferredClass", "preferredTag", "preferredAttribute"]);
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
