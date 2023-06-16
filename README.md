# pagoPA Wallet frontend

## Configuration

You can configure environment variables with an `.env.development` file while you're developing.

For an example configuration, see `env.example`.

These are all the environment variables needed to configure the frontend:

| Variable                        | Description                                  | Type   | Default |
|---------------------------------|----------------------------------------------|--------|---------|
| CHECKOUT_API_TIMEOUT            | Timeout in seconds for HTTP requests to APIs | number | 10      |
| CHECKOUT_API_ECOMMERCE_BASEPATH | API basepath for eCommerce Checkout APIs     | string |         |
| CHECKOUT_ECOMMERCE_HOST         | Host of eCommerce Checkout APIs              | string |         |
| CHECKOUT_PAGOPA_ASSETS_CDN      | URL of CDN where to get logos from           | string |         |
| WALLET_ENV                      | Deployment environment (DEV, UAT or PROD)    | string |         |
