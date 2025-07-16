import translationIT from "../translations/it/translations.json";

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

    const WALLET_FE_APM_ONBOARDING = "http://localhost:1234/onboarding/apm#walletId=111&paymentMethodId=222&sessionToken=token";
    const WALLET_FE_ESITO_PAGE = "http://localhost:1234/esito";

    console.log("start onboarding for session storage initialization")
    await page.goto(WALLET_FE_APM_ONBOARDING, { timeout: 30000 });

    console.log("redirect directly into result page")
    await page.goto(WALLET_FE_ESITO_PAGE, { timeout: 30000 });

    await page.waitForSelector('#continueToIOBtn');
    const waitingTitleSelector = await page.waitForSelector('#waitingTitle');
    const waitingTitle = await waitingTitleSelector.evaluate((el) => el.textContent);
    expect(waitingTitle).toBe(translationIT.resultPage.justFewMoments);
    const waitingMessageSelector = await page.waitForSelector('#waitingMessage')
    const waitingMessage =  await waitingMessageSelector.evaluate((el) => el.textContent);
    expect(waitingMessage).toBe(translationIT.resultPage.completeOperationMsg);
  })
});