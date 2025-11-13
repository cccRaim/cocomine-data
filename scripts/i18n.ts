import fs from 'fs';
import {getI18nPath} from "./config";

const text2 = fs.readFileSync(getI18nPath('zh.json'), 'utf-8');
const i18n = JSON.parse(text2);

export function getI18n(key: string): string {
    return i18n[key];
}
