module.exports = {
    launch: {
        dumpio: true,
        headless: false,//"new",
        product: 'chrome',
        args: ["--no-sandbox"] // to fix
    },
    browserContext: 'incognito'
}
