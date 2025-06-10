import { WindowApp } from './insomnia/insomnia.types';

declare global {
  interface Window {
    app: WindowApp
  };
}

