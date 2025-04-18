jest.mock('./src/config', () => ({
  getConfigOrThrow: () => ({
    WALLET_CONFIG_API_BASEPATH: '/v1',
    WALLET_CONFIG_API_ENV: 'development',
    WALLET_CONFIG_API_HOST: 'http://localhost',
    WALLET_CONFIG_API_PM_BASEPATH: '/pm',
    WALLET_CONFIG_WEBVIEW_PM_HOST: 'http://localhost',
    WALLET_NPG_SDK_URL: 'http://localhost/sdk',
    WALLET_OUTCOME_API_BASEPATH: '/api',
    WALLET_PAGOPA_LOGOS_CDN: 'http://localhost/cdn'
  })
}));