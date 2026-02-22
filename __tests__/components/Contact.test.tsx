import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Contact from "@/components/Contact";

// Mock configuration
vi.mock("@/lib/config", () => ({
  PUBLIC_CONTACT_EMAIL: "test-contact@example.com",
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe("Contact Component", () => {
  it("renders the contact email from configuration", () => {
    render(<Contact />);

    // Check if the email link is present with correct href
    const emailLink = screen.getByRole("link", { name: /test-contact@example.com/i });
    expect(emailLink).toBeDefined();
    expect(emailLink.getAttribute("href")).toBe("mailto:test-contact@example.com");

    // Check if the email text is displayed
    expect(screen.getByText("test-contact@example.com")).toBeDefined();
  });
});
