async function main() {
    const download = require('./download').default;
    await download(false);
    await (require('./export').default)(false);
    require('./dump');

    require('./game/i18n');
    require('./game/gift');
    require('./game/mission');
    require('./game/shop');
    require('./game/farm');
    require('./game/recipes');

}

main();
