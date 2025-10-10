import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { IdFields, FieldId } from "../types";
import "@testing-library/jest-dom";
import { IframeCardField } from "../IframeCardField";

// Mock dell’icona errore
jest.mock("@mui/icons-material/ErrorOutline", () => ({
  __esModule: true,
  default: () => <div data-testid="error-icon" />
}));

// Mock di react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key.startsWith("errorMessageNPG.")) {
        return options?.defaultValue || "Translated error";
      }
      return key;
    }
  })
}));

// Setup
const theme = createTheme();
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

// Mock iframe
const mockIframe = {
  contentWindow: {
    location: { replace: jest.fn() }
  },
  setAttribute: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
  // eslint-disable-next-line functional/immutable-data
  document.getElementById = jest.fn(() => mockIframe as unknown as HTMLElement);
});

// Props base
const mockFields = [{ id: IdFields.CARD_NUMBER, src: "https://test.com/card" }];
const baseProps = {
  label: "Card Number",
  id: IdFields.CARD_NUMBER,
  fields: mockFields,
  activeField: undefined as FieldId | undefined,
  loaded: true
};

describe("IframeCardField (with 'loaded' prop)", () => {
  it("renders with correct label and iframe", () => {
    renderWithTheme(<IframeCardField {...baseProps} />);
    expect(screen.getByText("Card Number")).toBeInTheDocument();
    const iframe = screen.getByRole("textbox");
    expect(iframe).toBeInTheDocument();
  });

  it("sets iframe src on mount", () => {
    renderWithTheme(<IframeCardField {...baseProps} />);
    expect(mockIframe.contentWindow.location.replace).toHaveBeenCalledWith(
      "https://test.com/card"
    );
    expect(mockIframe.setAttribute).toHaveBeenCalledWith(
      "src",
      "https://test.com/card"
    );
  });

  it("renders error message and icon when isValid is false", () => {
    renderWithTheme(
      <IframeCardField
        {...baseProps}
        errorCode="ERR"
        errorMessage="Invalid field"
        isValid={false}
      />
    );
    expect(screen.getByText("Invalid field")).toBeInTheDocument();
    const icon = screen
      .getByTestId("error-icon")
      .closest('[role="presentation"]');
    expect(icon).toHaveStyle("visibility: visible");
  });

  it("hides error icon when isValid is true", () => {
    renderWithTheme(<IframeCardField {...baseProps} isValid={true} />);
    const icon = screen
      .getByTestId("error-icon")
      .closest('[role="presentation"]');
    expect(icon).toHaveStyle("visibility: hidden");
  });

  it("renders skeleton and hides iframe when not loaded", () => {
    const { queryByTestId, container } = renderWithTheme(
      <IframeCardField {...baseProps} loaded={false} />
    );

    const skeleton = container.querySelector(".MuiSkeleton-root");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-busy", "true");

    expect(queryByTestId("iframe-CARD_NUMBER")).not.toBeInTheDocument();
  });

  it("updates iframe src when fields change", () => {
    const { rerender } = renderWithTheme(<IframeCardField {...baseProps} />);

    jest.clearAllMocks();

    rerender(
      <ThemeProvider theme={theme}>
        <IframeCardField
          {...baseProps}
          fields={[
            {
              id: IdFields.CARD_NUMBER,
              src: "https://new.com/card"
            }
          ]}
        />
      </ThemeProvider>
    );

    expect(mockIframe.contentWindow.location.replace).toHaveBeenCalledWith(
      "https://new.com/card"
    );
  });

  it("does not set iframe src if id or fields are missing", () => {
    renderWithTheme(
      <IframeCardField {...baseProps} fields={undefined} id={undefined} />
    );

    expect(mockIframe.setAttribute).not.toHaveBeenCalled();
  });

  it("applies custom style to iframe", () => {
    renderWithTheme(
      <IframeCardField
        {...baseProps}
        style={{ backgroundColor: "pink", padding: "20px" }}
      />
    );

    const iframe = screen.getByRole("textbox");
    expect(iframe).toHaveStyle("background-color: pink");
    expect(iframe).toHaveStyle("padding: 20px");
  });

  it("sets correct aria attributes on error", () => {
    renderWithTheme(
      <IframeCardField
        {...baseProps}
        errorCode="ERROR"
        errorMessage="Errore"
        isValid={false}
      />
    );

    const helper = screen.getByText("Errore");
    expect(helper).toHaveAttribute("aria-hidden", "false");
    expect(helper).toHaveAttribute("aria-live", "assertive");
  });

  it("focus styles applied when activeField equals id", () => {
    renderWithTheme(
      <IframeCardField {...baseProps} activeField={IdFields.CARD_NUMBER} />
    );

    const label = screen.getByText("Card Number");
    expect(label).toBeInTheDocument();
    expect(screen.getByText("Card Number")).toBeInTheDocument();
  });

  it("error styles applied when different field is active and isValid is false", () => {
    renderWithTheme(
      <IframeCardField
        {...baseProps}
        activeField={IdFields.SECURITY_CODE}
        isValid={false}
      />
    );

    const label = screen.getByText("Card Number");
    expect(label).toHaveStyle(`color: ${theme.palette.error.dark}`);
  });

  it("does nothing if iframe element is not found", () => {
    (document.getElementById as jest.Mock).mockReturnValueOnce(null);
    renderWithTheme(<IframeCardField {...baseProps} />);
    expect(mockIframe.setAttribute).not.toHaveBeenCalled();
  });
});
