import translationIT from "../translations/it/translations.json";

describe("Test showing final button for continue to IO", () => {

  /**
   * Default test timeout (80000ms)
    */
  jest.setTimeout(30000);
  jest.retryTimes(3);
  page.setDefaultNavigationTimeout(10000);
  page.setDefaultTimeout(10000);

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
    // the app detects the language from navigator: force it so the test does not depend on the browser locale
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "language", { get: () => "it-IT" });
      Object.defineProperty(navigator, "languages", { get: () => ["it-IT", "it"] });
    });
  })


  it(`Test IO button on success payment flow`, async() => {
    console.log("Start outcome page with IO app redirect")

    const WALLET_FE_APM_ONBOARDING = "http://localhost:1234/onboarding/apm#walletId=111&paymentMethodId=222&sessionToken=token";
    const WALLET_FE_ESITO_PAGE = "http://localhost:1234/esito";

    try {
      console.log("start onboarding for session storage initialization")
      await page.goto(WALLET_FE_APM_ONBOARDING, { waitUntil: "networkidle0" });

      console.log("redirect directly into result page")
      //redirect to the result page waiting for document to be full loaded (networkidle0 can cause errors due to iowallet:// redirect and be misinterpreted)
      await page.goto(WALLET_FE_ESITO_PAGE, { waitUntil: "domcontentloaded" });
      
      console.log("[step] esito page loaded, waiting for #continueToIOBtn")
      await page.waitForSelector('#continueToIOBtn');
    } catch (e) {
      console.log(`[diagnostic] failed: ${(e as Error).message}`);
      console.log(`[diagnostic] url: ${page.url()}`);
      console.log(`[diagnostic] body: ${await page.evaluate(() => document.body?.innerHTML).catch(() => "n/a")}`);
      throw e;
    }
    const waitingTitleSelector = await page.waitForSelector('#waitingTitle');
    const waitingTitle = await waitingTitleSelector.evaluate((el) => el.textContent);
    expect(waitingTitle).toBe(translationIT.resultPage.justFewMoments);
    const waitingMessageSelector = await page.waitForSelector('#waitingMessage')
    const waitingMessage =  await waitingMessageSelector.evaluate((el) => el.textContent);
    expect(waitingMessage).toBe(translationIT.resultPage.completeOperationMsg);
  })
});