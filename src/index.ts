import * as app from './app';
import { AppEnumType } from './app/model/app-enum-type';
import { retrOperation } from './app/utils/retry-operation';

const initAsync = async () => {
  const header: HTMLElement = await retrOperation(app.findAppHeader, 1000, 10, 1000);
  if (!header) {
    console.error('[' + AppEnumType.PLUGIN_NAME + ']', ' app not found', header);
    return;
  }

  await app.renderAsync(header);
}

initAsync();