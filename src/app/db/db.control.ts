import { AppEnumType } from '../model/app-enum-type';
import { DbEnumType } from '../model/db-enum-type';
import { database } from './db';

export const saveTab = (activeTab: string) => {
    database.insert({ _id: DbEnumType.SAVE_TAB_ID, activeTab }, (err: any) => {
        if (err) {
            console.warn('[' + AppEnumType.PLUGIN_NAME + ']', " Can't insert key \"" + DbEnumType.SAVE_TAB_ID + "\" as it exists, updating instead");
            updateTab(activeTab);
        }
    })
}

const updateTab = (activeTab: string) => {
    database.update({ _id: DbEnumType.SAVE_TAB_ID }, { $set: { activeTab } }, {}, (err: any) => {
        if (err) {
            console.error('[' + AppEnumType.PLUGIN_NAME + ']', ' cannot add data in db', err);
        }
    })
}

export const loadTab = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        database.findOne({ _id: DbEnumType.SAVE_TAB_ID }, (_err: Error | null, doc: any) => {
            if (doc === undefined || doc === null || doc.activeTab === undefined) {
                console.warn('[' + AppEnumType.PLUGIN_NAME + ']', "This key \"" + DbEnumType.SAVE_TAB_ID + "\" does not exist");
                return reject();
            }

            return resolve(doc.activeTab);
        });
    });
}