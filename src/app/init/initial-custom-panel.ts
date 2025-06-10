import { AppEnumType } from "../model/app-enum-type";
import { TabEnumType } from "../model/tab-enum-type";
import RenderPanelPersonalized from "../personalized/personalized";
import RenderPanelScriptHub from "../scripthub/script-hub";
import RenderPanelSetting from "../settings/settings";

export const manageTabs = (activeTab: string) => {
    switch (activeTab) {
        case TabEnumType.NORMAL.toString():
            displayNormalPanel();
            break;
        case TabEnumType.PERSONALIZED.toString():
            displayPanel(TabEnumType.PERSONALIZED, RenderPanelPersonalized);
            break;
        case TabEnumType.SETTINGS.toString():
            displayPanel(TabEnumType.SETTINGS, RenderPanelSetting);
            break;
        case TabEnumType.SCRIPT_HUB.toString():
            displayPanel(TabEnumType.SCRIPT_HUB, RenderPanelScriptHub);
            break;
        default:
            console.error('[' + AppEnumType.PLUGIN_NAME + '] Tab type [' + activeTab + '] does not exist.');
    }
}

const displayNormalPanel = () => {
    const element = document.getElementById("pane-one");
    const elementTwo = document.getElementById("pane-two");
    const sideBar = document.getElementById("sidebar");
    const boxContent = document.getElementsByClassName("flex box-content");

    if (element) {
        boxContent[0]!.style.display = '';
    }

    if (element) {
        element.style.display = '';
    }

    if (elementTwo) {
        elementTwo.style.display = '';
        sideBar!.style.flex = '10 1 0px';
    }

    hideTabs(TabEnumType.NORMAL);
}

const displayPanel = (panelName: TabEnumType, renderPanel: (elementCustom: any) => any) => {
    const elementCustom = document.getElementById(`pane-${panelName.toString().toLowerCase()}`);
    elementCustom!.style.display = '';

    renderPanel(elementCustom);
    hideTabs(panelName);
}

const hideTabs = (panelType: TabEnumType) => {
    if (TabEnumType.NORMAL !== panelType) {
        const element = document.getElementById("pane-one");
        const elementTwo = document.getElementById("pane-two");
        const sideBar = document.getElementById("sidebar");
        const boxContent = document.getElementsByClassName("flex box-content");

        elementTwo!.style.display = 'none';
        sideBar!.style.flex = '0 1 0px';
        element!.style.display = 'none';
        boxContent[0]!.style.display = 'none';
    }

    Object.keys(TabEnumType)
        .filter(tabName => tabName !== panelType)
        .forEach(tabName => {
            const customElement = document.getElementById(`pane-${tabName.toString().toLowerCase()}`);
            if (customElement) {
                customElement!.style.display = 'none';
            }
        });
}