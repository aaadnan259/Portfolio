import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import BackToTop from "../../src/components/BackToTop";

describe("BackToTop Performance Benchmark", () => {
    let scrollYGetterSpy: any;

    beforeEach(() => {
        // Mock window.scrollY getter
        scrollYGetterSpy = vi.fn(() => 0);
        Object.defineProperty(window, "scrollY", {
            configurable: true,
            get: scrollYGetterSpy,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("measures window.scrollY access count during rapid scrolling", () => {
        render(<BackToTop />);

        const SCROLL_EVENTS_COUNT = 1000;

        // Simulate rapid scrolling
        for (let i = 0; i < SCROLL_EVENTS_COUNT; i++) {
            fireEvent.scroll(window);
        }

        console.log(`Scroll events fired: ${SCROLL_EVENTS_COUNT}`);
        console.log(`window.scrollY accessed: ${scrollYGetterSpy.mock.calls.length}`);

        // Baseline expectation (unthrottled): roughly 1 access per event
        // We set a threshold to detect if optimization is missing or present
        // If unthrottled, accesses will be close to SCROLL_EVENTS_COUNT
        // If throttled/rAF, accesses should be significantly lower (or 0 during the synchronous loop if using rAF correctly)

        // This test is for benchmark purposes. We can assert the current behavior is unoptimized to confirm the issue.
        // With optimization (rAF), the scroll handler should not access window.scrollY immediately in the loop
        // It should only access it when the frame fires.
        // So we expect 0 or 1 access during the loop (depending on initial state), but definitely not 1000.
        expect(scrollYGetterSpy.mock.calls.length).toBeLessThan(SCROLL_EVENTS_COUNT);
        expect(scrollYGetterSpy.mock.calls.length).toBe(0);
    });
});
