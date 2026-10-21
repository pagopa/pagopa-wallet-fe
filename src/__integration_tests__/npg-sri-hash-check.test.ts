
describe("Check that NPG SDK is loaded successfully for with valid SRI hash", () => {

  jest.setTimeout(30000);
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(30000);

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
  })


  it(`Check that NPG SDK is loaded successfully for with valid SRI hash`, async() => {
    console.log("Check that NPG SDK is loaded successfully for with valid SRI hash")
    const WALLET_FE_CARDS_ONBOARDING = "http://localhost:1234/onboarding/creditcard#walletId=111&paymentMethodId=222&sessionToken=token";
    console.log("start onboarding for session storage initialization")
    await page.goto(WALLET_FE_CARDS_ONBOARDING, { waitUntil: "networkidle0" });
    const cardNumberInput = '#frame_CARD_NUMBER';
    // check that the card number input field is visible and clickable -> means that the NPG SDK has been loaded successfully
    const cardNumberButton = await page.waitForSelector(cardNumberInput, { visible: true, timeout: 10000 });
    expect(cardNumberButton).not.toBeNull();
  })

  it(`Check that NPG SDK is not loaded for invalid SRI hash`, async() => {
    console.log("Check that NPG SDK is not loaded for invalid SRI hash")
    const WALLET_FE_CARDS_ONBOARDING = "http://localhost:1234/onboarding/creditcard#walletId=111&paymentMethodId=222&sessionToken=token";

    // disable cache and navigate to a blank page to ensure a fresh start so that all resources are loaded anew 
    await page.setCacheEnabled(false);
    await page.goto("about:blank");

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/npg/sdk/')) {
        request.continue({ headers: { ...request.headers(), Cookie: 'tamperSriHash=true' } });
      } else {
        request.continue();
      }
    });
    // the browser reports the SRI mismatch as a console error and blocks the script
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    console.log("start onboarding for session storage initialization")
    await page.goto(WALLET_FE_CARDS_ONBOARDING, { waitUntil: "networkidle0" });

    // the app redirects to the error page when the SDK cannot be loaded
    await page.waitForFunction(() => window.location.pathname === '/errore', { timeout: 10000 });
    expect(new URL(page.url()).pathname).toBe('/errore');
    
    console.log("Console errors :", consoleErrors);
    // the SDK script has been blocked: no SRI-related error means the test is not exercising the tampered hash
    //check for custom error log on SDK load error
    expect(consoleErrors.some((e) => /NPG SDK failed to load or failed SRI validation; SDK not loaded/i.test(e))).toBe(true);

    // the SDK has not been executed, so no card field iframe is rendered
    expect(await page.$('#frame_CARD_NUMBER')).toBeNull();
  })
});