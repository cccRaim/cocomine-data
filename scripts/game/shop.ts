import fs from 'fs';
import {getDataPath, getFormatPath} from "../config";
import {getI18n} from "../i18n";

const text = fs.readFileSync(getDataPath('PF_ShopData.json'), 'utf-8');
const json = JSON.parse(text);

const GreeneryShopMap = json.GreeneryShop.reduce((o, item) => {
    if (!o[item.GroupItemID]) {
        o[item.GroupItemID] = [];
    }
    o[item.GroupItemID].push(item);
    return o;
}, {})

fs.writeFileSync(getFormatPath('shop.json'), JSON.stringify(json.GreeneryShopBuyLimit.map((item) => {
    return {
        key: item.Key,
        name: getI18n(`Item_${GreeneryShopMap[item.Key]?.[0].ItemID}`),
        levels: item.Level?.map((level, index) => {
            return `LV.${level}: ${item.LevelCnt[index]}`;
        }),
    };
}).filter(Boolean), null, 2));
