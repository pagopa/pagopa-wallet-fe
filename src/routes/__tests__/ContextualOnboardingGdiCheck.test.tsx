/* eslint-disable 
    @typescript-eslint/no-var-requires
*/

import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k })
}));

jest.mock("../../config", () => ({
  getConfigOrThrow: () => ({
    WALLET_GDI_CHECK_TIMEOUT: 100,
    WALLET_CONTEXTUAL_ONBOARDING_ECOMMERCE_FE_OUTCOME_URL: "/esito"
  })
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
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

import ContextualOnboardingGdiCheckPage from "../ContextualOnboardingGdiCheck";
import { WalletRoutes, ROUTE_FRAGMENT } from "../../routes/models/routeModel";

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

    const expectedPath = `/${WalletRoutes.ESITO}#${ROUTE_FRAGMENT.CLIENT_ID}=IO&${ROUTE_FRAGMENT.TRANSACTION_ID}=tx123&${ROUTE_FRAGMENT.SESSION_TOKEN}=tok123`;
    expect(mockNavigate).toHaveBeenCalledWith(expectedPath, { replace: true });

    jest.useRealTimers();
  });
});
