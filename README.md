# Veritas funnel backend (scaffold)

This is a runnable Express API with the right shape (`/api/otp/send`,
`/api/otp/verify`, `/api/leads`) but **three stubbed integrations**. Nothing
here talks to a real SMS provider, a real GoHighLevel account, or a real Meta
dataset yet — each stub logs what it *would* send instead.

## Run it

```
cd server
npm install
cp .env.example .env   # fill in real credentials as you wire each piece up
npm run dev
```

It listens on `:8787` by default. Point the frontend's OTP/lead calls at it
once you're ready to replace the frontend's demo-mode simulation (see
`src/components/quiz/StepOtp.jsx` and `src/components/ResultsPage.jsx` —
both have `TODO(backend)` comments at the exact lines to change).

## What's stubbed, and what to do about it

| Piece | File | Status | To make real |
|---|---|---|---|
| SMS OTP delivery | `lib/otp.js` | logs the code instead of texting it | Twilio Verify — see file header for the exact swap |
| CRM contact/tags/fields | `lib/ghl.js` | logs the payload instead of calling GHL | GoHighLevel Private Integration API key + Location ID |
| Ad-platform conversion events | `lib/meta.js` | logs the (already-hashed) payload instead of calling Graph API | Meta Pixel ID + a CAPI access token |
| Lead persistence | `routes/leads.js` | in-memory array, lost on restart | swap for a real database before deploying |

## Security notes specific to this backend

- OTP codes are single-use and expire after 5 minutes (`lib/otp.js`).
- Meta match keys (email, phone) are SHA-256 hashed **before** they would
  leave this server (`lib/meta.js`) — raw PII is never sent to Meta.
- The lead score is recomputed server-side from raw answers on every
  submission (`routes/leads.js`) rather than trusted from the client, so a
  tampered client-side score can't inflate a lead's tier.
- `GET /api/leads` is a debug listing with no auth — remove it or put real
  auth in front of it before this is anywhere near production traffic.
