import Datastore from '@seald-io/nedb';
import * as path from 'path';

const NeDb = window.require('@seald-io/nedb');
const dbName = 'Plugin.request-navigator';

const dbPath = path.join(window.app.getPath("userData"), `insomnia.${dbName}.db`);
const databaseInternal = new NeDb({ filename: dbPath, autoload: true, corruptAlertThreshold: 0.9, inMemoryOnly: false }) as Datastore;

export const database = databaseInternal;
