import React from "react";
import { render, screen } from "@testing-library/react";
import DrawerDetail from "../../drawers/DrawerDetail";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock("../../modals/CustomDrawer", () => ({
  CustomDrawer: ({
    open,
    children
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div data-testid="custom-drawer">{children}</div> : null)
}));

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        info: { main: "#123456" },
        background: { default: "white" }
      }
    })
  };
});

describe("DrawerDetail", () => {
  const toggleDrawer = jest.fn();

  it("does not render CustomDrawer when drawstate is false", () => {
    render(<DrawerDetail drawstate={false} toggleDrawer={toggleDrawer} />);
    expect(screen.queryByTestId("custom-drawer")).toBeNull();
  });
});
