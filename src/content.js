var browser = require("webextension-polyfill");
import { finder } from "@medv/finder";

function assessSelector(
  selector,
  allowlist,
  allowMode,
  denylist,
  denyMode,
  defaultBehavior
) {
  let allow;
  let deny;
  let regex;
  let result;

  // console.log({ selector, allowlist, allowMode, denylist, denyMode, defaultBehavior });

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
      regex = new RegExp(denylist[item], "g");
      result = selector.match(regex);
      if (result) deny = true;
    }
  }

  if (allow) return true;
  if (deny) return false;
  return defaultBehavior;
}

browser.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "togglePanel":
      togglePanel();
      break;
    // case "getStorage":
    //   getStorage();
    //   break;
    // case "setStorage":
    //   setStorage(message.storage);
    //   break;
    default:
      break;
  }
});

function togglePanel() {
  const id = "doc-detective";
  let panel = document.getElementById(id);
  if (panel) {
    panel.remove();
    const margin = document.body.style.marginRight.replace("px", "");
    document.body.style.marginRight = margin ? `${margin - 250}px` : "0px";
  } else {
    panel = document.createElement("div");
    panel.id = id;
    panel.style = "position: fixed; top: 0; right: 0; width: 250px; height: 100vh; overflow-y: auto; background-color: white; padding: 20px; box-shadow: 2px 0 5px rgba(0,0,0,0.5);";
    document.body.appendChild(panel);
    // Run bundle.js
    var script = document.createElement("script");
    script.src = browser.runtime.getURL("bundle.js");
    script.onload = function () {
      this.remove();
    };
    const margin = document.body.style.marginRight.replace("px", "");
    document.body.style.marginRight = margin ? `${margin + 250}px` : "250px";
    (document.head || document.documentElement).appendChild(script);
  }
}

// document.addEventListener("DOMContentLoaded", function() {
//   let panel = document.createElement("div");
//   panel.id = "doc-detective";
//   panel.display = "none";
//   document.body.appendChild(panel);
//   // Run bundle.js
//   var s = document.createElement("script");
//   s.src = browser.runtime.getURL("bundle.js");
//   s.onload = function() {
//     this.remove();
//   };
//   (document.head || document.documentElement).appendChild(s);
// })

// document.addEventListener("click", async (event) => {
//   let dialog = document.getElementById("doc-detective");
//   let search = document.querySelector("#doc-detective .searchOn").style.display === "block";
//   let record = document.querySelector("#doc-detective .recordOn").style.display === "block";

//   if (dialog && search) {
//     let storage = JSON.parse(document.getElementById("storage").innerHTML);
//     // console.log(storage);
//     let options = {
//       root: document.body,
//       idName: (name) => assessSelector(name, storage.allowedIDs, storage.modeAllowedIDs, storage.disallowedIDs, storage.modeDisallowedIDs, storage.defaultBehaviorIDs),
//       className: (name) => assessSelector(name, storage.allowedClasses, storage.modeAllowedClasses, storage.disallowedClasses, storage.modeDisallowedClasses, storage.defaultBehaviorClasses),
//       tagName: (name) => assessSelector(name, storage.allowedTags, storage.modeAllowedTags, storage.disallowedTags, storage.modeDisallowedTags, storage.defaultBehaviorTags),
//       attr: (name, value) => assessSelector(name, storage.allowedAttributes, storage.modeAllowedAttributes, storage.disallowedAttributes, storage.modeDisallowedAttributes, storage.defaultBehaviorAttributes),
//       seedMinLength: 1,
//       optimizedMinLength: 2,
//       threshold: 1000,
//       maxNumberOfTries: 10_000,
//     };
//     const selector = finder(event.target, options);
//     // Loop to identify if selector is part of main page
//     let inDialog = false;
//     let elements = [];
//     elements[0] = document.querySelector(selector);
//     for (let i = 0; i < elements.length; i++) {
//       let element = elements[i];
//       let parent = element.parentElement;
//       let parentName = parent.nodeName.toLowerCase();
//       if (parentName !== "body") {
//         elements.push(parent);
//         continue;
//       }
//       if (
//         parentName === "body" &&
//         element.nodeName.toLowerCase() === "div" &&
//         element.id === "doc-detective"
//       ) {
//         inDialog = true;
//       }
//     }
//     // Exit early if click is in the dialog
//     if (inDialog) return;
//     let selectorDisplay = document.getElementById("selectorDisplay");
//     event.stopPropagation();
//     event.preventDefault();
//     selectorDisplay.innerHTML = selector;
//   }
// });
