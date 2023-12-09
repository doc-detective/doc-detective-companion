import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
var browser = require("webextension-polyfill");

// Listen for messages from background service worker
browser.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "togglePanel":
      togglePanel();
      break;
    default:
      break;
  }
});

// Get current visible state from background service worker
browser.runtime.sendMessage({ action: "getState" }).then((response) => {
  console.log({background_response: response })
  if (response.visible) togglePanel();
});

function togglePanel() {
  const id = "doc-detective";
  const width = 350;
  let panel = document.getElementById(id);
  if (panel) {
    panel.remove();
    const margin = document.body.style.marginRight.replace("px", "");
    document.body.style.marginRight = margin ? `${margin - width}px` : "0px";
  } else {
    panel = document.createElement("div");
    panel.id = id;
    panel.style = `revert: all; position: fixed; z-index: 1000; top: 0; right: 0; width: ${width}px; height: 100vh; overflow-y: auto; background-color: white; box-shadow: 2px 0 5px rgba(0,0,0,0.5);`;
    document.body.appendChild(panel);
    const margin = document.body.style.marginRight.replace("px", "");
    document.body.style.marginRight = margin ? `${margin + width}px` : `${width}px`;
    ReactDOM.render(<App />, panel);
  }
}


