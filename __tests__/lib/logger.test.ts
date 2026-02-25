import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "@/lib/logger";

describe("logger", () => {
    const consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => { });
    const consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => { });
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should log info messages by default as JSON", () => {
        logger.info("Test info");
        expect(consoleInfoSpy).toHaveBeenCalled();
        const callArgs = consoleInfoSpy.mock.calls[0][0];
        const parsed = JSON.parse(callArgs);
        expect(parsed.level).toBe("info");
        expect(parsed.message).toBe("Test info");
    });

    it("should log warn messages by default as JSON", () => {
        logger.warn("Test warn");
        expect(consoleWarnSpy).toHaveBeenCalled();
        const callArgs = consoleWarnSpy.mock.calls[0][0];
        const parsed = JSON.parse(callArgs);
        expect(parsed.level).toBe("warn");
        expect(parsed.message).toBe("Test warn");
    });

    it("should log error messages by default as JSON", () => {
        logger.error("Test error");
        expect(consoleErrorSpy).toHaveBeenCalled();
        const callArgs = consoleErrorSpy.mock.calls[0][0];
        const parsed = JSON.parse(callArgs);
        expect(parsed.level).toBe("error");
        expect(parsed.message).toBe("Test error");
    });

    it("should not log debug messages by default in non-development environments", () => {
        logger.debug("Test debug");
        expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
});
