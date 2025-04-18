import React from "react";
import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "../../commons/Layout";
import "@testing-library/jest-dom";

describe("Layout component", () => {
  const theme = createTheme({
    palette: {
      background: {
        paper: "#f0f0f0"
      },
      europeanUnion: {
        main: "#003399"
      },
      primaryAction: {
        active: "true"
      },
      negative: {
        main: "#d32f2f"
      },
      indigo: {
        main: "#3f51b5"
      }
    }
  });

  it("renders children inside the Container", () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div data-testid="child">Hello Layout</div>
        </Layout>
      </ThemeProvider>
    );
    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Hello Layout");
  });

  it("applies provided sx props to the Container", () => {
    const customSx = { backgroundColor: "red" };
    render(
      <ThemeProvider theme={theme}>
        <Layout sx={customSx}>
          <div data-testid="child">Content</div>
        </Layout>
      </ThemeProvider>
    );
    const containerElement = screen.getByTestId("child").parentElement;
    expect(containerElement).toHaveStyle("background-color: red");
  });

  it("applies the correct layout styles based on the theme", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Layout>
          <div data-testid="child">Test</div>
        </Layout>
      </ThemeProvider>
    );
    const outerBox = container.firstChild;
    expect(outerBox).toHaveStyle("height: 100vh");
    expect(outerBox).toHaveStyle(
      `background: ${theme.palette.background.paper}`
    );
  });
});
