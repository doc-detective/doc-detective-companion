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
import HandymanIcon from '@mui/icons-material/Handyman';

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
        <Toolbar variant="dense">
          <Typography variant="h6" style={{flexGrow: 1}}>Doc Detective</Typography>
          <IconButton color="inherit" style={{margin: "auto"}} edge="end" aria-label="settings">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Tabs value={mode} disableGutters onChange={handleModeChange} aria-label="Mode" centered>
        <Tab value="search" style={{flexGrow: 1, maxWidth: '50%'}} icon={<SearchIcon />} label="Search" />
        <Tab value="build" style={{flexGrow: 1, maxWidth: '50%'}} icon={<HandymanIcon />} label="Build" />
      </Tabs>

      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Output: {output}
      </Typography>
    </Box>
  );
}

export default App;
