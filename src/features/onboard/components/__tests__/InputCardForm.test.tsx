import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InputCardForm } from "../InputCardForm";
import { InputCardFormFields } from "../../models";
import "@testing-library/jest-dom";

describe("InputCardForm", () => {
  const defaultProps = {
    loading: false,
    onSubmit: jest.fn(),
    onCancel: jest.fn()
  };

  const fillAndSubmitForm = async (
    fields: Partial<InputCardFormFields> = {}
  ) => {
    const number = fields.number ?? "4111 1111 1111 1111";
    const name = fields.name ?? "Mario Rossi";
    const expirationDate = fields.expirationDate ?? "12/30";
    const cvv = fields.cvv ?? "123";

    fireEvent.change(screen.getByLabelText(/number/i), {
      target: { value: number }
    });
    fireEvent.change(screen.getByLabelText(/expirationDate/i), {
      target: { value: expirationDate }
    });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: cvv } });
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: name }
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  };

  it("renders all fields", () => {
    render(<InputCardForm {...defaultProps} />);
    expect(screen.getByLabelText(/number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expirationDate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("submits valid data", async () => {
    render(<InputCardForm {...defaultProps} />);
    await fillAndSubmitForm();

    await waitFor(() =>
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        {
          name: "Mario Rossi",
          number: "4111111111111111",
          expirationDate: "12/30",
          cvv: "123"
        },
        expect.any(Object)
      )
    );
  });

  it("shows different CVV label for Amex", async () => {
    render(<InputCardForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/number/i), {
      target: { value: "3782 822463 10005" }
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/CID/i)).toBeInTheDocument();
    });
  });

  it("prevents invalid number input (non-digits)", () => {
    render(<InputCardForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/number/i), {
      target: { value: "abcd" }
    });

    expect(screen.getByLabelText(/number/i)).toHaveValue("");
  });
});
