import path from "node:path";
import fs from "node:fs";
import {version} from "./config";
const { pipeline } = require('stream');
const { promisify } = require('util');

const baseUrl = 'https://d2cuqyywjt4vvm.cloudfront.net/cdn/live/Android';
const outputDir = '../bundle';
const asyncPipeline = promisify(pipeline);

async function downloadFile(url: string, outputPath: string) {
    const file = fs.createWriteStream(outputPath);

    const bundleResponse = await fetch(url);
    if (!bundleResponse.ok) {
        throw new Error(`Bundle 下载失败: ${bundleResponse.status}`);
    }

    if (!bundleResponse.body) {
        throw new Error('获取不到响应体，可能是网络异常');
    }
    await asyncPipeline(
        bundleResponse.body,
        fs.createWriteStream(outputPath)
    );

}

export default async function (isAll = false) {
    // await fetch(`https://d2f4hpqmmmr7fo.cloudfront.net/cdn/live/Android/catalog_${version}.json`)
    await fetch(`https://d2cuqyywjt4vvm.cloudfront.net/cdn/live/Android/catalog_${version}.json`)
        .then(res => res.json())
        .then(async json => {
            const dataBundleCounts = json.m_InternalIds.filter(item => item.match(/gamedata/));
            console.log('dataBundleCounts', dataBundleCounts)
            const dataBundle = json.m_InternalIds.find(item => item.match(/gamedata/));
            if (!dataBundle) throw new Error("未找到 gamedata bundle");

            if (isAll) {
                const bundleCounts = json.m_InternalIds.filter(item => item.match(/https/));

                for (const item of bundleCounts) {

                    // 4. 构造完整 URL
                    const bundleUrl = new URL(item, baseUrl).href;

                    // 5. 设置保存路径
                    const filename = `assets/${path.basename(item)}`;
                    const outputPath = path.join(outputDir, filename);

                    // 6. 直接下载文件
                    await downloadFile(bundleUrl, outputPath);
                    console.log(`✅ Bundle 下载完成: ${filename}`);
                    console.log(`保存位置: ${path.resolve(outputPath)}`);
                }
            } else {

                // 4. 构造完整 URL
                const bundleUrl = new URL(dataBundle, baseUrl).href;

                // 5. 设置保存路径
                const filename = `gamedata_${version.replace(/\./g, '_')}.bundle`;
                const outputPath = path.join(outputDir, filename);

                // 6. 直接下载文件
                await downloadFile(bundleUrl, outputPath);
                console.log(`✅ Bundle 下载完成: ${filename}`);
                console.log(`保存位置: ${path.resolve(outputPath)}`);

            }
        })
}
