import {version} from "./config";

const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置参数
const config = {
    assetStudioPath: path.join(__dirname, '../cli', 'AssetStudioCLI.exe'), // AssetStudio路径
    inputPath: path.join(__dirname, `../bundle/gamedata_${version.replace(/\./g, '_')}.bundle`),                    // 需要解析的Unity资源路径
    inputAssetsPath: path.join(__dirname, `../bundle/assets/`),                    // 需要解析的Unity资源路径
    outputPath: path.join(__dirname, `../dumped/${version}`),                            // 导出目录
    outputAssetsPath: path.join(__dirname, `../dumped/assets/${version}`),                            // 导出目录
    assetTypes: ['TextAsset', 'Texture2D'],     // 导出的资源类型
    imageFormat: 'png',                                // 图片导出格式
    // filter: 'character_'                               // 资源名称过滤
};

// 确保输出目录存在
function ensureOutputDirectory() {
    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath, { recursive: true });
        console.log(`创建输出目录: ${path.resolve(config.outputPath)}`);
    }
}

// 构建命令行参数
function buildCommandArgs(isAssets = false) {
    return [
        isAssets ? config.inputAssetsPath : config.inputPath,
        isAssets ? config.outputAssetsPath : config.outputPath,
        '--game', 'Normal',
        // '--image-format', config.imageFormat,
        // '-f', config.filter
    ];
}

// 执行导出操作
async function exportAssets(isAssets = false) {
    try {
        ensureOutputDirectory();
        const args = buildCommandArgs(isAssets);

        console.log('开始导出资源...');
        console.log(`执行命令: ${config.assetStudioPath} ${args.join(' ')}`);

        const child = execFile(
            path.resolve(config.assetStudioPath),
            args,
            { windowsVerbatimArguments: true }
        );

        // 实时输出日志
        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        child.stderr.on('data', (data) => {
            process.stderr.write(data);
        });

        // 等待导出完成
        await new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code === 0) {
                    console.log(`\n导出成功! 资源已保存到: ${path.resolve(config.outputPath)}`);
                    resolve(code);
                } else {
                    reject(new Error(`导出失败，退出码: ${code}`));
                }
            });
        });

    } catch (error) {
        console.error('❌ 导出过程中出错:', error.message);
        process.exit(1);
    }
}

export default exportAssets

// 执行导出
// exportAssets();
