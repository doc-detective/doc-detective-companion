import React, { useState } from 'react';
import { CopyBlock, nord } from "react-code-blocks";
import { Switch, FormControlLabel } from "@mui/material";

const Block = ({object, options}) => {
    // Prop definitions.
    // object: The object to display.
    // multiline: Whether to display the object as a single line or multiline.

    // Set up state.
    const [isMultiline, setMultiline] = useState(options?.multiline !== undefined ? options.multiline : true);
    const [visibleMultilineSelector, setVisibleMultilineSelector] = useState(options?.visibleMultilineSelector !== undefined ? options.visibleMultilineSelector : false);
    const [language, setLanguage] = useState(options?.language !== undefined ? options.language : "json");

    // Run custom logic.
    let text;
    if (language === "json") {
      text = isMultiline ? JSON.stringify(object, null, 2) : JSON.stringify(object);
    } else {
      text = object || " ";
    }
  
    // Return the component.
    return (
        <div className="block">
            <CopyBlock
                customStyle={{ minHeight: "28px" }}
                text={text}
                language={language}
                showLineNumbers={false}
                theme={nord}
                wrapLines={true}
                codeBlock
            />
            {visibleMultilineSelector && <FormControlLabel
                labelPlacement="start"
                label="Multiline"
                control={
                    <Switch
                        checked={isMultiline}
                        onChange={() => setMultiline(!isMultiline)}
                        inputProps={{ 'aria-label': 'Toggle multiline state.' }}
                    />
                }
            />}
        </div>
    );
}

// Default props.
Block.defaultProps = {
    object: {},
    multiline: true,
}

// Export the component.
export default Block;