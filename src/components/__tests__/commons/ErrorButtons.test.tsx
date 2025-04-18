import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ErrorButtons } from "../../commons/ErrorButtons";
import { ErrorModalBtn } from "../../../utils/errors/errorsModel";
import { useSmallDevice } from "../../../hooks/useSmallDevice";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock("../../../hooks/useSmallDevice", () => ({
  useSmallDevice: jest.fn()
}));

describe("ErrorButtons Component", () => {
  const handleCloseMock = jest.fn();
  const dummyAction = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls handleClose when button action is undefined", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(false);
    const buttonsDetail: Array<ErrorModalBtn> = [
      { title: "buttonClose", action: undefined }
    ];

    render(
      <ErrorButtons
        handleClose={handleCloseMock}
        buttonsDetail={buttonsDetail}
      />
    );

    const button = screen.getByRole("button", { name: /buttonClose/i });
    fireEvent.click(button);
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it("calls the provided custom action when available", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(false);
    const buttonsDetail: Array<ErrorModalBtn> = [
      { title: "buttonAction", action: dummyAction }
    ];

    render(
      <ErrorButtons
        handleClose={handleCloseMock}
        buttonsDetail={buttonsDetail}
      />
    );

    const button = screen.getByRole("button", { name: /buttonAction/i });
    fireEvent.click(button);
    expect(dummyAction).toHaveBeenCalled();
    expect(handleCloseMock).not.toHaveBeenCalled();
  });

  it("applies small device inline style when useSmallDevice returns true", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(true);
    const buttonsDetail: Array<ErrorModalBtn> = [
      { title: "smallDeviceTest", action: undefined }
    ];

    render(
      <ErrorButtons
        handleClose={handleCloseMock}
        buttonsDetail={buttonsDetail}
      />
    );

    const button = screen.getByRole("button", { name: /smallDeviceTest/i });
    expect(button.parentElement).toHaveStyle("padding-top: 16px");
  });

  it("uses text variant for the first button and contained for subsequent buttons", () => {
    (useSmallDevice as jest.Mock).mockReturnValue(false);

    const buttonsDetail: Array<ErrorModalBtn> = [
      { title: "firstBtn" },
      { title: "secondBtn" }
    ];

    render(
      <ErrorButtons
        handleClose={handleCloseMock}
        buttonsDetail={buttonsDetail}
      />
    );

    const [btn0, btn1] = screen.getAllByRole("button");
    expect(btn0).toBeInTheDocument();
    expect(btn1).toBeInTheDocument();
    expect(btn0).toHaveClass("MuiButton-text");
    expect(btn1).toHaveClass("MuiButton-contained");
  });
});
