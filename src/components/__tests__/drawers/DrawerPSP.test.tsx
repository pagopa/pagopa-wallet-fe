import React from "react";
import { render, screen } from "@testing-library/react";
import DrawerPSP from "../../drawers/DrawerPSP";
import "@testing-library/jest-dom";

jest.mock("../../../assets/icons/psp.svg", () => "pspIconMock");
jest.mock("../../../assets/icons/security.svg", () => "securityIconMock");
jest.mock("../../../assets/icons/tag.svg", () => "tagIconMock");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options && options.pspName ? `${key}-${options.pspName}` : key,
  }),
  Trans: ({ i18nKey, values }: { i18nKey: string; values: { maxFeeFriendlyComp: string } }) => (
    <div>{`${i18nKey}-${values.maxFeeFriendlyComp}`}</div>
  ),
}));

jest.mock("../../../utils", () => ({
  formatters: {
    moneyFormat: (fee: number) => `$${fee.toFixed(2)}`,
  },
}));

jest.mock("../../modals/CustomDrawer", () => ({
  CustomDrawer: ({ open, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) =>
    open ? <div data-testid="custom-drawer">{children}</div> : null,
}));

describe("DrawerPSP", () => {
  const toggleDrawer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders drawer content when pspName is provided", () => {
    render(
      <DrawerPSP
        drawstate={true}
        toggleDrawer={toggleDrawer}
        pspName="TestPSP"
        pspFee={1.23}
      />
    );
    expect(screen.getByTestId("custom-drawer")).toBeInTheDocument();
    expect(screen.getByText("paypalPage.pspInfoModal.title-TestPSP")).toBeInTheDocument();
    expect(screen.getByText("paypalPage.pspInfoModal.body1-TestPSP")).toBeInTheDocument();
    expect(screen.getByText("paypalPage.pspInfoModal.body2-$1.23")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "paypalPage.pspInfoModal.accessibilityLinkTitle" })
    ).toBeInTheDocument();
  });

  it("does not render anything when pspName is falsy", () => {
    render(
      <DrawerPSP
        drawstate={true}
        toggleDrawer={toggleDrawer}
        pspName=""
        pspFee={0}
      />
    );
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });
});