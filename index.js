import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import otpRoutes from './routes/otp.js';
import leadsRoutes from './routes/leads.js';

const app = express();
app.use(cors());
app.use(express.json());

// Reports which Twilio env vars this running process actually sees, as
// booleans only (never the values) - a quick way to confirm env var config
// actually reached the process without needing to dig through deploy logs.
app.get('/health', (_req, res) => res.json({
  ok: true,
  twilioConfigured: {
    accountSid: !!process.env.TWILIO_ACCOUNT_SID,
    authToken: !!process.env.TWILIO_AUTH_TOKEN,
    verifyServiceSid: !!process.env.TWILIO_VERIFY_SERVICE_SID,
  },
}));
app.use('/api/otp', otpRoutes);
app.use('/api/leads', leadsRoutes);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Veritas funnel backend (scaffold) listening on :${PORT}`);
  // eslint-disable-next-line no-console
  console.log('Reminder: GHL and Meta CAPI are stubs - see README.md.');
  // eslint-disable-next-line no-console
  console.log(
    '[env check] TWILIO_ACCOUNT_SID set:', !!process.env.TWILIO_ACCOUNT_SID,
    '| TWILIO_AUTH_TOKEN set:', !!process.env.TWILIO_AUTH_TOKEN,
    '| TWILIO_VERIFY_SERVICE_SID set:', !!process.env.TWILIO_VERIFY_SERVICE_SID,
  );
});
