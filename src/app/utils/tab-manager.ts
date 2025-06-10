import { TabEnumType } from "../model/tab-enum-type";

export const findTabEnumKey = (tab: string): string => {
    const [key, value] = Object.entries(TabEnumType).find(([key, value]) => value === tab)!;
    return key;
}

export const findTabEnumValue = (tab: string): TabEnumType => {
    const [key, value] = Object.entries(TabEnumType).find(([key, value]) => value === tab)!;
    return value;
}

export const getTabEnumArray = (): string[] => {
    return Object.values(TabEnumType);
}