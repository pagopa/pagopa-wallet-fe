/**
 * Development server built as an express application.
 *
 * We run the frontend application (thanks to parcel-bundler)
 * and the API proxy server (thanks to http-proxy-middleware)
 * on localhost:1234 so we don't have to deal with CORS.
 *
 */
require("dotenv").config({ path: ".env.development" });

const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const path = require("path");

const PROXY_TARGET_API_HOST = process.env.WALLET_PROXY_TARGET_API_HOST;
const API_WALLET_BASEPATH = process.env.WALLET_CONFIG_API_BASEPATH;
const API_PM_BASEPATH = process.env.WALLET_CONFIG_API_PM_BASEPATH;
const API_OUTCOME_BASEPATH = process.env.WALLET_OUTCOME_API_BASEPATH;

module.exports = function (app) {
  app.use(
    createProxyMiddleware([API_WALLET_BASEPATH, API_PM_BASEPATH, API_OUTCOME_BASEPATH], {
      target: PROXY_TARGET_API_HOST,
      changeOrigin: true // required when target is on https
    })
  );

  app.use("/", express.static(path.join(__dirname, "static")));
};
