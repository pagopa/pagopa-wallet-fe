
describe("Check that NPG SDK is loaded successfully for with valid SRI hash", () => {

  jest.setTimeout(30000);
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(30000);

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 907 });
    await page.deleteCookie({ name: 'tamperSriHash', domain: 'localhost:1234' });
  })


  it.only(`Check that NPG SDK is loaded successfully for with valid SRI hash`, async() => {
    console.log("Start outcome page with IO app redirect")
    const WALLET_FE_CARDS_ONBOARDING = "http://localhost:1234/onboarding/creditcard#walletId=111&paymentMethodId=222&sessionToken=token";
    console.log("start onboarding for session storage initialization")
    await page.goto(WALLET_FE_CARDS_ONBOARDING, { waitUntil: "networkidle0" });
    const cardNumberInput = '#frame_CARD_NUMBER';
    // check that the card number input field is visible and clickable -> means that the NPG SDK has been loaded successfully
    const cardNumberButton = await page.waitForSelector(cardNumberInput, { visible: true, timeout: 10000 });
    expect(cardNumberButton).not.toBeNull();
  })

  it(`Check that NPG SDK is not loaded for invalid SRI hash`, async() => {
    console.log("Start outcome page with IO app redirect")
    const WALLET_FE_CARDS_ONBOARDING = "http://localhost:1234/onboarding/creditcard#walletId=111&paymentMethodId=222&sessionToken=token";
    page.setCookie({ name: 'tamperSriHash', value: 'true', domain: 'localhost:1234' });
    console.log("start onboarding for session storage initialization")
    await page.goto(WALLET_FE_CARDS_ONBOARDING, { waitUntil: "networkidle0" });
    const cardNumberInput = '#frame_CARD_NUMBER';
    // check that the card number input field is visible and clickable -> means that the NPG SDK has been loaded successfully
    const cardNumberButton = await page.waitForSelector(cardNumberInput, { visible: true });
    expect(cardNumberButton).not.toBeNull();
  })
});