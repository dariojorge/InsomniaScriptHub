import React from "react";
import { createRoot } from "react-dom/client";

const Personalized = (props: {}) => {
    console.log("Personalized");
    return (
        <>
            
        </>
    );
}

const RenderPanelPersonalized = (elemCustom: any) => {
    const elementRoot = createRoot(elemCustom);
    elementRoot.render((<Personalized />))
};

export default RenderPanelPersonalized;