import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardCheck, 
  TrendingUp,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          setRole(profile.role);
          setName(profile.name);
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
          Selamat Datang Kembali, <span className="text-[#dc2626]">{name}</span>!
        </h1>
        <p className="text-[#64748b] mt-2 font-medium">
          Berikut adalah ringkasan aktivitas {role === 'admin' ? 'sekolah' : 'anda'} hari ini.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {role === 'admin' && (
          <>
            <StatCard label="Siswa Terdaftar" value="1,248" sub="12 minggu ini" />
            <StatCard label="Ujian Aktif" value="04" sub="Dari 12 terjadwal" />
            <StatCard label="Kehadiran Siswa" value="98.2%" sub="Sesi Pagi" />
            <StatCard label="Total Soal" value="3,420" sub="Bank Soal Global" />
          </>
        )}
        {role === 'guru' && (
          <>
            <StatCard label="Kelas Anda" value="4" sub="Tahun Ajaran 2024" />
            <StatCard label="Ujian Dibuat" value="8" sub="3 Berjalan" />
            <StatCard label="Absensi Kelas" value="95%" sub="Status Terkini" />
            <StatCard label="Pending Review" value="5" sub="Jawaban Siswa" />
          </>
        )}
         {role === 'siswa' && (
          <>
            <StatCard label="Ujian Tersedia" value="2" sub="Segera Kerjakan" />
            <StatCard label="Presensi (%)" value="100%" sub="Hadir Selalu" />
            <StatCard label="Indeks Prestasi" value="3.75" sub="Sangat Baik" />
            <StatCard label="Ujian Terdekat" value="Besok" sub="Matematika" />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="vibrant-card p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[#1e293b]">Ujian Mendatang</h2>
            <button className="text-xs font-bold text-[#dc2626] uppercase tracking-wider hover:opacity-80 transition-opacity">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            <ExamItem 
              title="Matematika - UTS Semester Ganjil" 
              time="08:00 - 10:00" 
              date="21 Apr 2024" 
              role={role}
            />
            <ExamItem 
              title="Bahasa Indonesia - Kuis 3" 
              time="13:00 - 14:00" 
              date="21 Apr 2024" 
              role={role}
            />
            <ExamItem 
              title="Pemrograman Web - Praktek" 
              time="09:00 - 11:30" 
              date="22 Apr 2024" 
              role={role}
            />
          </div>
        </motion.div>

        {/* Schedule / Tasks */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="vibrant-card p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[#1e293b]">Aktivitas Terbaru</h2>
            <button className="text-xs font-bold text-[#dc2626] uppercase tracking-wider hover:opacity-80 transition-opacity">Lihat Semua</button>
          </div>
          <div className="space-y-6">
            <ActivityItem 
              type="login"
              title="Login Sistem"
              time="2 jam yang lalu"
              desc="Anda masuk ke dalam sistem menggunakan Perangkat Desktop."
            />
            <ActivityItem 
              type="exam"
              title="Submit Jawaban"
              time="4 jam yang lalu"
              desc="Siswa kelas XI TKJ baru saja menyelesaikan ujian Simulasi Digital."
            />
             <ActivityItem 
              type="attendance"
              title="Absensi Terdata"
              time="6 jam yang lalu"
              desc="Absensi karyawan untuk sesi pagi telah diselesaikan oleh Admin."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
      }}
      className="vibrant-card p-6 group hover:translate-y-[-4px] transition-all"
    >
      <p className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-widest mb-4">
        {label}
      </p>
      <p className="text-3xl font-extrabold text-[#1e293b]">
        {value}
      </p>
      <p className="text-[0.7rem] text-[#64748b] mt-2 font-medium">
        {sub}
      </p>
    </motion.div>
  );
}

function ExamItem({ title, time, date, role }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-red-50 hover:border-red-100 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-red-100 group-hover:text-red-600">
        <CalendarIcon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{date} • {time}</p>
      </div>
      {role === 'siswa' ? (
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          Detail
        </button>
      ) : (
        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
          <TrendingUp size={16} />
        </button>
      )}
    </div>
  );
}

function ActivityItem({ type, title, time, desc }: any) {
  const getIcon = () => {
    switch(type) {
      case 'login': return <Clock size={16} />;
      case 'exam': return <BookOpen size={16} />;
      case 'attendance': return <Users size={16} />;
      default: return <TrendingUp size={16} />;
    }
  };

  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 z-10">
          {getIcon()}
        </div>
        <div className="w-px h-full bg-gray-100 absolute top-8 bottom-0"></div>
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
          <span className="text-[10px] text-gray-400 font-medium">{time}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
