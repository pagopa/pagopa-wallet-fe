import createBuildInstance from "../buildConfig";
import { NpgFlowState } from "../../features/onboard/models/npgModel";
import { IdFields } from "../../features/onboard/components/types";
import { NpgEvtDataErroCode } from "../../features/onboard/models/npgModel";

const mockBuildConfig = {
  onChange: jest.fn(),
  onReadyForPayment: jest.fn(),
  onPaymentComplete: jest.fn(),
  onPaymentRedirect: jest.fn(),
  onBuildError: jest.fn(),
  onAllFieldsLoaded: jest.fn()
};

describe("BuildConfigHandler Module", () => {
  // eslint-disable-next-line functional/no-let
  let instance: ReturnType<typeof createBuildInstance>;

  beforeEach(() => {
    mockBuildConfig.onChange.mockClear();
    mockBuildConfig.onReadyForPayment.mockClear();
    mockBuildConfig.onPaymentComplete.mockClear();
    mockBuildConfig.onPaymentRedirect.mockClear();
    mockBuildConfig.onBuildError.mockClear();
    mockBuildConfig.onAllFieldsLoaded.mockClear();
    instance = createBuildInstance(mockBuildConfig);
  });

  describe("onBuildSuccess", () => {
    it("should call onChange with valid field status", () => {
      const evtData = {
        id: IdFields.CARD_NUMBER,
        errorCode: NpgEvtDataErroCode.HF0001,
        errorMessage: "error occurred"
      };
      instance.onBuildSuccess(evtData);
      expect(mockBuildConfig.onChange).toHaveBeenCalledWith(
        IdFields.CARD_NUMBER,
        {
          isValid: true,
          errorCode: null,
          errorMessage: null
        }
      );
    });
  });

  describe("onBuildError", () => {
    it("should call onChange with invalid field status", () => {
      const evtData = {
        id: IdFields.CARD_NUMBER,
        errorCode: NpgEvtDataErroCode.HF0001,
        errorMessage: "error occurred"
      };
      instance.onBuildError(evtData);
      expect(mockBuildConfig.onChange).toHaveBeenCalledWith(
        IdFields.CARD_NUMBER,
        {
          isValid: false,
          errorCode: "HF0001",
          errorMessage: "error occurred"
        }
      );
    });
  });

  describe("onConfirmError", () => {
    it("should call onBuildError callback", () => {
      const evtData = {
        id: IdFields.CARD_NUMBER,
        errorCode: NpgEvtDataErroCode.HF0001,
        errorMessage: "error occurred"
      };
      instance.onConfirmError(evtData);
      expect(mockBuildConfig.onBuildError).toHaveBeenCalled();
    });
  });

  describe("onBuildFlowStateChange", () => {
    const mockEvtData = { data: { url: "http://redirect.com" } };

    it("should call onReadyForPayment when state is READY_FOR_PAYMENT", () => {
      instance.onBuildFlowStateChange(
        mockEvtData,
        NpgFlowState.READY_FOR_PAYMENT
      );
      expect(mockBuildConfig.onReadyForPayment).toHaveBeenCalled();
    });

    it("should call onPaymentComplete when state is PAYMENT_COMPLETE", () => {
      instance.onBuildFlowStateChange(
        mockEvtData,
        NpgFlowState.PAYMENT_COMPLETE
      );
      expect(mockBuildConfig.onPaymentComplete).toHaveBeenCalled();
    });

    it("should call onPaymentRedirect with the url when state is REDIRECTED_TO_EXTERNAL_DOMAIN", () => {
      instance.onBuildFlowStateChange(
        mockEvtData,
        NpgFlowState.REDIRECTED_TO_EXTERNAL_DOMAIN
      );
      expect(mockBuildConfig.onPaymentRedirect).toHaveBeenCalledWith(
        "http://redirect.com"
      );
    });

    it("should call onBuildError for an unknown state", () => {
      instance.onBuildFlowStateChange(mockEvtData, "UNKNOWN_STATE" as any);
      expect(mockBuildConfig.onBuildError).toHaveBeenCalled();
    });
  });

  describe("onAllFieldsLoaded", () => {
    it("should be identical to the passed onAllFieldsLoaded callback", () => {
      expect(instance.onAllFieldsLoaded).toBe(
        mockBuildConfig.onAllFieldsLoaded
      );
      instance.onAllFieldsLoaded();
      expect(mockBuildConfig.onAllFieldsLoaded).toHaveBeenCalled();
    });
  });

  describe("CSS path and default CSS classes", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalLocation = window.location;
    beforeEach(() => {
      // eslint-disable-next-line functional/immutable-data
      Object.defineProperty(window, "location", {
        value: {
          protocol: "https:",
          hostname: "example.com",
          port: "3000"
        },
        writable: true
      });
    });
    afterEach(() => {
      // eslint-disable-next-line functional/immutable-data
      process.env.NODE_ENV = originalEnv;
      // eslint-disable-next-line functional/immutable-data
      Object.defineProperty(window, "location", {
        value: originalLocation
      });
    });

    it("should compute cssLink with port in development", () => {
      // eslint-disable-next-line functional/immutable-data
      process.env.NODE_ENV = "development";
      const inst = createBuildInstance(mockBuildConfig);
      expect(inst.cssLink).toBe("https://example.com:3000/npg/style.css");
    });

    it("should compute cssLink without port in production", () => {
      // eslint-disable-next-line functional/immutable-data
      process.env.NODE_ENV = "production";
      const inst = createBuildInstance(mockBuildConfig);
      expect(inst.cssLink).toBe("https://example.com/npg/style.css");
    });

    it("should have correct default component and container CSS class names", () => {
      expect(instance.defaultComponentCssClassName).toBe("npg-component");
      expect(instance.defaultContainerCssClassName).toBe("npg-container");
    });
  });
});
