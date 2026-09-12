import { Router } from 'express';
import { sendOtp, verifyOtp } from '../lib/otp.js';

const router = Router();

router.post('/send', async (req, res) => {
  const { phone } = req.body || {};
  if (!/^\d{10}$/.test(String(phone || '').replace(/\D/g, ''))) {
    return res.status(400).json({ error: 'A valid 10-digit phone number is required.' });
  }
  await sendOtp(phone);
  res.json({ sent: true });
});

router.post('/verify', async (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) {
    return res.status(400).json({ error: 'phone and code are required.' });
  }
  const ok = await verifyOtp(phone, code);
  if (!ok) return res.status(400).json({ verified: false, error: 'Invalid or expired code.' });
  res.json({ verified: true });
});

export default router;
