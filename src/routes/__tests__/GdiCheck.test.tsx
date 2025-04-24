import React from "react";
import { act } from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import GdiCheckPage from "../GdiCheck";
import { OUTCOME_ROUTE } from "../models/routeModel";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn()
}));

jest.mock(
  "../../components/commons/PageContainer",
  () =>
    ({ children }: any) =>
      <div data-testid="page-container">{children}</div>
);

jest.mock("../../components/commons/WalletLoader", () => () => (
  <div data-testid="wallet-loader">WalletLoader</div>
));

jest.mock("../../utils", () => ({
  url: {
    redirectWithOutcome: jest.fn()
  }
}));

import utils from "../../utils";
import { getConfigOrThrow } from "../../config";

jest.mock("../../config", () => ({
  getConfigOrThrow: jest.fn().mockReturnValue({
    WALLET_GDI_CHECK_TIMEOUT: 30000
  })
}));

describe("GdiCheckPage", () => {
  const mockRedirect = utils.url.redirectWithOutcome as jest.Mock;
  const base64Url = Buffer.from("https://test.com/iframe").toString("base64");

  beforeEach(() => {
    jest.useFakeTimers();

    (useLocation as jest.Mock).mockReturnValue({
      state: { gdiIframeUrl: base64Url }
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders the component with WalletLoader and hidden iframe", () => {
    render(<GdiCheckPage />);

    expect(screen.getByTestId("page-container")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-loader")).toBeInTheDocument();

    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute("src")).toBe("https://test.com/iframe");
    expect(iframe?.style.display).toBe("none");
  });

  it("calls redirectWithOutcome after timeout", () => {
    render(<GdiCheckPage />);

    jest.advanceTimersByTime(5000);
    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });

  it("clears the timeout on unmount", () => {
    const { unmount } = render(<GdiCheckPage />);
    unmount();

    jest.advanceTimersByTime(5000);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
  it("calls redirectWithOutcome with GENERIC_ERROR route", () => {
    render(<GdiCheckPage />);
    act(() => {
      jest.advanceTimersByTime(getConfigOrThrow().WALLET_GDI_CHECK_TIMEOUT);
    });
    expect(utils.url.redirectWithOutcome).toHaveBeenCalledWith(
      OUTCOME_ROUTE.GENERIC_ERROR
    );
  });
});
