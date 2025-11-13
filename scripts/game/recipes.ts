import fs from 'fs';
import {getDataPath, getFormatPath} from "../config";
import {getI18n} from "../i18n";

const text = fs.readFileSync(getDataPath('PF_CraftingData.json'), 'utf-8');
const json = JSON.parse(text);

const ConsumeData = JSON.parse(fs.readFileSync(getDataPath('PF_ConsumeData.json'), 'utf-8'));

const ConsumeMaterialGroup = ConsumeData.ConsumeMaterial.reduce((o, item) => {
    if (!o[item.ConsumeMatGroupID]) {
        o[item.ConsumeMatGroupID] = [];
    }
    o[item.ConsumeMatGroupID].push(item);
    return o;
}, {})
const CraftingToolMap = json.CraftingTool.reduce((o, item) => {
    o[item.CraftingType] = item;
    return o;
}, {})

const list = json.Crafting.map((item) => {
    return {
        ...item,
        // key: item.ItemID,
        // lv: item.ItemLv,
        // UserExp: item.UserExp,
        // IsEvent: item.IsEvent,
        category: getI18n(CraftingToolMap[item.CraftingType]?.CraftingToolName),
        name: getI18n(`Item_${item.ItemID}`),
        materials: ConsumeMaterialGroup[item.ConsumeMatGroupID]?.reduce((result, item) => {
            result[getI18n(`Item_${item.MatItemID}`)] = item.MatItemCnt;
            return result;
        }, {}),
        matItems: ConsumeMaterialGroup[item.ConsumeMatGroupID]?.reduce((result, item) => {
            result[item.MatItemID] = item.MatItemCnt;
            return result;
        }, {}),
    };
}).filter(Boolean);

const map = list.reduce((o, item) => {
    o[item.ItemID] = {
        name: item.name,
        id: item.ItemID,
        category: item.category,
        exp: item.UserExp,
        lv: item.ItemLv,
        materials: item.materials,
        matItems: item.matItems,
    };
    return o;
}, {})

fs.writeFileSync(getFormatPath('recipes.json'), JSON.stringify(map, null, 2));
