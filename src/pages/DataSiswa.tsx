import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Search, 
  MoreVertical,
  Download,
  Filter,
  GraduationCap,
  MapPin,
  Mail
} from 'lucide-react';
import { Siswa } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function DataSiswa() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSiswa() {
      // In this schema, siswa are linked to profiles. 
      // We'll simulate fetching from a 'siswa' table created in SQL.
      const { data, error } = await supabase.from('siswa').select('*');
      if (data) setSiswa(data);
      setLoading(false);
    }
    fetchSiswa();
  }, []);

  const filteredSiswa = siswa.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Data Siswa</h1>
          <p className="text-gray-500 mt-2">Database informasi lengkap seluruh peserta didik SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> Export Excel
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
            Tambah Siswa
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari NIS atau Nama Siswa..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
            <Filter size={14} /> XI TKJ 1 <ChevronDown size={14} />
          </button>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
             {filteredSiswa.length} Hasil
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1,2,3,4].map(i => (
             <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
          ))
        ) : filteredSiswa.length === 0 ? (
           <div className="col-span-full py-20 text-center">
              <GraduationCap className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-500 font-bold">Data siswa tidak ditemukan.</p>
           </div>
        ) : filteredSiswa.map((s, idx) => (
           <motion.div 
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-gray-100 border-4 border-white shadow-lg overflow-hidden mb-6 group-hover:scale-110 transition-transform">
                  <img 
                    src={`https://picsum.photos/seed/${s.id}/200`} 
                    alt={s.nama} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{s.nama}</h3>
                <p className="text-xs text-red-600 font-bold uppercase tracking-widest mt-1">{s.kelas}</p>
                <div className="mt-4 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-mono text-gray-400">
                   NIS: {s.nis}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                 <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium lowercase">
                   <Mail size={12} className="text-gray-300" /> {s.nis}@smkprima.sch.id
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                   <MapPin size={12} className="text-gray-300" /> Tangsel, Indonesia
                 </div>
              </div>
           </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChevronDown({ size, className }: any) {
  return (
    <svg 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
