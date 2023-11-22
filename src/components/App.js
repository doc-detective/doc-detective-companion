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
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [mode, setMode] = useState("search");
  const [output, setOutput] = useState("");

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setOutput(newMode === "search" ? "CSS Selector" : "Array");
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Doc Detective Companion</Typography>
          <IconButton color="inherit" edge="end" aria-label="settings">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Tabs value={mode} onChange={handleModeChange} aria-label="Mode" centered>
        <Tab value="search" icon={<SearchIcon />} label="Search" />
        <Tab value="record" icon={<PlayCircleIcon />} label="Record" />
      </Tabs>

      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Output: {output}
      </Typography>
    </Box>
  );
}

export default App;
