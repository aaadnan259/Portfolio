import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Experience from "@/components/Experience";

// vi.hoisted() ensures these values are initialized before vi.mock() is hoisted
// to the top of the file by vitest. Using a plain const would cause a
// "Cannot access before initialization" ReferenceError.
const mockExperiences = vi.hoisted(() => [
    {
        title: "Software Engineer",
        company: "Test Corp",
        location: "Remote",
        date: "2023 – Present",
        description: ["Built things.", "Fixed stuff."],
        icon: () => null,
        logo: "/images/test.webp",
    },
    {
        title: "B.S. Computer Science",
        company: "Test University",
        location: "Columbus, OH",
        date: "Graduated: May 2023",
        description: ["GPA: 4.0"],
        icon: () => null,
        logo: "/images/test-uni.webp",
    },
]);

vi.mock("@/data/portfolio", () => ({
    experiences: mockExperiences,
}));

vi.mock("next/image", () => ({
    default: ({ src, alt }: { src: string; alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
    ),
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div {...props}>{children}</div>
        ),
    },
}));

describe("Experience Component", () => {
    it("renders the section heading", () => {
        render(<Experience />);
        expect(screen.getByText("Experience & Education")).toBeDefined();
    });

    it("renders all experience entries", () => {
        render(<Experience />);
        expect(screen.getByText("Software Engineer")).toBeDefined();
        expect(screen.getByText("B.S. Computer Science")).toBeDefined();
    });

    it("renders company and location for each entry", () => {
        render(<Experience />);
        expect(screen.getByText("Test Corp | Remote")).toBeDefined();
        expect(
            screen.getByText("Test University | Columbus, OH")
        ).toBeDefined();
    });

    it("renders date badges", () => {
        render(<Experience />);
        expect(screen.getByText("2023 – Present")).toBeDefined();
        expect(screen.getByText("Graduated: May 2023")).toBeDefined();
    });

    it("renders description bullet points", () => {
        render(<Experience />);
        expect(screen.getByText("Built things.")).toBeDefined();
        expect(screen.getByText("Fixed stuff.")).toBeDefined();
        expect(screen.getByText("GPA: 4.0")).toBeDefined();
    });

    it("renders logo images when provided", () => {
        render(<Experience />);
        const images = screen.getAllByRole("img");
        expect(images.length).toBeGreaterThan(0);
    });
});
