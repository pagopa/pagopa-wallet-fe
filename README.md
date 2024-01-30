# pagoPA Wallet frontend

## Configuration

You can configure environment variables with an `.env.development` file while you're developing.

For an example configuration, see `env.example`.

These are all the environment variables needed to configure the frontend:

| Variable                              | Description                                 | Type   | Default |
| ------------------------------------- | ------------------------------------------- | ------ | ------- |
| WALLET_CONFIG_API_TIMEOUT             | Timeout in millis for HTTP requests to APIs | number |         |
| WALLET_CONFIG_API_BASEPATH            | APIs basepath                               | string |         |
| WALLET_CONFIG_API_HOST                | APIs host                                   | string |         |
| WALLET_CONFIG_WEBVIEW_PM_HOST         | Webivew host of PM                          | string |         |
| WALLET_CONFIG_API_PM_BASEPATH         | API pm basepath                             | string |         |
| WALLET_OUTCOME_API_BASEPATH           | API wallet outcome basepath                 | string |         |
| WALLET_CONFIG_API_ENV                 | Deployment environment (DEV, UAT or PROD)   | string |         |
| WALLET_PAGOPA_LOGOS_CDN               | CDN host to retrieve image resources        | string |         |
| WALLET_ONBOARD_SWITCH_ON_PAYMENT_PAGE | show/hidden the save method's toggle        | number |         |
