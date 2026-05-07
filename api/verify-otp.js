import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  try {
    const stored = await redis.get(`otp:${email}`);

    if (!stored || stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // If it was a registration, save the user profile permanently
    if (stored.registrationData) {
      await redis.set(`user:${email}`, stored.registrationData);
    }

    // Clean up OTP
    await redis.del(`otp:${email}`);

    return res.status(200).json({ success: true, message: 'Verified' });

  } catch (error) {
    console.error('Verify Error:', error);
    return res.status(500).json({ success: false, message: 'Verification system error' });
  }
}
