import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import otpRoutes from './routes/otp.js';
import leadsRoutes from './routes/leads.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/otp', otpRoutes);
app.use('/api/leads', leadsRoutes);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Veritas funnel backend (scaffold) listening on :${PORT}`);
  // eslint-disable-next-line no-console
  console.log('Reminder: OTP delivery, GHL, and Meta CAPI are stubs - see README.md.');
});
