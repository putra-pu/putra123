import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#fef2f2] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#dc2626] opacity-[0.03] rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#dc2626] opacity-[0.03] rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#dc2626] rounded-3xl shadow-2xl shadow-red-200 mb-6 rotate-3">
             <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-[#1e293b] tracking-tighter">SMK PRIMA UNGGUL</h1>
          <p className="text-[#64748b] mt-2 font-bold uppercase tracking-widest text-[0.65rem]">CBT & Attendance System Portal</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-[#fee2e2]">
          <h2 className="text-xl font-bold text-[#1e293b] mb-8">Masuk ke Akun</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[0.7rem] font-black text-[#64748b] uppercase tracking-widest mb-2.5 ml-1">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-[#fee2e2] rounded-2xl focus:ring-2 focus:ring-[#dc2626] focus:bg-white focus:outline-none transition-all placeholder:text-[#94a3b8] font-medium"
                  placeholder="name@smkprima.id"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-black text-[#64748b] uppercase tracking-widest mb-2.5 ml-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-[#fee2e2] rounded-2xl focus:ring-2 focus:ring-[#dc2626] focus:bg-white focus:outline-none transition-all placeholder:text-[#94a3b8] font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#dc2626] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake"
              >
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px]">!</span>
                </div>
                <span>{error === 'Invalid login credentials' ? 'Email atau password salah' : error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#dc2626] text-white rounded-2xl font-black text-lg hover:bg-[#b91c1c] shadow-xl shadow-red-100 transform hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Masuk Sekarang <LogIn size={18} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[#fee2e2] text-center">
             <p className="text-xs text-[#64748b] font-medium">Lupa kata sandi? <a href="#" className="text-[#dc2626] font-bold hover:underline">Hubungi Admin IT Sekolah</a></p>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-[0.65rem] text-[#94a3b8] font-bold uppercase tracking-[0.2em]">&copy; 2024 SMK Prima Unggul Education</p>
        </div>
      </motion.div>
    </div>
  );
}
