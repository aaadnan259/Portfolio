import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "@/lib/logger";

describe("logger", () => {
    const consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should log info messages by default", () => {
        logger.info("Test info");
        expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO] Test info");
    });

    it("should log warn messages by default", () => {
        logger.warn("Test warn");
        expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN] Test warn");
    });

    it("should log error messages by default", () => {
        logger.error("Test error");
        expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR] Test error");
    });

    it("should not log debug messages by default (assuming info level)", () => {
        logger.debug("Test debug");
        expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
});
