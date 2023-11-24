import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import HandymanIcon from "@mui/icons-material/Handyman";
// import { openOptions } from "../utils.js";


function App() {
  const [mode, setMode] = useState("search");
  const [output, setOutput] = useState("");

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
    panel.remove();
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Doc Detective
          </Typography>
          {/* <IconButton
            color="inherit"
            style={{ margin: "auto" }}
            edge="end"
            aria-label="settings"
            onClick={openOptions}
          >
            <SettingsIcon />
          </IconButton> */}
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

      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Output: {output}
      </Typography>
    </Box>
  );
}

export default App;
