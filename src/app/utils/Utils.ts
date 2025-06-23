import fs from 'fs';
import path from "path";
import os from 'os';
import { ExecSyncOptionsWithStringEncoding } from "child_process";

const homeDir = os.homedir();
const options: ExecSyncOptionsWithStringEncoding = {
    encoding: "utf8"
};
const ENVS_FILE_NAME = "envs.json";

export const log = (message: string) => console.log(message);
export const warning = (message: string) => console.warn(message);
export const error = (message: string) => console.error(message);

const openFile = (filePath: string) => fs.readFileSync(filePath.replaceAll("\/", path.sep), options);
const getTypesOrType = (element: any, elementName: string) => {
    if (element.type !== undefined) {
        return element.type === elementName;
    }

    return element.types.includes(elementName);
}

export const isListEmpty = (list: any[]) => !list || list.length <= 0;
export const getSettings = (fileName: string): SettingsModel => {
    const pathName: string = path.resolve(__dirname, fileName);
    if (!fs.existsSync(pathName)) {
        let settings: SettingsModel = {
            scriptHubPath: homeDir
        };
        saveSettings(settings!, pathName);
    }

    return JSON.parse(fs.readFileSync(pathName, options));
};

export const saveSettings = (formData: SettingsModel, fileName: string) => {
    const pathName: string = path.resolve(__dirname, fileName);
    fs.writeFileSync(pathName, JSON.stringify(formData), options);
};

export const readFileDataList = (pathName: string, fileName: string): DataList => {
    let settingsPath = `${pathName}/${fileName}`.replaceAll("\\", "/").replaceAll("//", "/");

    if (!fs.existsSync(settingsPath)) {
        return JSON.parse('{ "types": [] }');
    }
    return JSON.parse(openFile(settingsPath));
}

export const readFileEnvs = (pathName: string): EnvsData => {
    let settingsPath = `${pathName}/${ENVS_FILE_NAME}`.replaceAll("\\", "/").replaceAll("//", "/");

    if (!fs.existsSync(settingsPath)) {
        error(`The file envs.json does not exist. Returning empty json. Path: ${settingsPath}`);
        return JSON.parse('{}');
    }
    return JSON.parse(openFile(settingsPath));
}

export const checkForLastSlashInString = (chars: string[]) => {
    const lastElem = getLastElement(chars);
    if (lastElem === '/' || lastElem === '\\') {
        chars.pop();
    }
    return chars.join('');
}

export const removeAllElems = (startIndex: number, list: CardData[]) => {
    return list.filter(card => card.id <= startIndex);
}

export const isBlank = (stringValue: string) => (!stringValue || /^\s*$/.test(stringValue));
export const isEmpty = (value: string | any[] | null) => value == null || value.length === 0;
export const firstElement = (list: any[]) => list.length > 0 ? list[0] : null;
export const getFilteredList = (list: any[], filter: any) => list.filter(filter);
export const getElementByType = (list: any[], elementName: string) => isListEmpty(list) ? undefined : firstElement(list.filter(element => getTypesOrType(element, elementName)));
export const getLastElement = (list: any[], offset: number = 0) => list[list.length - (1 + offset)];
export const getFolders = (path: string) => {
    if (!fs.existsSync(path)) {
        return;
    }

    return fs.readdirSync(path).filter(file => fs.statSync(path + '/' + file).isDirectory());
};