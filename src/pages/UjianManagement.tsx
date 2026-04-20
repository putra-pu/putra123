import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Calendar,
  Clock,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { Ujian, UserRole } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function UjianManagement() {
  const [exams, setExams] = useState<Ujian[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [durasi, setDurasi] = useState('60');
  const [tanggal, setTanggal] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) setRole(profile.role);
      }

      const { data } = await supabase.from('ujian').select('*').order('created_at', { ascending: false });
      if (data) setExams(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('ujian').insert({
      title,
      durasi: parseInt(durasi),
      tanggal,
      created_by: user.id
    }).select().single();

    if (data) {
      setExams([data, ...exams]);
      setShowModal(false);
      setTitle('');
      setDurasi('60');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus ujian ini? Semua data soal dan nilai terkait akan hilang.')) return;
    const { error } = await supabase.from('ujian').delete().eq('id', id);
    if (!error) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">Manajemen Ujian</h1>
          <p className="text-[#64748b] mt-2 font-medium">Kelola jadwal dan detail ujian untuk seluruh mata pelajaran.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="vibrant-btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Buat Ujian Baru
        </button>
      </div>

      {/* Filters/Search */}
      <div className="vibrant-card p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input 
            type="text" 
            placeholder="Cari mata pelajaran atau judul ujian..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#dc2626] transition-all font-medium"
          />
        </div>
        <div className="h-8 w-px bg-[#fee2e2] mx-2"></div>
        <select className="bg-transparent text-sm font-bold text-[#64748b] focus:outline-none cursor-pointer pr-4">
          <option>Semua Kelas</option>
          <option>XI TKJ 1</option>
          <option>XI TKJ 2</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="vibrant-card p-6 flex flex-col group relative">
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fef2f2] text-[#dc2626] rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={12} /> {exam.durasi} Menit
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b] group-hover:text-[#dc2626] transition-colors line-clamp-2 min-h-[3.5rem]">
                    {exam.title}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleDelete(exam.id)} className="p-2 text-[#94a3b8] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-[#94a3b8] hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#fee2e2] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">{format(new Date(exam.tanggal), 'dd MMM yyyy')}</span>
                </div>
                <button className="flex items-center gap-1 text-sm font-bold text-[#dc2626] hover:underline">
                  Kelola Soal <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1e293b]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[20px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Buat Ujian Baru</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#64748b] mb-2">Judul Ujian</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: UTS Matematika Dasar"
                  className="w-full px-4 py-3 bg-gray-50 border border-[#fee2e2] rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:outline-none transition-all placeholder:text-[#94a3b8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#64748b] mb-2">Durasi (Menit)</label>
                  <input 
                    type="number" 
                    required 
                    value={durasi}
                    onChange={e => setDurasi(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-[#fee2e2] rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#64748b] mb-2">Jadwal</label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={tanggal}
                    onChange={e => setTanggal(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-[#fee2e2] rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-50 text-[#64748b] rounded-xl font-bold hover:bg-gray-100 transition-all border border-[#fee2e2]"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#b91c1c] transition-all shadow-lg shadow-red-100"
                >
                  Simpan Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
