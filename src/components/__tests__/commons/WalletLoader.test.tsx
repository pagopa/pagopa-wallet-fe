import React from "react";
import { render, screen } from "@testing-library/react";
import WalletLoader from "../../commons/WalletLoader";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe("WalletLoader", () => {
  it("renders a Box with the correct aria properties", () => {
    render(<WalletLoader />);
    const boxElement = screen.getByLabelText("ariaLabels.loading");
    expect(boxElement).toHaveAttribute("aria-live", "assertive");
  });

  it("renders a CircularProgress component", () => {
    render(<WalletLoader />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });
});