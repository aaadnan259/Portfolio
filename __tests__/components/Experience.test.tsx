import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Experience from "@/components/Experience";

// Mock data
const mockExperiences = [
    {
        title: "Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        date: "Jan 2022 - Present",
        description: ["Developed features", "Fixed bugs"],
        icon: () => <div data-testid="work-icon" />,
        logo: "/tech-corp-logo.png",
    },
    {
        title: "Student",
        company: "University of Science",
        location: "Boston, MA",
        date: "2018 - 2022",
        description: ["Studied CS"],
        icon: () => <div data-testid="edu-icon" />,
        logo: null,
    },
];

// Mock the portfolio data
vi.mock("@/data/portfolio", () => ({
    experiences: mockExperiences,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, className, ...props }: any) => (
            <div className={className} {...props}>
                {children}
            </div>
        ),
    },
}));

// Mock next/image
vi.mock("next/image", () => ({
    default: ({ src, alt, fill, ...props }: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    },
}));

describe("Experience Component", () => {
    it("renders the experience section heading", () => {
        render(<Experience />);
        expect(screen.getByText("Experience & Education")).toBeDefined();
    });

    it("renders all experience items from mocked data", () => {
        render(<Experience />);
        mockExperiences.forEach((exp) => {
            // Check for title
            expect(screen.getByText(exp.title)).toBeDefined();

            // Check for company and location
            const companyLocation = screen.getByText((content) =>
                content.includes(exp.company) && content.includes(exp.location)
            );
            expect(companyLocation).toBeDefined();
        });
    });

    it("renders experience details correctly (date and description)", () => {
        render(<Experience />);
        mockExperiences.forEach((exp) => {
            // Check for date
            expect(screen.getByText(exp.date)).toBeDefined();

            // Check for each description point
            exp.description.forEach((desc) => {
                expect(screen.getByText(desc)).toBeDefined();
            });
        });
    });

    it("renders the company logo when provided", () => {
        render(<Experience />);
        const expWithLogo = mockExperiences[0];
        const logo = screen.getByAltText(`${expWithLogo.company} logo`);
        expect(logo).toBeDefined();
        expect(logo.getAttribute("src")).toBe(expWithLogo.logo);
    });

    it("does not render logo when not provided", () => {
        render(<Experience />);
        const expWithoutLogo = mockExperiences[1];
        const logo = screen.queryByAltText(`${expWithoutLogo.company} logo`);
        expect(logo).toBeNull();
    });

    it("renders the timeline icons", () => {
        render(<Experience />);
        expect(screen.getByTestId("work-icon")).toBeDefined();
        expect(screen.getByTestId("edu-icon")).toBeDefined();
    });
});
