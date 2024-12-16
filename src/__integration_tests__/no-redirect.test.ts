describe("Test showing final button for continue to IO", () => {

  /**
   * Default test timeout (80000ms)
    */
  jest.setTimeout(30000);
  jest.retryTimes(3);
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(30000);

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
  })


  it(`Test IO button on success payment flow`, async() => {
    console.log("Start outcome page with IO app redirect")

    const WALLET_FE_CARD_ONBOARDING = "http://localhost:1234/onboarding/creditcard#walletId=111&paymentMethodId=222&sessionToken=token";
    const WALLET_FE_ESITO_PAGE = "http://localhost:1234/esito";

    console.log("start onboarding for session storage initialization")
    await page.goto(WALLET_FE_CARD_ONBOARDING);

    console.log("redirect directly into result page")
    await page.goto(WALLET_FE_ESITO_PAGE);

    await page.waitForSelector('#continueToIOBtn');
  })
});