# pagoPA Wallet frontend

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=pagopa_pagopa-wallet-fe&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=pagopa_pagopa-wallet-fe)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=pagopa_pagopa-wallet-fe&metric=coverage)](https://sonarcloud.io/summary/new_code?id=pagopa_pagopa-wallet-fe)

## Configuration

You can configure environment variables with an `.env.development` file while you're developing.

For an example configuration, see `env.example`.

These are all the environment variables needed to configure the frontend:

| Variable                              | Description                                 | Type   | Default |
|---------------------------------------|---------------------------------------------|--------|---------|
| WALLET_CONFIG_API_TIMEOUT             | Timeout in millis for HTTP requests to APIs | number |         |
| WALLET_CONFIG_API_BASEPATH            | APIs basepath                               | string |         |
| WALLET_CONFIG_API_HOST                | APIs host                                   | string |         |
| WALLET_CONFIG_WEBVIEW_PM_HOST         | Webivew host of PM                          | string |         |
| WALLET_CONFIG_API_PM_BASEPATH         | API pm basepath                             | string |         |
| WALLET_OUTCOME_API_BASEPATH           | API wallet outcome basepath                 | string |         |
| WALLET_CONFIG_API_ENV                 | Deployment environment (DEV, UAT or PROD)   | string |         |
| WALLET_PAGOPA_LOGOS_CDN               | CDN host to retrieve image resources        | string |         |
|  | show/hidden the save method's toggle        | number |         |

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

In order to build and run this project are required:

- [yarn](https://yarnpkg.com/)
- [node (18.17.1)](https://nodejs.org/it/)


### Installation

1. Install node packages
   ```sh
   yarn install
   ```
2. Generate api client
   ```sh
   yarn generate
   ```
3. Build
   ```sh
   yarn build
   ```
4. tests
   ```sh
   yarn test
   ```
5. Linter
   ```sh
   yarn lint
   ```

### Usage

In order to run the application on a local dev server with mock API responses:
-  ```sh
   yarn start
   ```
the application is available at http://localhost:1234

Test use cases: 

- *ONBOARDING* 
    http://localhost:1234/onboarding/creditcard#walletId=111&paymentMethodId=222&sessionToken=token
    http://localhost:1234/onboarding/apm#walletId=111&paymentMethodId=222&sessionToken=token