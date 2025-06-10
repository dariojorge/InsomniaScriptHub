import { AppEnumType } from "../model/app-enum-type";

const wait = async (seconds: number) => new Promise(result => setTimeout(result, seconds));

export const retrOperation = async (operation: any, delay: number, retries: number, increment: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        return operation()
            .then(resolve)
            .catch((reason: Error | null) => {
                if (retries <= 0) {
                    return reject(reason);
                }

                console.warn('[' + AppEnumType.PLUGIN_NAME + ']', ' app not found retrying for the after ' + (delay + increment) + ' ms delay');
                return wait(delay)
                    .then(retrOperation.bind(null, operation, delay + increment, retries - 1, increment))
                    .then(resolve)
                    .catch(reject);
            });
    });
}