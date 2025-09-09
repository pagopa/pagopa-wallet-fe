import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { createTheme } from "@mui/material/styles";
import InformationModal from "../../commons/InformationModal";

jest.mock("@mui/material", () => {
  const originalModule = jest.requireActual("@mui/material");
  return {
    ...originalModule,
    Dialog: ({ children, open, maxWidth, PaperProps, fullWidth }: any) =>
      open ? (
        <div
          data-testid="dialog-component"
          data-maxwidth={maxWidth}
          data-fullwidth={fullWidth ? "true" : "false"}
          style={PaperProps?.style}
        >
          {children}
        </div>
      ) : null,
    DialogTitle: ({ children, sx }: any) => (
      <div data-testid="dialog-title" style={{ ...sx }}>
        {children}
      </div>
    ),
    DialogContent: ({ children, sx }: any) => (
      <div data-testid="dialog-content" style={sx}>
        {children}
      </div>
    ),
    Typography: ({ children, variant, component, sx, id }: any) => (
      <div
        data-testid="typography-component"
        data-variant={variant}
        data-component={component}
        style={sx}
        id={id}
      >
        {children}
      </div>
    ),
    useTheme: () =>
      createTheme({
        palette: {
          background: {
            default: "#ffffff"
          }
        } as any
      })
  };
});

jest.mock(
  "@mui/material/IconButton",
  () =>
    ({ children, onClick, sx, "aria-label": ariaLabel }: any) =>
      (
        <button
          data-testid="icon-button"
          onClick={onClick}
          style={sx}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      )
);

jest.mock("@mui/icons-material/Close", () => () => (
  <span data-testid="close-icon">X</span>
));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "ariaLabels.close": "Close modal"
      };
      return translations[key] || key;
    }
  })
}));

describe("InformationModal Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose}>
        <div data-testid="modal-content">Test Content</div>
      </InformationModal>
    );

    // Check if the dialog is rendered
    expect(screen.getByTestId("dialog-component")).toBeInTheDocument();

    // Check if the content is rendered
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Check if the close icon is rendered
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <InformationModal open={false} onClose={mockOnClose}>
        <div data-testid="modal-content">Test Content</div>
      </InformationModal>
    );

    // Check if the dialog is not rendered
    expect(screen.queryByTestId("dialog-component")).not.toBeInTheDocument();
  });

  it("calls onClose when close icon is clicked", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Find and click the close icon button
    const closeButton = screen.getByTestId("icon-button");
    fireEvent.click(closeButton);

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("hides close icon when hideIcon is true", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose} hideIcon={true}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the close icon is not rendered
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose} title="Modal Title">
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the title is rendered
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
  });

  it("applies titleId when provided", () => {
    render(
      <InformationModal
        open={true}
        onClose={mockOnClose}
        title="Modal Title"
        titleId="custom-title-id"
      >
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the title has the correct ID
    const titleElement = screen.getByTestId("typography-component");
    expect(titleElement).toHaveAttribute("id", "custom-title-id");
  });

  it("applies custom style when provided", () => {
    const customStyle = { width: "500px", height: "300px" };

    render(
      <InformationModal open={true} onClose={mockOnClose} style={customStyle}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the custom style is applied
    const dialogElement = screen.getByTestId("dialog-component");
    expect(dialogElement).toHaveStyle("width: 500px");
    expect(dialogElement).toHaveStyle("height: 300px");
  });

  it("applies custom maxWidth when provided", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose} maxWidth="xs">
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the maxWidth prop is passed correctly
    const dialogElement = screen.getByTestId("dialog-component");
    expect(dialogElement).toHaveAttribute("data-maxwidth", "xs");
  });

  it("uses default maxWidth when not provided", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the default maxWidth is used
    const dialogElement = screen.getByTestId("dialog-component");
    expect(dialogElement).toHaveAttribute("data-maxwidth", "lg");
  });

  it("sets fullWidth prop to true", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if fullWidth is set to true
    const dialogElement = screen.getByTestId("dialog-component");
    expect(dialogElement).toHaveAttribute("data-fullwidth", "true");
  });

  it("sets correct aria-label for close button", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if the close button has the correct aria-label
    const closeButton = screen.getByTestId("icon-button");
    expect(closeButton).toHaveAttribute("aria-label", "Close modal");
  });

  it("renders DialogContent with correct padding", () => {
    render(
      <InformationModal open={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </InformationModal>
    );

    // Check if DialogContent has the correct padding
    const dialogContent = screen.getByTestId("dialog-content");
    expect(dialogContent).toHaveStyle("padding: 4");
  });
});
