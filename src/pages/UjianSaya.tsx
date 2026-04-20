import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Clock, AlertCircle, Play } from 'lucide-react';
import { Ujian } from '../types';
import { format } from 'date-fns';
import { formatDuration } from '../lib/utils';

export default function UjianSaya() {
  const [exams, setExams] = useState<Ujian[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchExams() {
      const { data, error } = await supabase
        .from('ujian')
        .select('*')
        .order('tanggal', { ascending: false });
      
      if (data) setExams(data);
      setLoading(false);
    }
    fetchExams();
  }, []);

  const handleStartExam = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin memulai ujian sekarang? Timer akan berjalan secara otomatis.')) {
      navigate(`/ujian/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ujian Saya</h1>
        <p className="text-gray-500 mt-2">Daftar ujian yang tersedia untuk Anda ikuti.</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 font-bold text-3xl">
             ?
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Ujian</h2>
          <p className="text-gray-500 max-w-sm">
            Saat ini belum ada jadwal ujian yang terdaftar untuk kelas Anda. Silakan hubungi wali kelas atau admin jika ada kendala.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div 
              key={exam.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col transition-all hover:shadow-xl hover:shadow-gray-100 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Tersedia
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                {exam.title}
              </h3>
              
              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Durasi: {formatDuration(exam.durasi)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AlertCircle size={16} />
                  <span>Jadwal: {format(new Date(exam.tanggal), 'dd MMMM yyyy, HH:mm')}</span>
                </div>
              </div>

              <button 
                onClick={() => handleStartExam(exam.id)}
                className="mt-8 w-full py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95"
              >
                Mulai Ujian <Play size={18} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
