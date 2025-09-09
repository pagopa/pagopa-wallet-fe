import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IFrameCardPage from "../Cards";

// Mock translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "it" }
  }),
  Trans: ({ children }: any) => children
}));

// Mock IframeCardForm
jest.mock("../../features/onboard/components/IframeCardForm", () => ({
  __esModule: true,
  default: ({ isPayment }: { isPayment?: boolean }) => (
    <div data-testid="iframe-card-form">
      IframeCardForm - isPayment: {isPayment ? "true" : "false"}
    </div>
  )
}));

// Mock PageContainer to simplify structure (optional)
jest.mock("../../components/commons/PageContainer", () => ({
  __esModule: true,
  default: ({
    title,
    children
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}));

describe("IFrameCardPage", () => {
  it("renders correctly with default props", () => {
    render(<IFrameCardPage />);

    expect(
      screen.getByRole("heading", { name: "inputCardPage.title" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("iframe-card-form")).toHaveTextContent(
      "isPayment: false"
    );
  });

  it("renders correctly with isPayment=true", () => {
    render(<IFrameCardPage isPayment />);

    expect(screen.getByTestId("iframe-card-form")).toHaveTextContent(
      "isPayment: true"
    );
  });
  it("help link should be visible", async () => {
    render(<IFrameCardPage />);
    const helpLink = screen.getByTestId("helpLink");
    expect(helpLink).toBeInTheDocument();
  });

  it("when help link is clicked modal is visible", async () => {
    render(<IFrameCardPage />);
    const helpLink = screen.getByTestId("helpLink");
    fireEvent.click(helpLink);

    expect(screen.getByTestId("modalTitle")).toBeInTheDocument();
  });

  it("when close button is clicked modal closes", async () => {
    render(<IFrameCardPage />);
    const helpLink = screen.getByTestId("helpLink");
    fireEvent.click(helpLink);

    fireEvent.click(screen.getByTestId("closeButton"));

    await waitFor(() =>
      expect(screen.queryByTestId("modalTitle")).not.toBeInTheDocument()
    );
  });
});
