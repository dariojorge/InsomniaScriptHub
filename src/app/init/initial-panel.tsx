import React, { FC, useEffect, useRef, useState } from 'react';
import './initial-panel.styles.scss';
import { loadTab, saveTab } from '../db';
import { TabEnumType } from '../model/tab-enum-type';
import { findTabEnumKey, getTabEnumArray } from '../utils/tab-manager';
import { TabGroup } from '../fragments/tab-group/tab-group';
import { manageTabs } from './initial-custom-panel';

export const InitialPanel: FC = () => {
  const isInitialRender = useRef(false);
  const [active, setActive] = useState<string>(TabEnumType.NORMAL);

  useEffect(() => {
    isInitialRender.current = true;
  }, []);

  useEffect(() => {
    let activeTab: string = findTabEnumKey(active);

    loadTab().then((response) => {
      let responseTab = findTabEnumKey(response);
      if(responseTab === activeTab) {
        return;
      }

      if (isInitialRender.current) {
        isInitialRender.current = false;
        buildIfMissingCustomPanel();
        managingTabs(responseTab);
        return;
      }

      managingTabs(activeTab);
    }).catch(() => {
      managingTabs(activeTab);
    });

   
  }, [active]);

  const managingTabs = (tab: string) => {
    saveTab(tab);
    setActive(tab);
    manageTabs(tab!);
  }

  return (
    <>
      <TabGroup tabTypes={getTabEnumArray()} active={active} setActive={setActive}></TabGroup>
    </>
  )
}

const buildIfMissingCustomPanel = () => {
  Object.keys(TabEnumType)
    .filter(tabName => tabName !== TabEnumType.NORMAL)
    .forEach(tabName => {
      const element = document.getElementById("pane-one");
      const panelName = `pane-${tabName.toString().toLowerCase()}`;
      let customElement = document.getElementById(panelName);
      buildCustomElement(customElement, element!, panelName);
    });
}

const buildCustomElement = (customElement: HTMLElement | null, element: HTMLElement, panelName: string) => {
  if (!customElement) {
    const newElem = document.createElement('div')
    const customPane = element.cloneNode(false);
    newElem.appendChild(customPane);
    newElem.setAttribute('id', panelName);
    newElem.setAttribute('class', element.className);
    newElem.style.flex = '65.4 1 0px';
    newElem.style.overflow = 'hidden';

    element?.parentElement?.insertBefore(newElem, element?.parentElement?.childNodes[1])
    customElement = document.getElementById(panelName);
  }
}
