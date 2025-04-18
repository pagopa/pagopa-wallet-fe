import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextFormField from "../../commons/TextFormField";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe("TextFormField", () => {
  const handleChange = jest.fn();
  const handleBlur = jest.fn();

  const defaultProps = {
    fullWidth: true,
    errorText: undefined,
    error: false,
    label: "Test Label",
    id: "test-field",
    type: "text",
    handleChange,
    handleBlur,
    autoComplete: "on"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the provided label and default variant", () => {
    render(<TextFormField {...defaultProps} />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toBeInTheDocument();
  });

  it("renders helper text when errorText is provided and error is true", () => {
    const props = {
      ...defaultProps,
      errorText: "Error message",
      error: true
    };
    render(<TextFormField {...props} />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("calls handleChange when text is entered", () => {
    render(<TextFormField {...defaultProps} />);
    const input = screen.getByLabelText("Test Label");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("calls handleBlur when input loses focus", () => {
    render(<TextFormField {...defaultProps} />);
    const input = screen.getByLabelText("Test Label");
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it("renders startAdornment and endAdornment when provided", () => {
    const start = <span data-testid="start">start</span>;
    const end = <span data-testid="end">end</span>;
    const props = {
      ...defaultProps,
      startAdornment: start,
      endAdornment: end
    };
    render(<TextFormField {...props} />);
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("applies disabled and readOnly properties", () => {
    const props = {
      ...defaultProps,
      disabled: true,
      readOnly: true
    };
    render(<TextFormField {...props} />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("readOnly");
  });
});
