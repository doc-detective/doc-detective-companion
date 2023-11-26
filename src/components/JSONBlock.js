import React, { useState } from "react";
import { CopyBlock, nord } from "react-code-blocks";
import { line } from "stylis";
// import { Switch, FormControlLabel } from "@mui/material";

const JSONBlock = ({ text, options }) => {
  // Prop definitions.
  // object: The object to display.
  // multiline: Whether to display the object as a single line or multiline.

  console.log(options);
  // Set up state.
  const [isMultiline, setMultiline] = useState(options?.multiline);
  const [visibleMultilineSelector, setVisibleMultilineSelector] = useState(
    options?.visibleMultilineSelector !== undefined
      ? options.visibleMultilineSelector
      : false
  );
  const [lineNumbers, setLineNumbers] = useState(
    options?.lineNumbers !== undefined ? options.lineNumbers : false
  );
  const [language, setLanguage] = useState(options?.language || "json");
  const [wrapLines, setWrapLines] = useState(
    options?.wrapLines !== undefined ? options.wrapLines : true
  );
  const [diaplayText, setDisplayText] = useState(text);

  // Run custom logic.
  if (language === "json") {
    setDisplayText(
      isMultiline
        ? JSON.stringify(displayText, null, 2)
        : JSON.stringify(displayText)
    );
  }

  // Return the component.
  return (
    <div className="json-preview">
      <div>{wrapLines}</div>
      <CopyBlock
        text={text}
        language={"text"}
        showLineNumbers={false}
        theme={nord}
        wrapLines={true}
        codeBlock
      />
      {visibleMultilineSelector && (
        <FormControlLabel
          labelPlacement="start"
          label="Multiline"
          control={
            <Switch
              checked={isMultiline}
              onChange={() => setMultiline(!isMultiline)}
              inputProps={{ "aria-label": "Toggle multiline state." }}
            />
          }
        />
      )}
    </div>
  );
};

// Default props.
JSONBlock.defaultProps = {
  object: {},
  multiline: true,
};

// Export the component.
export default JSONBlock;
