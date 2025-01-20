import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export const clearDir = (path: string, ignore?: string[]):  Promise<string[]> => {
    const list: string[] = readdirSync(`${path}`);
    const fileToDelete: string[]  = list.filter(x => !ignore.some(y => y == x));

    return Promise.all(fileToDelete.map(async item => {
        rmSync(join(path, item), { force: true, recursive: true })
        return item;
    }))
}
