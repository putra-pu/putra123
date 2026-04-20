import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Search, 
  Book, 
  CheckCircle2, 
  XCircle,
  ChevronDown
} from 'lucide-react';
import { Soal, Ujian } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function BankSoal() {
  const [exams, setExams] = useState<Ujian[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [questions, setQuestions] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [pertanyaan, setPertanyaan] = useState('');
  const [opsiA, setOpsiA] = useState('');
  const [opsiB, setOpsiB] = useState('');
  const [opsiC, setOpsiC] = useState('');
  const [opsiD, setOpsiD] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState<'A' | 'B' | 'C' | 'D'>('A');

  useEffect(() => {
    async function fetchExams() {
      const { data } = await supabase.from('ujian').select('*').order('created_at', { ascending: false });
      if (data) {
        setExams(data);
        if (data.length > 0) setSelectedExamId(data[0].id);
      }
      setLoading(false);
    }
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchQuestions(selectedExamId);
    }
  }, [selectedExamId]);

  async function fetchQuestions(examId: string) {
    setLoading(true);
    const { data } = await supabase.from('soal').select('*').eq('ujian_id', examId).order('created_at', { ascending: true });
    if (data) setQuestions(data);
    setLoading(false);
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    const { data, error } = await supabase.from('soal').insert({
      ujian_id: selectedExamId,
      pertanyaan,
      opsi_a: opsiA,
      opsi_b: opsiB,
      opsi_c: opsiC,
      opsi_d: opsiD,
      jawaban_benar: jawabanBenar
    }).select().single();

    if (data) {
      setQuestions([...questions, data]);
      setShowModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setPertanyaan('');
    setOpsiA('');
    setOpsiB('');
    setOpsiC('');
    setOpsiD('');
    setJawabanBenar('A');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus soal ini?')) return;
    const { error } = await supabase.from('soal').delete().eq('id', id);
    if (!error) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bank Soal</h1>
          <p className="text-gray-500 mt-2">Kelola butir soal pilihan ganda untuk setiap mata pelajaran.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          disabled={exams.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
        >
          <Plus size={20} /> Tambah Soal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Exam List */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Daftar Ujian</h3>
           <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
             {exams.map(exam => (
               <button
                 key={exam.id}
                 onClick={() => setSelectedExamId(exam.id)}
                 className={cn(
                   "w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 group",
                   selectedExamId === exam.id ? "bg-red-50 text-red-600" : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                 )}
               >
                 <div className={cn(
                   "p-2 rounded-xl transition-colors",
                   selectedExamId === exam.id ? "bg-red-100" : "bg-gray-100 group-hover:bg-gray-200"
                 )}>
                   <Book size={18} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{exam.title}</p>
                    <p className="text-[10px] font-medium opacity-60 mt-0.5">Dibuat: {format(new Date(exam.created_at), 'dd MMM yy')}</p>
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* Main Content: Question List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Cari dalam soal..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 transition-all font-medium"
               />
             </div>
             <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">
                {questions.length} Soal Terdaftar
             </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : questions.length === 0 ? (
             <div className="bg-white rounded-[2.5rem] p-20 border-2 border-dashed border-gray-100 text-center">
                <Book className="mx-auto text-gray-200 mb-6" size={64} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Soal</h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Silakan tambahkan butir soal baru untuk mulai menyusun materi ujian ini.</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Tambah Sekarang
                </button>
             </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-gray-200 group">
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                        {idx + 1}
                      </div>
                      <p className="text-lg font-bold text-gray-900 leading-relaxed">{q.pertanyaan}</p>
                    </div>
                    <button onClick={() => handleDelete(q.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['a', 'b', 'c', 'd'].map(opt => {
                       const key = `opsi_${opt}` as keyof Soal;
                       const isCorrect = q.jawaban_benar === opt.toUpperCase();
                       return (
                         <div key={opt} className={cn(
                           "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                           isCorrect ? "bg-green-50 border-green-200 text-green-700 font-bold" : "border-gray-50 text-gray-500 bg-gray-50/30"
                         )}>
                           <div className="flex items-center gap-3">
                             <span className="uppercase text-xs font-black opacity-40">{opt}.</span>
                             <span className="text-sm">{q[key]}</span>
                           </div>
                           {isCorrect && <CheckCircle2 size={16} />}
                         </div>
                       );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Soal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <div className="p-2 bg-red-50 text-red-600 rounded-xl"><Plus size={20} /></div>
               Tambah Butir Soal Baru
            </h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pertanyaan</label>
                <textarea 
                  required 
                  value={pertanyaan}
                  onChange={e => setPertanyaan(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all resize-none"
                  placeholder="Ketik pertanyaan di sini..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'A', label: 'Opsi A', val: opsiA, set: setOpsiA },
                  { key: 'B', label: 'Opsi B', val: opsiB, set: setOpsiB },
                  { key: 'C', label: 'Opsi C', val: opsiC, set: setOpsiC },
                  { key: 'D', label: 'Opsi D', val: opsiD, set: setOpsiD },
                ].map(opt => (
                  <div key={opt.key}>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">{opt.label}</label>
                    <input 
                      type="text" 
                      required 
                      value={opt.val}
                      onChange={e => opt.set(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-4">Jawaban Benar</label>
                <div className="grid grid-cols-4 gap-4">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setJawabanBenar(opt as any)}
                      className={cn(
                        "py-3 rounded-xl font-bold transition-all border-2",
                        jawabanBenar === opt 
                          ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 sticky bottom-0 bg-white pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
