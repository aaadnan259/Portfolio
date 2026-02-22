// Centralized configuration for the application

/**
 * The email address used for backend operations (e.g., sending emails).
 * This relies on CONTACT_EMAIL environment variable.
 * If not set, it is undefined, allowing the server to enforce configuration.
 */
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

/**
 * The email address used for public display (e.g., mailto links).
 * This relies on NEXT_PUBLIC_CONTACT_EMAIL environment variable.
 * If not set, it defaults to a placeholder to avoid exposing PII in the code.
 */
export const PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com";
