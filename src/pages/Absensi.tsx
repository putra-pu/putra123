import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  UserCheck, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Absensi() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [alreadyAbsent, setAlreadyAbsent] = useState(false);
  const [stats, setStats] = useState({ hadir: 0, izin: 0, alpa: 0 });

  useEffect(() => {
    async function checkAttendance() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) setRole(profile.role);

        // Check today's attendance
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data: attendance } = await supabase
          .from('absensi_karyawan')
          .select('*')
          .eq('user_id', user.id)
          .eq('tanggal', today)
          .single();
        
        if (attendance) setAlreadyAbsent(true);
      }
      setLoading(false);
    }
    checkAttendance();
  }, []);

  const handleCheckIn = async (status: string = 'hadir') => {
    if (!userId) return;
    const { error } = await supabase.from('absensi_karyawan').insert({
      user_id: userId,
      status: status
    });

    if (!error) {
      setAlreadyAbsent(true);
      alert('Berhasil melakukan absensi hari ini!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">Portal Absensi</h1>
        <p className="text-[#64748b] mt-2 font-medium">Mencatat kehadiran harian Tenaga Pendidik dan Karyawan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Check-in Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="vibrant-card p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Clock className="text-[#dc2626] opacity-5" size={140} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-[#dc2626] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-100">
                  <UserCheck size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1e293b]">{format(new Date(), 'EEEE, dd MMMM')}</h3>
                  <p className="text-[#64748b] font-medium">{format(new Date(), 'HH:mm')} • Zona Waktu Lokal</p>
                </div>
              </div>

              {alreadyAbsent ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border border-green-100 rounded-3xl p-10 text-center"
                >
                  <div className="w-16 h-16 bg-[#166534] rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-100">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-[#166534] mb-3">Presensi Diterima!</h4>
                  <p className="text-[#166534] font-medium max-w-sm mx-auto">Terima kasih, kehadiran Anda hari ini telah tercatat secara resmi pada sistem.</p>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-[#fee2e2] flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl text-[#dc2626] flex items-center justify-center shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1e293b]">Lokasi Presensi</h4>
                      <p className="text-xs text-[#64748b] mt-1 font-medium">SMK Prima Unggul - Main Office</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button 
                      onClick={() => handleCheckIn('hadir')}
                      className="py-8 bg-[#dc2626] text-white rounded-2xl font-bold text-xl hover:bg-[#b91c1c] shadow-xl shadow-red-100 transition-all flex flex-col items-center gap-3 group active:scale-95"
                    >
                      <CheckCircle2 size={32} className="group-hover:scale-110 transition-transform" />
                      Hadir
                    </button>
                    <div className="flex flex-col gap-3">
                      <button 
                         onClick={() => handleCheckIn('izin')}
                        className="flex-1 py-4 bg-white border-2 border-[#fee2e2] text-[#64748b] rounded-xl font-bold text-lg hover:border-[#dc2626] hover:text-[#dc2626] transition-all active:scale-95"
                      >
                        Izin
                      </button>
                      <button 
                         onClick={() => handleCheckIn('sakit')}
                        className="flex-1 py-4 bg-white border-2 border-[#fee2e2] text-[#64748b] rounded-xl font-bold text-lg hover:border-[#dc2626] hover:text-[#dc2626] transition-all active:scale-95"
                      >
                        Sakit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History Snippet */}
          <div className="vibrant-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#1e293b] text-lg">Riwayat Presensi Pekan Ini</h3>
              <CalendarIcon size={20} className="text-[#94a3b8]" />
            </div>
            <div className="space-y-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/30 border border-[#fee2e2]/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                      <span className="text-sm font-bold text-[#1e293b]">Senin, 1{i} April 2024</span>
                    </div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#166534] bg-[#dcfce7] px-4 py-1.5 rounded-full">Hadir</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-8">
           <div className="bg-[#1e293b] rounded-[1.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="absolute -bottom-8 -right-8 text-white opacity-5">
                <AlertCircle size={240} />
              </div>
              <h4 className="font-bold text-xl mb-6 relative z-10">Kebijakan Absensi</h4>
              <ul className="space-y-5 relative z-10">
                <li className="flex gap-4 text-sm text-slate-300 leading-relaxed font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] mt-2 flex-shrink-0"></div>
                  <span>Wajib dilakukan setiap hari kerja pukul 07:00 - 08:00 WIB.</span>
                </li>
                <li className="flex gap-4 text-sm text-slate-300 leading-relaxed font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] mt-2 flex-shrink-0"></div>
                  <span>Ketidakhadiran tanpa keterangan resmi akan langsung tercatat Alpa.</span>
                </li>
                <li className="flex gap-4 text-sm text-slate-300 leading-relaxed font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] mt-2 flex-shrink-0"></div>
                  <span>Sakit wajib menyertakan surat dokter melalui admin sekolah.</span>
                </li>
              </ul>
           </div>

           <div className="vibrant-card p-8">
              <h4 className="font-bold text-[#1e293b] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#fef2f2] text-[#dc2626] rounded-lg">
                   <TrendingUpIcon size={18} />
                </div>
                Statistik Presensi
              </h4>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[0.7rem] font-bold mb-3 uppercase tracking-wider text-[#64748b]">
                    <span>Konsistensi Kehadiran</span>
                    <span className="text-[#dc2626]">92%</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-[#fee2e2]">
                    <div className="h-full bg-[#dc2626] shadow-[0_0_10px_rgba(220,38,38,0.3)] w-[92%] transition-all duration-1000"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50/50 rounded-2xl text-center border border-[#fee2e2]">
                    <p className="text-[0.6rem] font-bold text-[#64748b] uppercase tracking-widest mb-2 font-mono">Present</p>
                    <p className="text-2xl font-black text-[#1e293b]">22</p>
                  </div>
                  <div className="p-6 bg-gray-50/50 rounded-2xl text-center border border-[#fee2e2]">
                    <p className="text-[0.6rem] font-bold text-[#64748b] uppercase tracking-widest mb-2 font-mono">Permit</p>
                    <p className="text-2xl font-black text-[#1e293b]">02</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon({ size, className }: any) {
  return (
    <svg 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
