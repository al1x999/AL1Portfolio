/**
 * Security & Anti-Hacking Utilities for AL1 Portfolio
 * Provides robust input sanitization, XSS mitigation, rate-limiting, and validation.
 * Official Brand: AL1
 */

// HTML entity map for escaping
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escapes unsafe HTML characters to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Strips HTML tags and script injections from text inputs.
 */
export function stripHtmlTags(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Sanitizes plain text input (names, messages, search queries).
 * Strips HTML tags, trims whitespace, and limits maximum length.
 */
export function sanitizeText(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  const stripped = stripHtmlTags(input);
  return stripped.slice(0, maxLength).trim();
}

/**
 * Validates and sanitizes email addresses according to standard formats.
 * Blocks newline injection (\r, \n) to prevent email header injection / open-relay attacks.
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  // Strip control characters, newlines, and carriage returns (CRLF injection prevention)
  const clean = email.replace(/[\r\n\t\0]/g, '').trim();
  return clean.slice(0, 254);
}

/**
 * Strict regex validation for email addresses.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // RFC-compliant simplified pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes a URL, allowing only safe protocols (http:, https:, mailto:, tel:).
 * Blocks 'javascript:', 'data:', 'vbscript:', and arbitrary protocols.
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Check for dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return '#';
  }

  // Allow relative URLs starting with /
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  // Allow safe absolute protocols
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return trimmed;
  }

  return '#';
}

/**
 * In-memory client-side Rate Limiter with Sliding Window.
 * Blocks rapid repeated actions (e.g. form submissions, password brute force).
 */
export class RateLimiter {
  private attempts: number[] = [];
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed without consuming a token.
   */
  canProceed(): boolean {
    const now = Date.now();
    this.cleanup(now);
    return this.attempts.length < this.maxAttempts;
  }

  /**
   * Attempt to record an action. Returns true if allowed, false if rate limited.
   */
  tryAcquire(): boolean {
    const now = Date.now();
    this.cleanup(now);

    if (this.attempts.length >= this.maxAttempts) {
      return false;
    }

    this.attempts.push(now);
    return true;
  }

  /**
   * Returns remaining seconds until the rate limit resets.
   */
  getSecondsUntilReset(): number {
    const now = Date.now();
    this.cleanup(now);
    if (this.attempts.length === 0) return 0;
    const oldest = this.attempts[0];
    const diff = this.windowMs - (now - oldest);
    return Math.max(0, Math.ceil(diff / 1000));
  }

  private cleanup(now: number): void {
    const cutoff = now - this.windowMs;
    this.attempts = this.attempts.filter((ts) => ts > cutoff);
  }

  reset(): void {
    this.attempts = [];
  }
}

/**
 * Dedicated Admin Brute-Force Protection tracker.
 * Locks out after 5 consecutive failed attempts for a progressive duration.
 */
class AdminBruteForceManager {
  private failedAttempts: number = 0;
  private lockoutUntil: number = 0;
  private readonly MAX_FAILS = 5;
  private readonly LOCKOUT_DURATION_MS = 60000; // 60 seconds

  isLockedOut(): { locked: boolean; remainingSeconds: number } {
    const now = Date.now();
    if (now < this.lockoutUntil) {
      const remainingSeconds = Math.ceil((this.lockoutUntil - now) / 1000);
      return { locked: true, remainingSeconds };
    }
    return { locked: false, remainingSeconds: 0 };
  }

  recordFailure(): { locked: boolean; remainingAttempts: number; lockoutSeconds: number } {
    this.failedAttempts += 1;
    if (this.failedAttempts >= this.MAX_FAILS) {
      this.lockoutUntil = Date.now() + this.LOCKOUT_DURATION_MS;
      this.failedAttempts = 0;
      return { locked: true, remainingAttempts: 0, lockoutSeconds: 60 };
    }
    return {
      locked: false,
      remainingAttempts: this.MAX_FAILS - this.failedAttempts,
      lockoutSeconds: 0,
    };
  }

  recordSuccess(): void {
    this.failedAttempts = 0;
    this.lockoutUntil = 0;
  }
}

export const adminBruteForce = new AdminBruteForceManager();
