import fs from 'fs';
import path from "path";
import { ExecSyncOptionsWithStringEncoding } from "child_process";
const options: ExecSyncOptionsWithStringEncoding = {
    encoding: "utf8"
};

const isListEmpty = (list: any[]) => !list || list.length <= 0;

export const readFileDataList = (pathName: string, fileName: string): DataList => {
    return JSON.parse(openFile(`${pathName}/${fileName}`.replaceAll("\\", "/").replaceAll("//", "/")));
}

const openFile = (filePath: string) => fs.readFileSync(filePath.replaceAll("\/", path.sep), options);
export const isBlank = (stringValue: string) => (!stringValue || /^\s*$/.test(stringValue));

export const firstElement = (list: any[]) => list.length > 0 ? list[0] : null;
export const getFilteredList = (list: any[], filter: any) => list.filter(filter);

const getTypesOrType = (element: any, elementName: string) => {
    if(element.type !== undefined) {
        return element.type === elementName;
    }
    
    return element.types.includes(elementName);
}

export const getElementByType = (list: any[], elementName: string) => isListEmpty(list) ? undefined : firstElement(list.filter(element => getTypesOrType(element, elementName)));