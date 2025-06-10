import React from "react";
import { createRoot } from "react-dom/client";

const Settings = (props: {}) => {
    console.log("Settings");
    return (
        <>
            
        </>
    );
}

const RenderPanelSetting = (elemCustom: any) => {
    const elementRoot = createRoot(elemCustom);
    elementRoot.render((<Settings />))
};

export default RenderPanelSetting;