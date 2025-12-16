/* eslint-disable 
    @typescript-eslint/no-var-requires
*/
/* eslint-disable functional/immutable-data */
import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k })
}));
const walletContextualOnboardingEcommerceFeUrl = "https://ecommerce-fe/esito";
jest.mock("../../config", () => ({
  getConfigOrThrow: () => ({
    WALLET_GDI_CHECK_TIMEOUT: 100,
    WALLET_CONTEXTUAL_ONBOARDING_ECOMMERCE_FE_OUTCOME_URL:
      walletContextualOnboardingEcommerceFeUrl
  })
}));

const mockGetFragments = jest.fn().mockReturnValue({
  sessionToken: "tok123",
  clientId: "IO",
  transactionId: "tx123",
  gdiIframeUrl: "http://localhost"
});
const mockGetBase64Fragment = jest.fn().mockReturnValue("https://iframe.url");
jest.mock("../../utils/urlUtilities", () => ({
  getFragments: mockGetFragments,
  getBase64Fragment: mockGetBase64Fragment,
  redirectToClient: jest.fn()
}));

const mockSetSessionItem = jest.fn();
jest.mock("../../utils/storage", () => ({
  SessionItems: { sessionToken: "sessionToken" },
  setSessionItem: mockSetSessionItem
}));

const buildSdk = jest.fn();
jest.mock("../../hooks/useNpgSdk", () => ({
  useNpgSdk: () => ({
    buildSdk,
    sdkReady: false
  })
}));

const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originalLocation, replace: jest.fn() }
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation
  });
});

import ContextualOnboardingGdiCheckPage from "../ContextualOnboardingGdiCheck";
import { ROUTE_FRAGMENT } from "../../routes/models/routeModel";

describe("ContextualOnboardingGdiCheckPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to the correct route after the configured timeout", () => {
    jest.useFakeTimers();
    jest
      .spyOn(require("../../hooks/useNpgSdk"), "useNpgSdk")
      .mockReturnValue({ buildSdk, sdkReady: true });

    render(<ContextualOnboardingGdiCheckPage />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    const expectedPath = `${walletContextualOnboardingEcommerceFeUrl}#${ROUTE_FRAGMENT.CLIENT_ID}=IO&${ROUTE_FRAGMENT.TRANSACTION_ID}=tx123&${ROUTE_FRAGMENT.SESSION_TOKEN}=tok123`;
    expect(window.location.replace).toHaveBeenCalledWith(expectedPath);

    jest.useRealTimers();
  });
});
