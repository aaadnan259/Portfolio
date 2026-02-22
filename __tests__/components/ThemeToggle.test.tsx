import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ThemeToggle from "@/components/ThemeToggle";

// Mock next-themes
const mockSetTheme = vi.fn();
// We use a mutable mock function that returns the hook result
const mockUseTheme = vi.fn();

vi.mock("next-themes", () => ({
    useTheme: () => mockUseTheme(),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
    Sun: () => <div data-testid="sun-icon" />,
    Moon: () => <div data-testid="moon-icon" />,
}));

describe("ThemeToggle Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation
        mockUseTheme.mockReturnValue({
            theme: "light",
            setTheme: mockSetTheme,
        });
    });

    it("renders the toggle button with correct aria-label", async () => {
        render(<ThemeToggle />);
        // Use findByRole to wait for the component to mount (useEffect)
        const button = await screen.findByRole("button", { name: /toggle theme/i });
        expect(button).toBeDefined();
    });

    it("renders Moon icon when theme is light", async () => {
        mockUseTheme.mockReturnValue({
            theme: "light",
            setTheme: mockSetTheme,
        });
        render(<ThemeToggle />);
        // Wait for mount
        expect(await screen.findByTestId("moon-icon")).toBeDefined();
        expect(screen.queryByTestId("sun-icon")).toBeNull();
    });

    it("renders Sun icon when theme is dark", async () => {
        mockUseTheme.mockReturnValue({
            theme: "dark",
            setTheme: mockSetTheme,
        });
        render(<ThemeToggle />);
        // Wait for mount
        expect(await screen.findByTestId("sun-icon")).toBeDefined();
        expect(screen.queryByTestId("moon-icon")).toBeNull();
    });

    it("toggles theme from light to dark on click", async () => {
        mockUseTheme.mockReturnValue({
            theme: "light",
            setTheme: mockSetTheme,
        });
        render(<ThemeToggle />);

        // Wait for mount
        const button = await screen.findByRole("button", { name: /toggle theme/i });
        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("toggles theme from dark to light on click", async () => {
        mockUseTheme.mockReturnValue({
            theme: "dark",
            setTheme: mockSetTheme,
        });
        render(<ThemeToggle />);

        // Wait for mount
        const button = await screen.findByRole("button", { name: /toggle theme/i });
        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
});
