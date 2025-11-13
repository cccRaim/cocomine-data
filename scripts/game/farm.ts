import fs from 'fs';
import {getDataPath, getFormatPath} from "../config";
import {getI18n} from "../i18n";
import dayjs from 'dayjs'
import duration, {Duration} from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 导入本地化语言

dayjs.extend(duration)
dayjs.extend(relativeTime)

const text = fs.readFileSync(getDataPath('PF_FarmData.json'), 'utf-8');
const json = JSON.parse(text);
const text2 = fs.readFileSync(getDataPath('PF_ItemData.json'), 'utf-8');
const json2 = JSON.parse(text2);

const ItemMap = json2.Item.reduce((o, item) => {
    o[item.Key] = item;
    return o;
}, {})

function formatDuration(duration: Duration) {
    const data = {
        '天': duration.days(),
        '小时': duration.hours(),
        '分钟': duration.minutes(),
        '秒': duration.seconds()
    };

    return Object.entries(data)
        .filter(([_, value]) => value > 0)
        .map(([unit, value]) => `${value}${unit}`)
        .join(' ') || '0s';
}

fs.writeFileSync(getFormatPath('farm.json'), JSON.stringify(json.Farm.reduce((o, item) => {
    if (!o[item.FarmItemID]) {
        const duration = dayjs.duration(item.GrowthTime, "second");

        o[item.FarmItemID] = {
            name: getI18n(`Item_${item.FarmItemID}`),
            GrowthTime: formatDuration(duration),
            sources: []
        };
    }
    o[item.FarmItemID].sources.push(`LV.${ItemMap[item.ItemID].ItemLv}: ${getI18n(`Item_${item.ItemID}`) || getI18n(`Item_${item.InsertItemID}`)}`)
    return o;
}, {}), null, 2));
