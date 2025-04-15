import {
  onBrowserUnload,
  onBrowserBackEvent,
  clearNavigationEvents
} from "../eventListener";

describe("eventListener", () => {
  describe("onBrowserUnload", () => {
    it("should call preventDefault and set e.returnValue to an empty string", () => {
      const preventDefault = jest.fn();
      const event: any = { preventDefault, returnValue: "initial" };

      const result = onBrowserUnload(event);

      expect(preventDefault).toHaveBeenCalled();
      expect(event.returnValue).toBe("");
      expect(result).toBe("");
    });
  });

  describe("onBrowserBackEvent", () => {
    it("should call preventDefault and push state with the current path", () => {
      const preventDefault = jest.fn();
      const event: any = { preventDefault };
      const pushStateSpy = jest
        .spyOn(window.history, "pushState")
        .mockImplementation(() => {});

      onBrowserBackEvent(event);

      expect(preventDefault).toHaveBeenCalled();
      expect(pushStateSpy).toHaveBeenCalledWith(null, "", window.location.pathname);
      pushStateSpy.mockRestore();
    });
  });

  describe("clearNavigationEvents", () => {
    it("should remove popstate and beforeunload event listeners", () => {
      const removeSpy = jest.spyOn(window, "removeEventListener");

      clearNavigationEvents();

      expect(removeSpy).toHaveBeenCalledWith("popstate", onBrowserBackEvent);
      expect(removeSpy).toHaveBeenCalledWith("beforeunload", onBrowserUnload);
      removeSpy.mockRestore();
    });
  });
});