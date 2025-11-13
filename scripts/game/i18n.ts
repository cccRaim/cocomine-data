import fs from 'fs';
import {getDataPath, getI18nPath} from "../config";

const text = fs.readFileSync(getDataPath('PF_StringData.json'), 'utf-8');
const json = JSON.parse(text);

console.log(Object.keys(json))

fs.writeFileSync(getI18nPath('zh.json'), JSON.stringify(json.TRS_StringTable.reduce((o, item) => {
    o[item.Key] = item.StringName_TRS;
    return o;
}), null, 2));

// const text2 = fs.readFileSync('../../data/PF_NGWordData.json', 'utf-8');
// const json2 = JSON.parse(text2);
//
// fs.writeFileSync('./i18n/PF_NGWordData.json', JSON.stringify(json2.NGWord_JPN.reduce((o, item) => {
//     o[item.Key] = item.NgWordxText;
//     return o;
// }), null, 2));
