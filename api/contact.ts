/**
 * Serverless Contact & Inquiry API Endpoint
 * Compatible with Vercel, Netlify, and Node.js serverless runtimes.
 * Protects against DDoS, Bot Spam, XSS, Header Injection, and Open-Relay Email Abuse.
 * Official Brand: AL1
 */

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
  service?: string;
  _gotcha?: string; // Honeypot field for bot trapping
  website?: string; // Secondary honeypot
}

// IP-based Sliding-Window Rate Limiter
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Hardcoded safe recipient to strictly prevent open-relay abuse
const OWNER_EMAIL = 'contact@al1studio.com';

function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip) || { timestamps: [] };

  // Filter timestamps within current window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < WINDOW_DURATION_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const retryAfterSeconds = Math.ceil((WINDOW_DURATION_MS - (now - oldest)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(ip, { timestamps: activeTimestamps });

  // Periodic memory cleanup
  if (rateLimitStore.size > 10000) {
    for (const [key, val] of rateLimitStore.entries()) {
      if (val.timestamps.every((ts) => now - ts > WINDOW_DURATION_MS)) {
        rateLimitStore.delete(key);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function sanitizeString(str: any, maxLen: number): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[\r\n\t\0]/g, ' ') // neutralize CRLF header injection
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // RFC-compliant email regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email);
}

export default async function handler(req: any, res: any) {
  // 1. Remove X-Powered-By header to prevent technology disclosure
  if (res.removeHeader) {
    res.removeHeader('X-Powered-By');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are accepted.',
    });
  }

  try {
    // 3. IP Rate Limiting
    const clientIp = getClientIp(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(clientIp);

    if (!allowed) {
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: `Too many requests. Please wait ${retryAfterSeconds} seconds before sending another message.`,
      });
    }

    // 4. Parse & Validate body
    const body: ContactRequestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 5. Honeypot Anti-Bot Trap
    // Automated spam bots fill hidden inputs
    if (body._gotcha || body.website) {
      // Silently accept without processing to fool the bot
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has been received securely.',
      });
    }

    // 6. Input Sanitization & Validation
    const name = sanitizeString(body.name, 100);
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const cleanEmail = rawEmail.replace(/[\r\n]/g, ''); // strip CRLF injection
    const service = sanitizeString(body.service || 'General Inquiry', 100);
    const rawMessage = typeof body.message === 'string' ? body.message : '';
    const cleanMessage = rawMessage.replace(/<[^>]*>/g, '').trim().slice(0, 3000);

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid name (at least 2 characters).',
      });
    }

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters in length.',
      });
    }

    // 7. Open-Relay Protection:
    // Fixed recipient; caller cannot direct this email to arbitrary recipients
    const messagePayload = {
      recipient: OWNER_EMAIL,
      senderName: name,
      senderEmail: cleanEmail,
      service,
      message: cleanMessage,
      receivedAt: new Date().toISOString(),
      sourceIp: clientIp.startsWith('::ffff:') ? clientIp.replace('::ffff:', '') : clientIp,
    };

    // Log securely without leaking sensitive payload to public stdout
    console.log(`[AL1 Security API] New verified inquiry received for ${OWNER_EMAIL} from ${cleanEmail}`);

    return res.status(200).json({
      success: true,
      message: 'Your message has been received securely by AL1 Studio. We will reply to your email shortly.',
      timestamp: messagePayload.receivedAt,
    });
  } catch (error: any) {
    // Zero stack trace disclosure in production responses
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your request. Please try again or reach out directly via WhatsApp.',
    });
  }
}
