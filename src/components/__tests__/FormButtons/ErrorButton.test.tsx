import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorButton } from "../../FormButtons/ErrorButton";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock("../../../hooks/useSmallDevice", () => ({
  useSmallDevice: jest.fn()
}));

import { useSmallDevice } from "../../../hooks/useSmallDevice";

describe("ErrorButton Component", () => {
  const handleCloseMock = jest.fn();
  const dummyAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a button for each item in buttonsDetail and applies correct variant", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(false);
    const buttonsDetail = [
      { title: "button1", action: undefined },
      { title: "button2", action: dummyAction }
    ];
    render(<ErrorButton handleClose={handleCloseMock} buttonsDetail={buttonsDetail} />);
    const buttons = screen.getAllByRole("button", { name: /button/i });
    expect(buttons).toHaveLength(2);
  });

  it("calls handleClose for button with undefined action", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(false);
    const buttonsDetail = [{ title: "buttonClose", action: undefined }];
    render(<ErrorButton handleClose={handleCloseMock} buttonsDetail={buttonsDetail} />);
    const button = screen.getByRole("button", { name: /buttonClose/i });
    fireEvent.click(button);
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it("calls custom action if provided", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(false);
    const buttonsDetail = [{ title: "buttonAction", action: dummyAction }];
    render(<ErrorButton handleClose={handleCloseMock} buttonsDetail={buttonsDetail} />);
    const button = screen.getByRole("button", { name: /buttonAction/i });
    fireEvent.click(button);
    expect(dummyAction).toHaveBeenCalled();
    expect(handleCloseMock).not.toHaveBeenCalled();
  });

  it("applies paddingTop style when useSmallDevice returns true", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(true);
    const buttonsDetail = [{ title: "buttonStyle", action: undefined }];
    const { container } = render(<ErrorButton handleClose={handleCloseMock} buttonsDetail={buttonsDetail} />);
    const gridItem = container.querySelector('[style*="padding-top"]');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveStyle("padding-top: 0px");
  });
});