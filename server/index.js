const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const USER_DATA_DIR = path.join(__dirname, 'users');

// Ensure users directory exists for persistent storage
if (!fs.existsSync(USER_DATA_DIR)) {
  fs.mkdirSync(USER_DATA_DIR, { recursive: true });
}

// 1. Professional Logging Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// 2. Security: Rate Limiting (Prevent Spam)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 OTP requests per window
  message: { success: false, message: "Too many requests. Please try again in 15 minutes." }
});

const PORT = process.env.PORT || 3001;

// 3. Verify SMTP Connection on Startup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(chalk.red.bold('❌ SMTP Connection Error: Check your GMAIL_APP_PASS in .env'));
    console.log(chalk.red(error));
  } else {
    console.log(chalk.green.bold('🛡️  Secure Mail Vault: Connected & Ready to send emails'));
  }
});

// 4. In-memory OTP Storage (Real apps use Redis or DB)
const otpStorage = new Map();

// 5. API Endpoints
// Endpoint to Generate and Send OTP
app.post('/api/send-otp', otpLimiter, async (req, res) => {
  const { email, name, password, mode } = req.body;

  if (!email || !password || !mode) {
    return res.status(400).json({ success: false, message: 'Email, password and mode are required' });
  }

  const userSafeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const profilePath = path.join(USER_DATA_DIR, `${userSafeEmail}_profile.json`);
  const userExists = fs.existsSync(profilePath);

  // 1. Logic for Login Mode
  if (mode === 'login') {
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }
    
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    if (profile.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password for this account.' });
    }
  } 
  
  // 2. Logic for Register Mode
  else if (mode === 'register') {
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP and pending registration data with 2-minute expiry
  otpStorage.set(email, {
    otp,
    expiry: Date.now() + 2 * 60 * 1000,
    attempts: 0,
    registrationData: mode === 'register' ? { name, email, password } : null
  });

  const mailOptions = {
    from: `"Health Guardian" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `🔐 ${otp} is your Health Guardian verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background-color: #f9fafb; color: #1f2937;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #2563eb; padding: 15px; border-radius: 15px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -1px;">HG</h1>
            </div>
          </div>
          <h2 style="font-size: 20px; font-weight: 800; text-align: center; color: #111827; margin-bottom: 10px;">Security Verification</h2>
          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 30px;">Use the following code to ${mode === 'login' ? 'access' : 'initialize'} your secure health vault.</p>
          
          <div style="background: #eff6ff; border: 2px dashed #bfdbfe; padding: 25px; text-align: center; border-radius: 15px; margin-bottom: 30px;">
            <span style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #1e40af;">${otp}</span>
          </div>

          <p style="font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.6;">
            This code is valid for 2 minutes. <br/>
            If you didn't request this code, your account is secure and you can ignore this email.
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
            <p style="font-size: 11px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 1px;">Health Guardian Professional</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(chalk.blue(`📧 OTP successfully dispatched [${mode.toUpperCase()}]: `) + chalk.white.bold(email));
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(chalk.red('❌ Dispatch Failed:'), error.message);
    res.status(500).json({ success: false, message: 'System error during dispatch' });
  }
});

// Endpoint to Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const storedData = otpStorage.get(email);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email. Please request a new one.' });
  }

  if (Date.now() > storedData.expiry) {
    otpStorage.delete(email);
    return res.status(400).json({ success: false, message: 'OTP has expired.' });
  }

  if (storedData.attempts >= 5) {
    otpStorage.delete(email);
    return res.status(400).json({ success: false, message: 'Too many failed attempts. Request a new OTP.' });
  }

  if (storedData.otp === otp) {
    // If it was a registration, save the profile now
    if (storedData.registrationData) {
      const userSafeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const profilePath = path.join(USER_DATA_DIR, `${userSafeEmail}_profile.json`);
      fs.writeFileSync(profilePath, JSON.stringify(storedData.registrationData, null, 2));
      console.log(chalk.magenta(`👤 New Profile Created: `) + chalk.white(email));
    }

    otpStorage.delete(email); // Success! Clear the OTP
    console.log(chalk.green.bold(`✅ Verification Successful: `) + chalk.white(email));
    return res.status(200).json({ success: true, message: 'Verification successful' });
  } else {
    storedData.attempts += 1;
    console.log(chalk.yellow(`⚠️ Invalid OTP attempt for: `) + chalk.white(email));
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

// 6. Cloud Sync Endpoints (Persistent User Data)
// Save user data to server
app.post('/api/save-data', async (req, res) => {
  const { email, data } = req.body;
  if (!email || !data) return res.status(400).json({ success: false, message: 'Missing email or data' });

  try {
    const filePath = path.join(USER_DATA_DIR, `${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ success: true, message: 'Data synced to cloud vault' });
  } catch (error) {
    console.error(chalk.red('❌ Sync Failed:'), error);
    res.status(500).json({ success: false, message: 'Failed to save to cloud vault' });
  }
});

// Retrieve user data from server
app.get('/api/get-data', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });

  try {
    const filePath = path.join(USER_DATA_DIR, `${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      res.status(200).json({ success: true, data });
    } else {
      res.status(200).json({ success: true, data: null, message: 'New user - no previous data' });
    }
  } catch (error) {
    console.error(chalk.red('❌ Retrieval Failed:'), error);
    res.status(500).json({ success: false, message: 'Failed to retrieve from cloud vault' });
  }
});

app.listen(PORT, () => {
  console.log(chalk.cyan.bold(`
  ==========================================
  🚀 Health Guardian Node Server Running
  🔗 URL: http://localhost:${PORT}
  ==========================================
  `));
});
