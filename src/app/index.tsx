import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.styles.scss';
import { InitialPanel } from './init/initial-panel';
import { AppEnumType } from './model/app-enum-type';

export const findAppHeader = async (): Promise<HTMLElement> => {
  return new Promise<HTMLElement>((resolve, reject) => {
    
    const header: HTMLElement = document.querySelector('.\\[grid-area\\:Header\\]')!;
    if (header === undefined || header === null) {
      console.error('[' + AppEnumType.PLUGIN_NAME + '] App header not found');
      return reject(false);
    }

    console.info('[' + AppEnumType.PLUGIN_NAME + ']', ' app found');
    return resolve(header);
  });
}

export const renderAsync = async (header: HTMLElement): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    
    const existsRoot: HTMLElement | null = document.querySelector('#' + AppEnumType.PLUGIN_NAME + '');
    if (existsRoot) {
      console.warn(AppEnumType.PLUGIN_NAME + ' is already loaded. Removing old version.');
      existsRoot.remove();
    }

    const container = document.createElement('div');
    container.id = AppEnumType.PLUGIN_NAME;

    header.appendChild(container);
    const root = createRoot(container);
    root.render((<InitialPanel />));
  });
}

