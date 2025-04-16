import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormButtons } from "../../FormButtons/FormButtons";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe("FormButtons Component", () => {
  const handleSubmitMock = jest.fn();
  const handleCancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("SubmitButton variant", () => {
    const submitProps = {
      disabledSubmit: false,
      disabledCancel: true,
      submitTitle: "Submit",
      handleSubmit: handleSubmitMock,
      type: "button" as "button",
      handleCancel: handleCancelMock,
      cancelTitle: "Cancel"
    };

    it("renders only the submit button", () => {
      render(<FormButtons {...submitProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute("aria-label", "Submit");
    });

    it("calls handleSubmit on click", () => {
      render(<FormButtons {...submitProps} />);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleSubmitMock).toHaveBeenCalled();
    });

    it("displays loading state on submit button when loadingSubmit is true", () => {
        render(<FormButtons {...submitProps} loadingSubmit={true} />);
        const loadingButtons = screen
          .getAllByRole("button", { hidden: true })
          .filter((btn) => btn.getAttribute("aria-label") === "ariaLabels.loading");
        expect(loadingButtons.length).toBeGreaterThan(0);
        const button = loadingButtons[0];
        expect(button).toHaveTextContent("");
      });
  });

  describe("CancellableButtons variant", () => {
    const cancellableProps = {
      disabledSubmit: false,
      disabledCancel: false,
      submitTitle: "Submit",
      cancelTitle: "Cancel",
      handleSubmit: handleSubmitMock,
      handleCancel: handleCancelMock,
      type: "button" as "button"
    };

    it("renders both submit and cancel buttons", () => {
      render(<FormButtons {...cancellableProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("calls handleCancel when cancel button is clicked", () => {
      render(<FormButtons {...cancellableProps} />);
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);
      expect(handleCancelMock).toHaveBeenCalled();
    });

    it("displays loading state on cancel button when loadingCancel is true", () => {
        render(<FormButtons {...cancellableProps} loadingCancel={true} />);
        const loadingButtons = screen
          .getAllByRole("button", { hidden: true })
          .filter((btn) => btn.getAttribute("aria-label") === "ariaLabels.loading");
        expect(loadingButtons.length).toBeGreaterThan(0);
        const cancelButton = loadingButtons[0];
        expect(cancelButton).toHaveTextContent("");
      });
  });
});