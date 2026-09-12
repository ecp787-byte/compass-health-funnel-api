// ============================================================================
// OTP DELIVERY — STUB
// ----------------------------------------------------------------------------
// This is NOT wired to a real SMS provider. It generates and "sends" (logs)
// a code so the API surface (/api/otp/send, /api/otp/verify) is real and
// testable end-to-end, but no text message actually goes out.
//
// TO MAKE THIS REAL (Twilio Verify is the recommended path - it handles
// code generation, expiry, and rate limiting for you, so you don't need
// this in-memory store at all once you switch):
//
//   npm install twilio
//
//   import twilio from 'twilio';
//   const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//
//   export async function sendOtp(phoneE164) {
//     await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
//       .verifications.create({ to: phoneE164, channel: 'sms' });
//   }
//
//   export async function verifyOtp(phoneE164, code) {
//     const check = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
//       .verificationChecks.create({ to: phoneE164, code });
//     return check.status === 'approved';
//   }
//
// Required env vars once real: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
// TWILIO_VERIFY_SERVICE_SID. See .env.example.
// ============================================================================

const codes = new Map(); // phone -> { code, expiresAt }
const CODE_TTL_MS = 5 * 60 * 1000;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp(phone) {
  const code = generateCode();
  codes.set(phone, { code, expiresAt: Date.now() + CODE_TTL_MS });
  // eslint-disable-next-line no-console
  console.log(`[otp stub] would SMS ${phone} the code ${code} (not actually sent - wire Twilio Verify, see file header)`);
  return { sent: true };
}

export async function verifyOtp(phone, submittedCode) {
  const entry = codes.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    codes.delete(phone);
    return false;
  }
  const ok = entry.code === submittedCode;
  if (ok) codes.delete(phone);
  return ok;
}
