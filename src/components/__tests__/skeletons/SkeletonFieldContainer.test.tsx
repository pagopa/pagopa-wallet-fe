import React from "react";
import { render } from "@testing-library/react";
import SkeletonFieldContainer from "../../Skeletons/SkeletonFieldContainer";
import "@testing-library/jest-dom";

describe("SkeletonFieldContainer", () => {
  it("renders three Skeleton components", () => {
    const { container } = render(<SkeletonFieldContainer />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBe(3);
  });

  it("merges custom sx prop with default style", () => {
    const customSx = { backgroundColor: "red" };
    const { container } = render(<SkeletonFieldContainer sx={customSx} />);
    expect(container.firstChild).toHaveStyle("background-color: red");
  });

  it("renders the expected layout structure", () => {
    const { container } = render(<SkeletonFieldContainer />);
    const outerBox = container.firstChild;
    expect(outerBox).toBeDefined();
    expect(outerBox?.childNodes.length).toBe(2);
    const contentBox = outerBox?.childNodes[0] as HTMLElement;
    expect(contentBox).toBeDefined();
    const nestedBox = contentBox.childNodes[0] as HTMLElement;
    expect(nestedBox).toBeDefined();
    const typographies = nestedBox.querySelectorAll("div.MuiTypography-root");
    expect(typographies.length).toBeGreaterThanOrEqual(2);
  });
});