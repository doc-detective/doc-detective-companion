import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { finder } from "@medv/finder";
import SearchIcon from "@mui/icons-material/Search";
// import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import HandymanIcon from "@mui/icons-material/Handyman";
import Block from "./Block.js";

const resetStyles = {
  all: "initial",
  fontFamily: "inherit",
  fontSize: "100%",
  boxSizing: "border-box",
};

// TODO: Rebuild options page in React
// TODO: Get "Search" working
// TODO: Get "Build" working`

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

// Load options from storage
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

// Split string into array and trim whitespace
function splitAndTrim(string) {
  if (!string) return [];
  let result = string
    .split(",")
    .map((element) => element.trim())
    .filter((element) => element !== "");
  return result;
}

function App() {
  const [mode, setMode] = useState("search");
  const [output, setOutput] = useState("");
  const [storage, setStorage] = useState(null);
  const [selector, setSelector] = useState("");
  const [events, setEvents] = useState([]);

  // Run once on load
  useEffect(() => {
    // Load storage
    const fetchData = async () => {
      const result = await loadStorage();
      setStorage(result);
    };
    fetchData();
    // Get initial state
    browser.runtime.sendMessage({ action: "getState" }).then((response) => {
      if (response) {
        setEvents(response.events);
        setMode(response.mode);
      }
    });
  }, []);

  // Update state in background service worker
  useEffect(() => {
    const state = { mode, events, visible: true };
    // console.log(state);
    browser.runtime.sendMessage({ action: "setState", state });
  }, [events, mode]);

  // Debug
  // useEffect(() => {
  //   console.log(storage);
  // }, [storage]);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setOutput(newMode === "search" ? "CSS Selector" : "Array");
    }
  };

  const closePanel = () => {
    const id = "doc-detective";
    const width = 350;
    let panel = document.getElementById(id);
    const margin = document.body.style.marginRight.replace("px", "");
    document.body.style.marginRight = margin ? `${margin - width}px` : "0px";
    document.removeEventListener("click", processEvent);
    panel.remove();
  };

  const processEvent = (event) => {
    console.log(event)
    const panel = document.getElementById("doc-detective");
    let options = {
      root: document.body,
      idName: (name) =>
        assessSelector(
          name,
          storage.allowedIDs,
          storage.modeAllowedIDs,
          storage.disallowedIDs,
          storage.modeDisallowedIDs,
          storage.defaultBehaviorIDs
        ),
      className: (name) =>
        assessSelector(
          name,
          storage.allowedClasses,
          storage.modeAllowedClasses,
          storage.disallowedClasses,
          storage.modeDisallowedClasses,
          storage.defaultBehaviorClasses
        ),
      tagName: (name) =>
        assessSelector(
          name,
          storage.allowedTags,
          storage.modeAllowedTags,
          storage.disallowedTags,
          storage.modeDisallowedTags,
          storage.defaultBehaviorTags
        ),
      attr: (name, value) =>
        assessSelector(
          name,
          storage.allowedAttributes,
          storage.modeAllowedAttributes,
          storage.disallowedAttributes,
          storage.modeDisallowedAttributes,
          storage.defaultBehaviorAttributes
        ),
      seedMinLength: 1,
      optimizedMinLength: 2,
      threshold: 1000,
      maxNumberOfTries: 10_000,
    };
    const foundSelector = finder(event.target, options);
    // Loop to identify if foundSelector is part of main page
    let inDialog = false;
    let elements = [];
    elements[0] = document.querySelector(foundSelector);
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
    if (mode === "search") {
      event.stopPropagation();
      event.preventDefault();
    }
    setSelector(foundSelector);

    if (mode === "build") {
      // Build event
      const newEvent = {
        type: event.type,
        target: foundSelector,
        x: event.x,
        y: event.y,
      };
      // Add event to events
      let newEvents = [...events];
      newEvents.push(newEvent);
      setEvents(newEvents);
    }
  };

  document.addEventListener("click", processEvent);

  return (
    <div style={resetStyles}>
      <Box>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Doc Detective
            </Typography>
            <IconButton
              color="inherit"
              style={{ margin: "auto" }}
              edge="end"
              aria-label="settings"
              onClick={() => {
                browser.runtime.sendMessage({
                  action: "openOptionsPage",
                });
              }}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="close"
              onClick={closePanel}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Tabs
          value={mode}
          disableGutters
          onChange={handleModeChange}
          aria-label="Mode"
          centered
        >
          <Tab
            value="search"
            style={{ flexGrow: 1, maxWidth: "50%" }}
            icon={<SearchIcon />}
            label="Search"
          />
          <Tab
            value="build"
            style={{ flexGrow: 1, maxWidth: "50%" }}
            icon={<HandymanIcon />}
            label="Build"
          />
        </Tabs>

        {mode === "search" && (
          <div>
            <Typography sx={{ marginTop: 2 }}>
              Find the shortest CSS selector for elements you click on.
            </Typography>
            <Block
              object={selector}
              options={{
                wrapLines: true,
                language: "text",
                showLineNumbers: false,
              }}
            />
          </div>
        )}
        {mode === "build" && (
          <div>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Track interactions on the page to create tests.
            </Typography>
            {events && JSON.stringify(events)}
          </div>
        )}
      </Box>
    </div>
  );
}

export default App;
