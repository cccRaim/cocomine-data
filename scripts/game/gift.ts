import fs from 'fs';
import {getDataPath, getFormatPath} from "../config";
import {getI18n} from "../i18n";

const text = fs.readFileSync(getDataPath('PF_NPCData.json'), 'utf-8');
const json = JSON.parse(text);

console.log(Object.keys(json))

fs.writeFileSync(getFormatPath('gift.json'), JSON.stringify(json.NPCItemGift.reduce((o, item) => {
    if (!o[item.NPCID]) {
        o[item.NPCID] = {
            name: getI18n(`NPC${item.NPCID}_name`),
            items: []
        };
    }
    o[item.NPCID].items.push(getI18n(`Item_${item.ItemID}`))
    return o;
}, {}), null, 2));
