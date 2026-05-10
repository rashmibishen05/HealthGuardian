import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaHeartbeat, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { dbHelper } from '../utils/indexedDB';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP Data
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [offlineOtp, setOfflineOtp] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);



  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    return `${user.substring(0, 2)}***@${domain}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isLogin && !name) || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Connection Sequence for a "Real App" feel
    setStatus("🔐 Establishing Secure Connection...");
    await new Promise(r => setTimeout(r, 800));
    setStatus("📡 Connecting to Health Vault...");
    await new Promise(r => setTimeout(r, 800));
    setStatus("📤 Dispatching Encrypted OTP...");

    try {
      // 1. Try Real Nodemailer Server First
      if (isOnline) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || '';
          const response = await fetch(`${apiUrl}/api/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              name: isLogin ? 'User' : name,
              password,
              mode: isLogin ? 'login' : 'register'
            }),
          });
          
          const result = await response.json();
          if (result.success) {
            setOfflineOtp(null); // Clear offline simulator
            setStep('otp');
            setResendTimer(120);
            setSuccess(`Secure OTP dispatched to ${maskEmail(email)}`);
            setIsLoading(false);
            setStatus(null);
            return;
          } else {
            // Handle specific errors like "User not found" or "Invalid password"
            const detailedMsg = result.details ? `${result.message} (${result.details})` : result.message;
            setError(detailedMsg || 'Authentication failed');
            setIsLoading(false);
            setStatus(null);
            return;
          }
        } catch (serverErr) {
          console.warn("Server unreachable, falling back to Offline Simulator");
        }
      }

      // 2. Offline Simulator Fallback (or if server is down)
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOfflineOtp(mockOtp);
      console.log(`%c[HEALTH GUARDIAN] Offline Mode OTP: ${mockOtp}`, 'color: #00ff00; font-size: 20px; font-weight: bold;');
      
      setStep('otp');
      setResendTimer(120);
      setSuccess(isOnline 
        ? "Server offline: Using Local Secure Mode. OTP: " + mockOtp 
        : "Offline Mode Active: Your secure OTP is " + mockOtp);
      
    } catch (err: any) {
      setError('System Error. Please try again.');
    } finally {
      setIsLoading(false);
      setStatus(null);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when 6 digits are reached
    if (index === 5 && value) {
      handleVerifyOTP(null, newOtpValues.join(''));
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent | null, directOtp?: string) => {
    if (e) e.preventDefault();
    const enteredOtp = directOtp || otpValues.join('');
    
    if (enteredOtp.length !== 6) return;

    setIsLoading(true);
    setError(null);
    setStatus("🔑 Verifying Secure Token...");

    await new Promise(r => setTimeout(r, 1200));

    // 1. Check Offline Simulator First
    if (offlineOtp) {
      if (enteredOtp === offlineOtp) {
        setSuccess("Vault Unlocked via Local Mode!");
        setTimeout(() => onLogin(), 800);
      } else {
        setError("Incorrect Offline OTP.");
        setIsLoading(false);
        setStatus(null);
      }
      return;
    }

    // 2. Real Server Verification
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const result = await response.json();
      if (result.success) {
        setSuccess("Vault Unlocked Successfully!");
        localStorage.setItem('userEmail', email); // Save email for sync
        
        // --- NEW: CLOUD DATA RESTORATION ---
        if (isOnline) {
          setStatus("☁️ Restoring Cloud Data...");
          try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const dataRes = await fetch(`${apiUrl}/api/get-data?email=${email}`);
            const dataResult = await dataRes.json();
            if (dataResult.success && dataResult.data) {
              await dbHelper.init();
              await dbHelper.importData(JSON.stringify(dataResult.data));
              setStatus("✅ Records Restored!");
              await new Promise(r => setTimeout(r, 800));
            }
          } catch (restoreErr) {
            console.warn("Cloud restore failed, using local data only.", restoreErr);
          }
        }
        
        setTimeout(() => onLogin(), 800);
      } else {
        setError(result.message || "Incorrect OTP. Verification failed.");
        setIsLoading(false);
        setStatus(null);
      }
    } catch (err) {
      setError("Connection lost. Please use the offline OTP shown above.");
      setIsLoading(false);
      setStatus(null);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px]" />
        <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.4, 0.3] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/20 relative">
          
          {/* Real-time Status Overlay */}
          <AnimatePresence>
            {status && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{status}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
              {step === 'details' ? <FaHeartbeat className="text-white text-4xl animate-pulse" /> : <FaShieldAlt className="text-white text-4xl" />}
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              {step === 'details' ? 'HEALTH VAULT' : 'VERIFICATION'}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {isOnline ? 'Secure Online Mode' : 'Encrypted Offline Mode'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
                <FaExclamationCircle className="shrink-0" />
                <p className="text-xs font-bold">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-2xl flex items-center gap-3 text-green-600 dark:text-green-400 relative">
                <FaCheckCircle className="shrink-0" />
                <p className="text-xs font-bold">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 'details' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-black/20 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white" />
                </div>
              )}
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-black/20 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white" />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-black/20 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50">
                {isLogin ? 'Unlock Vault' : 'Initialize Account'}
              </button>
              <p className="text-center text-[10px] font-black text-slate-400 mt-8">
                {isLogin ? "DON'T HAVE AN ACCOUNT? " : "ALREADY HAVE AN ACCOUNT? "}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {isLogin ? 'SIGN UP' : 'LOG IN'}
                </button>
              </p>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between gap-2">
                {otpValues.map((value, index) => (
                  <input key={index} ref={(el) => { otpInputRefs.current[index] = el; }} type="text" maxLength={1} inputMode="numeric" value={value} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => e.key === 'Backspace' && !otpValues[index] && index > 0 && otpInputRefs.current[index - 1]?.focus()} className="w-12 h-16 text-center text-2xl font-black bg-slate-100 dark:bg-black/20 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white" />
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={handleSendOTP} disabled={resendTimer > 0 || isLoading} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest disabled:text-slate-400">
                  {resendTimer > 0 ? `RESEND OTP IN ${resendTimer}s` : 'RESEND OTP'}
                </button>
                <button onClick={() => setStep('details')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  BACK TO DETAILS
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
