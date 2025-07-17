module.exports = {
    launch: {
        dumpio: true,
        headless: "new",
        product: 'chrome',
        args: ["--no-sandbox"] // to fix
    },
    browserContext: 'incognito'
}
