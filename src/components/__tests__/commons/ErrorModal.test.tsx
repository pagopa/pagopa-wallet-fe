import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorModal from "../../commons/ErrorModal";
import "@testing-library/jest-dom";
import { ErrorsType } from "../../../utils/errors/errorsModel";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock("../../../utils/errors/errorsModel", () => ({
  ErrorsType: {
    CUSTOM_ERROR: "CUSTOM_ERROR",
    CUSTOM_NO_BUTTONS: "CUSTOM_NO_BUTTONS",
    STATUS_ERROR: "STATUS_ERROR",
    TIMEOUT: "TIMEOUT",
    POLLING_SLOW: "POLLING_SLOW",
    DETAIL_ERROR: "DETAIL_ERROR",
    NO_DETAIL_ERROR: "NO_DETAIL_ERROR",
    NON_EXISTENT: "NON_EXISTENT",
    UNKNOWN_CATEGORY_ERROR: "UNKNOWN_CATEGORY_ERROR"
  },
  WalletErrors: {
    CUSTOM_ERROR: {
      category: "CUSTOM",
      title: "Custom Title",
      body: "Custom Body",
      buttons: [{ title: "Custom Button", action: jest.fn() }]
    },
    CUSTOM_NO_BUTTONS: {
      category: "CUSTOM",
      title: "No Buttons Title",
      body: "No Buttons Body"
    },
    STATUS_ERROR: {
      category: "ANOTHER_CATEGORY",
      title: "Status Title",
      body: "Status Body",
      buttons: [{ title: "Status First" }, { title: "Status Second" }]
    },
    TIMEOUT: {
      category: "SOME_CATEGORY",
      title: "Timeout Title",
      body: "Timeout Body",
      buttons: [{ title: "Timeout Button" }, { title: "Retry" }]
    },
    POLLING_SLOW: {
      category: "SOME_CATEGORY",
      title: "Polling Slow Title",
      body: "Polling Slow Body",
      buttons: undefined
    },
    DETAIL_ERROR: {
      category: "SOME_CATEGORY",
      title: "Detail Title",
      body: "Detail Body",
      buttons: [{ title: "Detail Button" }]
    },
    NO_DETAIL_ERROR: {
      category: "NO_DETAIL_CATEGORY",
      title: "No Detail Title",
      body: "No Detail Body",
      buttons: [{ title: "No Detail Button" }]
    },
    UNKNOWN_CATEGORY_ERROR: {
      category: "UNKNOWN_CATEGORY",
      title: "Unknown Title",
      body: "Unknown Body",
      buttons: [{ title: "Unknown Button" }]
    }
  },
  WalletFaultCategory: {
    CUSTOM: "CUSTOM",
    NOT_LISTED: "NOT_LISTED",
    SOME_CATEGORY: "SOME_CATEGORY",
    ANOTHER_CATEGORY: "ANOTHER_CATEGORY",
    NO_DETAIL_CATEGORY: "NO_DETAIL_CATEGORY",
    UNKNOWN_CATEGORY: "UNKNOWN_CATEGORY"
  },
  ErrorModalByErrorCategory: {
    CUSTOM: {
      title: "Fallback Custom Title",
      body: "Fallback Custom Body",
      buttons: [{ title: "Fallback Custom Button" }]
    },
    NOT_LISTED: {
      title: "Not Listed Title",
      body: "Not Listed Body",
      buttons: [{ title: "Not Listed Button" }]
    },
    SOME_CATEGORY: {
      title: "Some Category Title",
      body: "Some Category Body",
      buttons: [{ title: "Some Category Button" }],
      detail: "exists"
    },
    ANOTHER_CATEGORY: {
      title: "Another Title",
      body: "Another Body",
      buttons: [{ title: "Status First" }, { title: "Status Second" }]
    },
    NO_DETAIL_CATEGORY: {
      title: "NoDetail Category Title",
      body: "NoDetail Error Body",
      buttons: [{ title: "No Detail Button" }]
    }
  }
}));

/* eslint-disable functional/immutable-data */
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
});

describe("ErrorModal Component", () => {
  const onCloseMock = jest.fn();
  const onRetryMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a custom error properly", () => {
    render(
      <ErrorModal
        error={"CUSTOM_ERROR" as ErrorsType}
        open={true}
        onClose={onCloseMock}
      />
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Body")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Custom Button/i })
    ).toBeInTheDocument();
  });

  it("renders a not-listed error properly", () => {
    render(
      <ErrorModal
        error={"NON_EXISTENT" as ErrorsType}
        open={true}
        onClose={onCloseMock}
      />
    );
    expect(screen.getByText("Not Listed Title")).toBeInTheDocument();
    expect(screen.getByText("Not Listed Body")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Not Listed Button/i })
    ).toBeInTheDocument();
  });

  it("renders a progress bar for POLLING_SLOW and omits buttons", () => {
    render(
      <ErrorModal
        error={"POLLING_SLOW" as ErrorsType}
        open={true}
        onClose={onCloseMock}
      />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Some Category Button/i })
    ).toBeNull();
  });

  it("shows detail alert and error buttons for DETAIL_ERROR", () => {
    render(
      <ErrorModal
        error={"DETAIL_ERROR" as ErrorsType}
        open={true}
        onClose={onCloseMock}
      />
    );
    expect(screen.getByText("Some Category Title")).toBeInTheDocument();
    expect(screen.getByText("ErrorCodeDescription")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("DETAIL_ERROR")).toBeInTheDocument();
  });

  it("maps the second button to onRetry if error is STATUS_ERROR", () => {
    render(
      <ErrorModal
        error={"STATUS_ERROR" as ErrorsType}
        open={true}
        onClose={onCloseMock}
        onRetry={onRetryMock}
      />
    );
    expect(screen.getByText("Another Title")).toBeInTheDocument();
    expect(screen.queryByText("ErrorCodeDescription")).toBeNull();
    const btns = screen.getAllByRole("button");
    const retryButton = btns.find((btn) =>
      btn.textContent?.includes("Status Second")
    );
    expect(retryButton).toBeDefined();
    if (retryButton) {
      fireEvent.click(retryButton);
    }
    expect(onRetryMock).toHaveBeenCalled();
  });

  it("handles the copy action in the detail Alert", () => {
    render(
      <ErrorModal
        error={"TIMEOUT" as ErrorsType}
        open={true}
        onClose={onCloseMock}
        onRetry={onRetryMock}
      />
    );
    const copyButton = screen.getByRole("button", { name: /clipboard.copy/i });
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("TIMEOUT");
    fireEvent.mouseLeave(copyButton);
    expect(copyButton).toHaveTextContent("clipboard.copy");
  });

  it("calls stopPropagation on tooltip mouseOver", () => {
    const stopPropagationMock = jest.fn();
    render(
      <ErrorModal
        error={"TIMEOUT" as ErrorsType}
        open
        onClose={onCloseMock}
        onRetry={onRetryMock}
      />
    );

    const tooltipTrigger = screen.getByRole("button", {
      name: /clipboard.copy/i
    });

    const mouseOverEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true
    });
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(mouseOverEvent, "stopPropagation", {
      value: stopPropagationMock
    });

    fireEvent(tooltipTrigger, mouseOverEvent);
    expect(stopPropagationMock).toHaveBeenCalled();
  });

  it("uses fallback custom buttons when a custom error has no buttons", () => {
    render(
      <ErrorModal
        error={"CUSTOM_NO_BUTTONS" as ErrorsType}
        open
        onClose={onCloseMock}
      />
    );
    expect(
      screen.getByRole("button", { name: /Fallback Custom Button/i })
    ).toBeInTheDocument();
  });

  it("returns fallback body for a non-detailed, listed error", () => {
    render(
      <ErrorModal
        error={"NO_DETAIL_ERROR" as ErrorsType}
        open
        onClose={onCloseMock}
      />
    );
    expect(screen.getByText("NoDetail Error Body")).toBeInTheDocument();
  });

  it("triggers tooltip stopPropagation on mouse over", () => {
    const stopPropagationMock = jest.fn();
    render(
      <ErrorModal
        error={"TIMEOUT" as ErrorsType}
        open
        onClose={onCloseMock}
        onRetry={onRetryMock}
      />
    );
    const copyButton = screen.getByRole("button", { name: /clipboard.copy/i });
    const mouseOverEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true
    });
    /* eslint-disable functional/immutable-data */
    Object.defineProperty(mouseOverEvent, "stopPropagation", {
      value: stopPropagationMock
    });
    fireEvent(copyButton, mouseOverEvent);
    expect(stopPropagationMock).toHaveBeenCalled();
  });
});
