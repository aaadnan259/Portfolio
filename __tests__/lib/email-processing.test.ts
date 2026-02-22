import { describe, it, expect } from 'vitest';
import { processWebhookPayload } from '@/lib/email-processing';

describe('processWebhookPayload', () => {
  it('should prefer HTML content over Text', () => {
    const payload = {
      subject: 'Test',
      html: '<h1>Hello</h1>',
      text: 'Hello',
    };
    const result = processWebhookPayload(payload);
    // escapeHtml replaces < with &lt; etc.
    expect(result.content).toBe('&lt;h1&gt;Hello&lt;/h1&gt;');
  });

  it('should fallback to Text if HTML is missing', () => {
    const payload = {
      subject: 'Test',
      text: 'Hello\nWorld',
    };
    const result = processWebhookPayload(payload);
    // newlines replaced by <br>
    expect(result.content).toBe('Hello<br>World');
  });

  it('should fallback to Message if Text is missing', () => {
    const payload = {
      subject: 'Test',
      message: 'Hello Message',
    };
    const result = processWebhookPayload(payload);
    expect(result.content).toBe('Hello Message');
  });

  it('should fallback to JSON dump if nothing else', () => {
    const payload = {
      foo: 'bar',
    };
    const result = processWebhookPayload(payload);
    // content should contain the keys and values
    expect(result.content).toContain('foo');
    expect(result.content).toContain('bar');
    // Verify it is JSON-like structure (with escaped quotes)
    expect(result.content).toContain('&quot;foo&quot;: &quot;bar&quot;');
  });

  it('should use subject if provided', () => {
    const payload = { subject: 'My Subject' };
    const result = processWebhookPayload(payload);
    expect(result.subject).toBe('My Subject');
  });

  it('should use "No Subject" if subject missing', () => {
    const payload = {};
    const result = processWebhookPayload(payload);
    expect(result.subject).toBe('No Subject');
  });

  it('should use from if provided', () => {
    const payload = { from: 'me@example.com' };
    const result = processWebhookPayload(payload);
    expect(result.from).toBe('me@example.com');
  });

  it('should fallback to email if from missing', () => {
    const payload = { email: 'me@example.com' };
    const result = processWebhookPayload(payload);
    expect(result.from).toBe('me@example.com');
  });

  it('should use "Unknown" if no sender info', () => {
    const payload = {};
    const result = processWebhookPayload(payload);
    expect(result.from).toBe('Unknown');
  });

  it('should sanitize inputs', () => {
    const payload = {
      subject: '<script>alert(1)</script>',
      from: '<sender>',
      text: '<bodyonload>',
    };
    const result = processWebhookPayload(payload);
    expect(result.subject).not.toContain('<script>');
    expect(result.from).not.toContain('<sender>');
    expect(result.content).not.toContain('<bodyonload>');

    expect(result.subject).toContain('&lt;script&gt;');
  });
});
