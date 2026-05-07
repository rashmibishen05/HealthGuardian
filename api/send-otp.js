import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // Enable CORS
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

  const { email, name, password, mode } = req.body;

  if (!email || !password || !mode) {
    return res.status(400).json({ success: false, message: 'Email, password and mode are required' });
  }

  try {
    // 1. Check if user exists in Redis
    const userProfile = await redis.get(`user:${email}`);
    
    if (mode === 'login') {
      if (!userProfile) {
        return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
      }
      if (userProfile.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid password.' });
      }
    } else if (mode === 'register') {
      if (userProfile) {
        return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
      }
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. Store OTP in Redis with 2-minute expiry
    await redis.set(`otp:${email}`, { 
        otp, 
        registrationData: mode === 'register' ? { name, email, password } : null 
    }, { ex: 120 });

    // 4. Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: `"Health Guardian" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🔐 ${otp} is your Health Guardian verification code`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">Security Verification</h2>
            <p style="text-align: center;">Use the code below to secure your health vault:</p>
            <div style="text-align: center; padding: 20px; background: #eff6ff; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af;">
              ${otp}
            </div>
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">This code expires in 2 minutes.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'OTP sent' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: 'System error. Check your Vercel KV connection.' });
  }
}
