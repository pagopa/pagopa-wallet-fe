/**
 * Development server built as an express application.
 *
 * We run the frontend application (thanks to parcel-bundler)
 * and the API proxy server (thanks to http-proxy-middleware)
 * on localhost:1234 so we don't have to deal with CORS.
 *
 */
require('dotenv').config()
const {createProxyMiddleware} = require("http-proxy-middleware");

const API_HOST = process.env.WALLET_CONFIG_API_HOST;
const API_WALLET_BASEPATH =  process.env.WALLET_CONFIG_API_HOST;
const API_PM_BASEPATH =  process.env.WALLET_CONFIG_API_HOST;

module.exports = function (app) {
    app.use(createProxyMiddleware([API_WALLET_BASEPATH, API_PM_BASEPATH], {
        target: API_HOST,
        changeOrigin: true
    }));
}
