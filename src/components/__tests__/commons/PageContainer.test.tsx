import React from "react";
import { render, screen } from "@testing-library/react";
import PageContainer from "../../../components/commons/PageContainer";
import "@testing-library/jest-dom";

jest.mock("react-promise-tracker", () => ({
  usePromiseTracker: jest.fn()
}));

jest.mock("../../../components/commons/WalletLoader", () => () => (
  <div data-testid="wallet-loader">WalletLoader</div>
));

describe("PageContainer", () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const { usePromiseTracker } = require("react-promise-tracker");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders WalletLoader when promiseInProgress is true", () => {
    usePromiseTracker.mockReturnValue({ promiseInProgress: true });
    render(<PageContainer />);
    expect(screen.getByTestId("wallet-loader")).toBeInTheDocument();
  });

  it("does not render WalletLoader when promiseInProgress is false", () => {
    usePromiseTracker.mockReturnValue({ promiseInProgress: false });
    render(<PageContainer />);
    expect(screen.queryByTestId("wallet-loader")).not.toBeInTheDocument();
  });

  it("renders a title when provided", () => {
    usePromiseTracker.mockReturnValue({ promiseInProgress: false });
    render(<PageContainer title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("does not render a title when not provided", () => {
    usePromiseTracker.mockReturnValue({ promiseInProgress: false });
    render(<PageContainer />);
    const heading = screen.queryByRole("heading", { level: 4 });
    expect(heading).not.toBeInTheDocument();
  });

  it("renders description and link when provided", () => {
    usePromiseTracker.mockReturnValue({ promiseInProgress: false });
    const link = <a href="https://example.com">Example Link</a>;
    render(<PageContainer description="Test Description" link={link} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Example Link")).toBeInTheDocument();
  });

  it("renders children with provided sx style", () => {
    usePromiseTracker.mockReturnValue({ promiseInProgress: false });
    const childrenSx = { backgroundColor: "red" };
    render(
      <PageContainer childrenSx={childrenSx}>
        <div data-testid="child">Child Content</div>
      </PageContainer>
    );
    const childContainer = screen.getByTestId("child").parentElement;
    expect(childContainer).toHaveStyle("background-color: red");
  });
});
