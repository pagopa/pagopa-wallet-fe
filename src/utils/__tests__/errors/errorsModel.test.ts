import {
  ErrorsType,
  WalletFaultCategory,
  ErrorModalByErrorCategory,
  WalletErrors
} from "../../errors/errorsModel";

const HELPDESK_URL = "https://www.pagopa.gov.it/it/helpdesk/";

describe("ErrorModalByErrorCategory", () => {
  let focusMock: jest.Mock;

  beforeEach(() => {
    focusMock = jest.fn();
    window.open = jest.fn(() => ({ focus: focusMock } as unknown as Window));
  });

  it("should have ERRORE_TECNICO defined with title, detail and 2 buttons", () => {
    const modal = ErrorModalByErrorCategory[WalletFaultCategory.ERRORE_TECNICO];
    expect(modal.title).toBe("ERRORE_TECNICO.title");
    expect(modal.detail).toBe(true);
    expect(modal.buttons).toHaveLength(2);
  });

  it("should execute help button action in ERRORE_TECNICO (window.open returns an object with focus)", () => {
    const modal = ErrorModalByErrorCategory[WalletFaultCategory.ERRORE_TECNICO];
    const helpButton = modal.buttons?.find(
      (b) => b.title === "errorButton.help"
    );
    expect(helpButton).toBeDefined();
    if (helpButton && helpButton.action) {
      helpButton.action();
    }
    expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
    expect(focusMock).toHaveBeenCalled();
  });

  it("should execute help button action in ERRORE_TECNICO when window.open returns null", () => {
    window.open = jest.fn(() => null);

    const modal = ErrorModalByErrorCategory[WalletFaultCategory.ERRORE_TECNICO];
    const helpButton = modal.buttons?.find(
      (b) => b.title === "errorButton.help"
    );
    expect(helpButton).toBeDefined();
    if (helpButton && helpButton.action) {
      helpButton.action();
    }
    expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
  });

  it("should have GENERIC_ERROR defined with proper title and buttons", () => {
    const modal = ErrorModalByErrorCategory[WalletFaultCategory.GENERIC_ERROR];
    expect(modal.title).toBe("ERRORE_GENERICO.title");
    expect(modal.buttons).toHaveLength(2);
  });

  it("should have NOT_LISTED defined with title, body, and buttons", () => {
    const modal = ErrorModalByErrorCategory[WalletFaultCategory.NOT_LISTED];
    expect(modal.title).toBe("NOT_LISTED.title");
    expect(modal.body).toBe("NOT_LISTED.body");
    expect(modal.buttons).toHaveLength(2);
  });
});

describe("WalletErrors", () => {
  let focusMock: jest.Mock;

  beforeEach(() => {
    focusMock = jest.fn();
    window.open = jest.fn(() => ({ focus: focusMock } as unknown as Window));
  });

  it("should map MISSING_SESSIONTOKEN to category ERRORE_TECNICO", () => {
    const errorMsg = WalletErrors[ErrorsType.MISSING_SESSIONTOKEN];
    expect(errorMsg.category).toBe(WalletFaultCategory.ERRORE_TECNICO);
  });

  it("should map TIMEOUT with proper title, body, category CUSTOM and buttons", () => {
    const errorMsg = WalletErrors[ErrorsType.TIMEOUT];
    expect(errorMsg.title).toBe("TIMEOUT.title");
    expect(errorMsg.body).toBe("TIMEOUT.body");
    expect(errorMsg.category).toBe(WalletFaultCategory.CUSTOM);
    expect(errorMsg.buttons).toBeDefined();
    if (errorMsg.buttons) {
      const helpButton = errorMsg.buttons.find(
        (b) => b.title === "errorButton.help"
      );
      expect(helpButton).toBeDefined();
      if (helpButton && helpButton.action) {
        helpButton.action();
        expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
        expect(focusMock).toHaveBeenCalled();
      }
    }
  });

  it("should map POLLING_SLOW with proper title, body and category CUSTOM", () => {
    const errorMsg = WalletErrors[ErrorsType.POLLING_SLOW];
    expect(errorMsg.title).toBe("POLLING_SLOW.title");
    expect(errorMsg.body).toBe("POLLING_SLOW.body");
    expect(errorMsg.category).toBe(WalletFaultCategory.CUSTOM);
  });

  it("should map STATUS_ERROR with proper title, body, category CUSTOM and buttons", () => {
    const errorMsg = WalletErrors[ErrorsType.STATUS_ERROR];
    expect(errorMsg.title).toBe("STATUS_ERROR.title");
    expect(errorMsg.body).toBe("STATUS_ERROR.body");
    expect(errorMsg.category).toBe(WalletFaultCategory.CUSTOM);
    expect(errorMsg.buttons).toHaveLength(2);
    if (errorMsg.buttons) {
      const helpButton = errorMsg.buttons.find(
        (b) => b.title === "errorButton.help"
      );
      expect(helpButton).toBeDefined();
      if (helpButton && helpButton.action) {
        window.open = jest.fn(() => null);
        helpButton.action();
        expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
      }
    }
  });

  it("should map GENERIC_ERROR to a message with category NOT_LISTED", () => {
    const errorMsg = WalletErrors[ErrorsType.GENERIC_ERROR];
    expect(errorMsg.category).toBe(WalletFaultCategory.NOT_LISTED);
  });

  describe("CUSTOM", () => {
    let focusMock: jest.Mock;

    beforeEach(() => {
      focusMock = jest.fn();
      window.open = jest.fn(() => ({ focus: focusMock } as unknown as Window));
    });

    it("should have the correct modal properties for CUSTOM", () => {
      const modal = ErrorModalByErrorCategory[WalletFaultCategory.CUSTOM];
      expect(modal.title).toBe("");
      expect(modal.detail).toBe(false);
      expect(modal.buttons).toHaveLength(2);
    });

    it("should call .focus() when help button is triggered (window.open returns a window)", () => {
      const modal = ErrorModalByErrorCategory[WalletFaultCategory.CUSTOM];
      const helpButton = modal.buttons?.find(
        (b) => b.title === "errorButton.help"
      );
      helpButton?.action?.();

      expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
      expect(focusMock).toHaveBeenCalled();
    });

    it("should NOT call .focus() when window.open returns null (CUSTOM)", () => {
      window.open = jest.fn(() => null);

      const modal = ErrorModalByErrorCategory[WalletFaultCategory.CUSTOM];
      const helpButton = modal.buttons?.find(
        (b) => b.title === "errorButton.help"
      );
      helpButton?.action?.();

      expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
    });
  });

  describe("GENERIC_ERROR", () => {
    let focusMock: jest.Mock;

    beforeEach(() => {
      focusMock = jest.fn();
      window.open = jest.fn(() => ({ focus: focusMock } as unknown as Window));
    });

    it("should have the correct modal properties for GENERIC_ERROR", () => {
      const modal =
        ErrorModalByErrorCategory[WalletFaultCategory.GENERIC_ERROR];
      expect(modal.title).toBe("ERRORE_GENERICO.title");
      expect(modal.detail).toBe(false);
      expect(modal.buttons).toHaveLength(2);
    });

    it("should call .focus() when help button is triggered (window.open returns a window)", () => {
      const modal =
        ErrorModalByErrorCategory[WalletFaultCategory.GENERIC_ERROR];
      const helpButton = modal.buttons?.find(
        (b) => b.title === "errorButton.help"
      );
      helpButton?.action?.();

      expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
      expect(focusMock).toHaveBeenCalled();
    });

    it("should NOT call .focus() when window.open returns null (GENERIC_ERROR)", () => {
      window.open = jest.fn(() => null);

      const modal =
        ErrorModalByErrorCategory[WalletFaultCategory.GENERIC_ERROR];
      const helpButton = modal.buttons?.find(
        (b) => b.title === "errorButton.help"
      );
      helpButton?.action?.();

      expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
    });
  });

  describe("NOT_LISTED", () => {
    let focusMock: jest.Mock;

    beforeEach(() => {
      focusMock = jest.fn();
      window.open = jest.fn(() => ({ focus: focusMock } as unknown as Window));
    });

    it("should have the correct modal properties for NOT_LISTED", () => {
      const modal = ErrorModalByErrorCategory[WalletFaultCategory.NOT_LISTED];
      expect(modal.title).toBe("NOT_LISTED.title");
      expect(modal.body).toBe("NOT_LISTED.body");
      expect(modal.detail).toBe(false);
      expect(modal.buttons).toHaveLength(2);
    });

    it("should call .focus() when help button is triggered (window.open returns a window)", () => {
      const modal = ErrorModalByErrorCategory[WalletFaultCategory.NOT_LISTED];
      const helpButton = modal.buttons?.find(
        (b) => b.title === "errorButton.help"
      );
      helpButton?.action?.();

      expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
      expect(focusMock).toHaveBeenCalled();
    });

    it("should NOT call .focus() when window.open returns null (NOT_LISTED)", () => {
      window.open = jest.fn(() => null);

      const modal = ErrorModalByErrorCategory[WalletFaultCategory.NOT_LISTED];
      const helpButton = modal.buttons?.find(
        (b) => b.title === "errorButton.help"
      );
      helpButton?.action?.();

      expect(window.open).toHaveBeenCalledWith(HELPDESK_URL, "_blank");
    });
  });
});

