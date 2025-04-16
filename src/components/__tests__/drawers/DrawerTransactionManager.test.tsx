import React from "react";
import { render, screen } from "@testing-library/react";
import DrawerDetail from "../../drawers/DrawerTransactionManager";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../modals/CustomDrawer", () => ({
  CustomDrawer: ({ open, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) =>
    open ? <div data-testid="custom-drawer">{children}</div> : null,
}));

describe("DrawerTransactionManager", () => {
  const toggleDrawer = jest.fn();

  it("renders the manager modal content when drawstate is true", () => {
    render(<DrawerDetail drawstate={true} toggleDrawer={toggleDrawer} />);
    const drawer = screen.getByTestId("custom-drawer");
    expect(drawer).toBeInTheDocument();
    expect(screen.getByText("paypalPage.managerModal.title")).toBeInTheDocument();
    expect(screen.getByText("paypalPage.managerModal.body")).toBeInTheDocument();
  });

  it("does not render anything when drawstate is false", () => {
    render(<DrawerDetail drawstate={false} toggleDrawer={toggleDrawer} />);
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });
});