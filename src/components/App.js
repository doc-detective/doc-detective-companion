var browser = require("webextension-polyfill");
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { finder } from "@medv/finder";
import SearchIcon from "@mui/icons-material/Search";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import HandymanIcon from "@mui/icons-material/Handyman";
import ClearIcon from "@mui/icons-material/Clear";
import Block from "./Block.js";

const resetStyles = {
  revert: "all",
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
  const [active, setActive] = useState(false);
  const [storage, setStorage] = useState(null);
  const [selector, setSelector] = useState("");
  const [events, setEvents] = useState([]);
  const [buildMode, setBuildMode] = useState("events");
  const [test, setTest] = useState({});

  const listenerEvents = [
    { type: "click" },
    { type: "keypress" },
  ];

  // Add/remove event listeners
  useEffect(() => {
    const cleanup = () => {
      listenerEvents.forEach((event) => {
        document.removeEventListener(event.type, processEvent);
      });
    };

    if (active) {
      listenerEvents.forEach((event) => {
        document.addEventListener(event.type, processEvent);
      });
    }

    return cleanup;
  }, [mode, active, events]);

  // Run once on load
  useEffect(async () => {
    // Load storage
    const fetchData = async () => {
      const result = await loadStorage();
      setStorage(result);
    };
    fetchData();
    // Get initial state
    await browser.runtime.sendMessage({ action: "getState" }).then((response) => {
      if (response) {
        setEvents(response.events);
        setMode(response.mode);
        setActive(response.active);
        setBuildMode(response.buildMode);
      }
    });
    return () => {
      listenerEvents.forEach((event) => {
        document.removeEventListener(event.type, processEvent);
      });
    };
  }, []);

  // Update state in background service worker
  useEffect(() => {
    const state = { mode, events, active, buildMode, visible: true };
    // console.log(state);
    browser.runtime.sendMessage({ action: "setState", state });
  }, [events, mode, active, buildMode]);

  // Update test
  useEffect(() => {
    if (buildMode === "test") {
      let newTest = {
        tests: [
          {
            steps: [],
          },
        ],
        // Minimal DD test format
      };
      events.forEach((event, index) => {
        let step = {};
        if (event.type === "click") {
          // Find action with click = true
          step.action = "find";
          step.selector = event.target;
          step.click = true;
        } else if (event.type === "keypress") {
          if (index >= 1 && event.target === events[index - 1].target) {
            // If target matches previous target, add keypress to existing action
            const previousKeys =
              newTest.tests[0].steps[newTest.tests[0].steps.length - 1].keys;
            newTest.tests[0].steps[newTest.tests[0].steps.length - 1].keys =
              previousKeys ? previousKeys + event.key : event.key;
            return
          } else {
            // If target does not match previous target
            // If target exists, find action. If not, typeKeys action.
            step.action = event.target ? "find" : "typeKeys";
            if (event.target) step.selector = event.target;
            step.keys = event.key;
          }
        } else if (event.type === "DOMContentLoaded") {
          // Add url to test
          step.action = "goTo";
          step.url = event.url;
        }
        newTest.tests[0].steps.push(step);
      });
      setTest(newTest);
    }
  }, [events, buildMode]);

  // Debug
  // useEffect(() => {
  //   console.log(storage);
  // }, [storage]);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const closePanel = () => {
    const id = "doc-detective";
    const width = 350;
    let panel = document.getElementById(id);
    const margin = document.body.style.marginRight.replace("px", "");
    document.body.style.marginRight = margin ? `${margin - width}px` : "0px";
    document.removeEventListener("click", processEvent);
    const state = { visible: false }
    browser.runtime.sendMessage({ action: "setState", state });
    panel.remove();
  };

  const processEvent = (event) => {
    //  console.log(event);
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
    let foundSelector;
    try {
      foundSelector = event.target ? finder(event.target, options) : "body";
    } catch {
      foundSelector = "body";
    }
    // Loop to identify if foundSelector is part of main page
    let inDialog = false;
    let elements = [];
    elements[0] = document.querySelector(foundSelector);
    //  console.log(elements);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let elementName = element?.nodeName.toLowerCase();
      if (elementName === "body" || elementName === "html") continue;
      let parent = element.parentElement;
      let parentName = parent?.nodeName.toLowerCase();
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
    if (mode === "search" && event.type === "click") {
      event.stopPropagation();
      event.preventDefault();
      setSelector(foundSelector);
    } else if (mode === "build") {
      // Build event
      const newEvent = {
        type: event.type,
      };
      if (event.type === "click") {
        newEvent.target = foundSelector;
        newEvent.x = event.x;
        newEvent.y = event.y;
      } else if (event.type === "keypress") {
        if (foundSelector !== "body") newEvent.target = foundSelector;
        newEvent.key = event.key;
        newEvent.charCode = event.charCode;
        newEvent.keyCode = event.keyCode;
      }
      // Add event to events
      let newEvents = [...events];
      newEvents.push(newEvent);
      setEvents(newEvents);
    }
  };

  // Get height of header element, if present
  // TODO: Figure out why some headers overlap and some don't
  // TODO: Overlap example: https://mui.com/material-ui/react-button/#basic-button
  // TODO: No overlap example: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/get
  // const header = document.querySelector("header");
  // const headerHeight = header ? header.offsetHeight : 0;

  return (
    <div style={resetStyles}>
      <Box>
        <AppBar position="static">
          <Toolbar variant="dense" sx={{ display: "flex" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Doc Detective
            </Typography>
            <IconButton
              {...(active ? { color: "inherit" } : { color: "error" })}
              aria-label="activate"
              edge="end"
              onClick={() => setActive(!active)}
              style={{ margin: "auto" }}
            >
              <PowerSettingsNewIcon />
            </IconButton>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="settings"
              style={{ margin: "auto" }}
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
              Find the shortest CSS selector for an element.
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
            <Typography sx={{ marginTop: 2, flexGrow: 1 }}>
              Track interactions to create tests.
            </Typography>
            <ToggleButtonGroup
              value={buildMode}
              exclusive
              onChange={(event, newMode) => {
                if (newMode !== null) {
                  setBuildMode(newMode);
                }
              }}
              aria-label="Build mode"
              sx={{
                display: "flex",
                width: "100%",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <ToggleButton
                value="events"
                aria-label="Events"
                sx={{ flexGrow: 1, maxWidth: "50%" }}
              >
                Events
              </ToggleButton>
              <ToggleButton
                value="test"
                aria-label="Test"
                sx={{ flexGrow: 1, maxWidth: "50%" }}
              >
                Test
              </ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }}></div>
              <Button
                variant="outlined"
                onClick={() => setEvents([])}
                endIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Box>
            <Block
              object={buildMode === "events" ? events : test}
              options={{
                wrapLines: true,
                language: "json",
                showLineNumbers: false,
                multiline: "oneObjectPerLine",
              }}
            />
          </div>
        )}
      </Box>
    </div>
  );
}

export default App;
