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

const { API_HOST, API_BASEPATH } = process.env;

module.exports = function (app) {
    app.use(createProxyMiddleware(API_BASEPATH, {
        target: API_HOST,
        changeOrigin: true
    }));
}
