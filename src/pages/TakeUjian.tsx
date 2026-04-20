import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  HelpCircle,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { Ujian, Soal } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function TakeUjian() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Ujian | null>(null);
  const [questions, setQuestions] = useState<Soal[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if already finished
      const { data: existingNilai } = await supabase
        .from('nilai')
        .select('*')
        .eq('ujian_id', id)
        .eq('siswa_id', user.id)
        .single();
      
      if (existingNilai) {
        alert('Anda sudah menyelesaikan ujian ini.');
        navigate('/app/ujian-saya');
        return;
      }

      const { data: examData } = await supabase.from('ujian').select('*').eq('id', id).single();
      const { data: soalData } = await supabase.from('soal').select('*').eq('ujian_id', id);

      if (examData && soalData) {
        setExam(examData);
        setQuestions(soalData);
        setTimeLeft(examData.durasi * 60);
      }
      setLoading(false);
    }
    fetchData();
  }, [id, navigate]);

  const handleSubmit = useCallback(async () => {
    if (!exam || !questions.length || submitting) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // 1. Save answers
      const answersToSave = Object.entries(answers).map(([soalId, jawaban]) => ({
        siswa_id: user.id,
        soal_id: soalId,
        jawaban
      }));

      if (answersToSave.length > 0) {
        await supabase.from('jawaban_siswa').insert(answersToSave);
      }

      // 2. Calculate score (grading)
      let correctCount = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.jawaban_benar) {
          correctCount++;
        }
      });
      const score = (correctCount / questions.length) * 100;

      // 3. Save result
      await supabase.from('nilai').insert({
        siswa_id: user.id,
        ujian_id: exam.id,
        skor: score
      });

      alert(`Ujian selesai! Skor Anda: ${score.toFixed(2)}`);
      navigate('/app/dashboard');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan jawaban. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }, [exam, questions, answers, navigate, submitting]);

  useEffect(() => {
    if (timeLeft <= 0 && !loading && !submitting) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, handleSubmit, submitting]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (soalId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [soalId]: value }));
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Exam Header */}
      <header className="bg-white border-b border-gray-100 h-20 sticky top-0 z-10 px-6 sm:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 truncate max-w-xs sm:max-w-md">{exam?.title}</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{questions.length} Soal • Pilihan Ganda</p>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors",
          timeLeft < 300 ? "bg-red-50 border-red-100 text-red-600" : "bg-gray-50 border-gray-100 text-gray-600"
        )}>
          <Timer size={18} className={timeLeft < 300 ? "animate-pulse" : ""} />
          <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 w-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-500"
        ></motion.div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-blue-50/50 shadow-xl shadow-gray-100 min-h-[400px] flex flex-col"
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                  {currentIdx + 1}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {currentQuestion.pertanyaan}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 flex-1">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const key = `opsi_${opt.toLowerCase()}` as keyof Soal;
                  const value = currentQuestion[key];
                  const isSelected = answers[currentQuestion.id] === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(currentQuestion.id, opt)}
                      className={cn(
                        "group flex items-center gap-6 p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                        isSelected 
                          ? "border-red-600 bg-red-50/30 ring-1 ring-red-600/20" 
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                        isSelected ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      )}>
                        {opt}
                      </div>
                      <span className={cn(
                        "flex-1 text-lg transition-colors",
                        isSelected ? "font-bold text-gray-900" : "font-medium text-gray-600"
                      )}>
                        {value}
                      </span>
                      {isSelected && (
                        <div className="absolute top-0 right-0 p-1">
                          <div className="w-6 h-6 bg-red-600 text-white rounded-bl-xl flex items-center justify-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-gray-100 font-bold text-gray-400 hover:text-gray-900 hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                {submitting ? "Menyimpan..." : "Selesaikan Ujian"} <Send size={20} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95"
              >
                Selanjutnya <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <HelpCircle size={14} /> Navigasi Soal
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const isAnswered = !!answers[questions[idx].id];
                const isCurrent = currentIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={cn(
                      "w-full aspect-square rounded-xl text-xs font-bold transition-all border-2",
                      isCurrent && "border-red-600 text-red-600 bg-red-50 scale-110 z-10",
                      !isCurrent && isAnswered && "border-green-100 bg-green-50 text-green-600",
                      !isCurrent && !isAnswered && "border-gray-50 bg-gray-50 text-gray-300 hover:border-gray-200 hover:text-gray-500"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="text-orange-500 p-1 bg-white rounded-lg shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-orange-900 mb-1">Informasi</h4>
                <p className="text-xs text-orange-700/80 leading-relaxed">
                  Jawaban disimpan secara otomatis saat navigasi. Pastikan menjawab semua soal sebelum waktu habis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
