import fs from 'fs';
import {getI18n} from "../i18n";
import {getDataPath, getFormatPath} from "../config";

const text = fs.readFileSync(getDataPath('PF_QuestData.json'), 'utf-8');
const json = JSON.parse(text);

const QuestStepMap = json.QuestStep.reduce((o, item) => {
    if (!o[item.QuestID]) {
        o[item.QuestID] = [];
    }
    o[item.QuestID].push(item);
    return o;
}, {})

fs.writeFileSync(getFormatPath('quest.json'), JSON.stringify(json.QuestInfo.map((item) => {
    return getI18n(`Quest_${item.Key}_Title`) ? {
        key: item.Key,
        name: getI18n(`Quest_${item.Key}_Title`),
        steps: QuestStepMap[item.Key]?.map((o) => {
            if ([26, 35, 95, 94, 39, 96, 93, 50, 30, 37, 25, 53].includes(o.OpenConditionType)) {
                return `${getI18n(o.QuestStepDesc).replace(/\{0}/, o.param1)}`;
            }
            // if ([39].includes(o.OpenConditionType)) {
            //     return `${i18n[o.QuestStepDesc].replace(/\{1}/, o.param1).replace(/\{0}/, o.param2).replace(/\{3}/, o.param3)}`;
            // }
            if ([60, 36].includes(o.OpenConditionType)) {
                return `${getI18n(o.QuestStepDesc).
                replace(/\{1}/, o.param1).
                replace(/\{0}/, getI18n(`NPC${o.param2}_name`)).
                replace(/\{3}/, o.param3)}`;
            }
            if ([27].includes(o.OpenConditionType)) {
                return `${getI18n(o.QuestStepDesc).
                replace(/\{1}/, o.param1).
                replace(/\{0}/, getI18n(`field_${o.param2}`)).
                replace(/\{3}/, o.param3)}`;
            }
            return `${getI18n(o.QuestStepDesc)?.
            replace(/\{1}/, o.param1).
            replace(/\{0}/, getI18n(`Item_${o.param2}`)).
            replace(/\{3}/, o.param3)}`;
        }),
    } : null;
}).filter(Boolean), null, 2));
