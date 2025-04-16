import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomDrawer } from "../../modals/CustomDrawer";
import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock("@mui/material", () => {
    const actual = jest.requireActual("@mui/material");
    return {
        ...actual,
        useTheme: () => ({
            palette: {
                background: { paper: "#ffffff" },
                action: { active: "#000000" },
            },
        }),
    };
});

jest.mock("../../Skeletons/SkeletonFieldContainer", () => ({
    __esModule: true,
    default: () => <div data-testid="skeleton-field-container">Skeleton</div>,
}));

describe("CustomDrawer Component", () => {
    const onCloseMock = jest.fn();

    beforeEach(() => {
        onCloseMock.mockClear();
    });

    it("renders children when loading is false", () => {
        render(
            <CustomDrawer open={true} onClose={onCloseMock} loading={false}>
                <div data-testid="child-content">Content</div>
            </CustomDrawer>
        );
        expect(screen.getByTestId("child-content")).toBeInTheDocument();
        expect(screen.queryByTestId("skeleton-field-container")).toBeNull();
    });

    it("renders SkeletonFieldContainer when loading is true", () => {
        render(
            <CustomDrawer open={true} onClose={onCloseMock} loading={true}>
                <div data-testid="child-content">Content</div>
            </CustomDrawer>
        );
        expect(screen.getByTestId("skeleton-field-container")).toBeInTheDocument();
        expect(screen.queryByTestId("child-content")).toBeNull();
    });

    it("does not render CustomDrawer when open is false", () => {
        render(
            <CustomDrawer open={false} onClose={onCloseMock} loading={false}>
                <div data-testid="child-content">Content</div>
            </CustomDrawer>
        );
        expect(screen.queryByTestId("child-content")).toBeNull();
        expect(screen.queryByTestId("skeleton-field-container")).toBeNull();
    });

    it("calls onClose when the close button is clicked", () => {
        render(
            <CustomDrawer open={true} onClose={onCloseMock} loading={false}>
                <div data-testid="child-content">Content</div>
            </CustomDrawer>
        );
        const allButtons = screen.getAllByRole("button", { hidden: true } as any);
        const closeButton = allButtons.find((btn) => btn.getAttribute("aria-label") === "ariaLabels.close");
        if (!closeButton) {
            throw new Error("Close button not found");
        }
        fireEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalled();
    });
});