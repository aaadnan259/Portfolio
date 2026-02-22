import { escapeHtml } from "./utils";

export interface WebhookPayload {
  subject?: string;
  from?: string;
  email?: string;
  name?: string;
  text?: string;
  html?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ProcessedEmail {
  subject: string;
  from: string;
  content: string;
}

export function processWebhookPayload(body: WebhookPayload): ProcessedEmail {
  const { subject, from, email, text, html, message } = body;

  const safeSubject = escapeHtml(subject || "No Subject");
  const safeFrom = escapeHtml(from || email || "Unknown");

  // Prefer HTML, then Text, then Message, then JSON dump
  // We use the raw content but escape it to prevent XSS while preserving the structure/code if it's HTML
  const rawBody = html || text || message || JSON.stringify(body, null, 2);
  const safeBodyContent = escapeHtml(rawBody || "").replace(/\n/g, '<br>');

  return {
    subject: safeSubject,
    from: safeFrom,
    content: safeBodyContent,
  };
}
