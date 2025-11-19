import path from "node:path";
export const version = '1.0.8';

export const keyHex = '190664efcf5930d02952ba0cef01f5498cdd94d2904ad11485026c822588b51d';
export const ivHex = '14d21c887878504275ddb1d79039e036';

export const assetKeyHex = '054fdc7a7d56fc6e15b5e9550f6334bc2b5781e09828eb66e4bfd3d4b26efc4e';
export const assetIvHex = '9126e785dbb27d3816a70615bc36a192';

export const oKey = '486c38c0bbe3f3b6afcda2f9de55e8173228434156b616bb7dc28a5dd5a1a6b3';
export const oiV = '7bd13920ce848b4adf2750a5169be801';

export const dataPath = path.join(__dirname, `../data`);
export const i18nPath = path.join(__dirname, `../i18n`);
export const formatPath = path.join(__dirname, `../format`);

export function getDataPath(p: string) {
    return path.join(dataPath, p);
}

export function getI18nPath(p: string) {
    return path.join(i18nPath, p);
}

export function getFormatPath(p: string) {
    return path.join(formatPath, p);
}
