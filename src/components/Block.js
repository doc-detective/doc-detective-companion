import React, { useState } from 'react';
import { CopyBlock, nord } from "react-code-blocks";
// import { Switch, FormControlLabel } from "@mui/material";

const Block = ({object, multiline}) => {
    // Prop definitions.
    // object: The object to display.
    // multiline: Whether to display the object as a single line or multiline.

    // Set up state.
    const [isMultiline, setMultiline] = useState(multiline);

    // Run custom logic.
    const text = isMultiline ? JSON.stringify(object, null, 2) : JSON.stringify(object);

    // Return the component.
    return (
        <div className="json-preview">
            <CopyBlock
                text={text}
                language="json"
                showLineNumbers={true}
                theme={nord}
                wrapLines={true}
                codeBlock
            />
            {/* <FormControlLabel
                labelPlacement="start"
                label="Multiline"
                control={
                    <Switch
                        checked={isMultiline}
                        onChange={() => setMultiline(!isMultiline)}
                        inputProps={{ 'aria-label': 'Toggle multiline state.' }}
                    />
                }
            /> */}
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