import React from 'react';
import { createRoot } from "react-dom/client";
import './settings.styles.scss';
import { SettingsForm } from './settings-form';

const Settings = (props: {}) => {
    return (
        <>
            <SettingsForm />
        </>
    );
}

const RenderPanelSetting = (elemCustom: any) => {
    const elementRoot = createRoot(elemCustom);
    elementRoot.render((<Settings />))
};

export default RenderPanelSetting;