import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Network, 
  Palette, 
  Calculator, 
  Play, 
  Users, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const majors = [
  { name: 'TKJ', desc: 'Teknik Komputer & Jaringan', Icon: Network, color: 'bg-blue-500' },
  { name: 'DKV', desc: 'Desain Komunikasi Visual', Icon: Palette, color: 'bg-purple-500' },
  { name: 'AK', desc: 'Akuntansi', Icon: Calculator, color: 'bg-emerald-500' },
  { name: 'BC', desc: 'Broadcasting', Icon: Play, color: 'bg-red-500' },
  { name: 'MPLB', desc: 'Manajemen Perkantoran', Icon: Users, color: 'bg-orange-500' },
  { name: 'BD', desc: 'Bisnis Digital', Icon: Briefcase, color: 'bg-indigo-500' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">SMK <span className="text-red-600">PRIMA UNGGUL</span></span>
          </div>
          <Link 
            to="/login" 
            className="px-6 py-2.5 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-200"
          >
            Masuk Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block">
                Portal Ujian & Absensi
              </span>
              <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
                Membangun Generasi <br />
                <span className="text-red-600">Cerdas & Unggul.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                Platform Computer Based Test (CBT) terintegrasi untuk SMK Prima Unggul. 
                Memudahkan ujian, kehadiran, dan manajemen data sekolah dalam satu sistem.
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  Mulai Sekarang <ArrowRight size={20} />
                </Link>
                <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all">
                  Info Jurusan
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-red-100 rounded-[2rem] -rotate-2"></div>
              <img 
                src="https://picsum.photos/seed/school/800/600" 
                alt="School Hero" 
                className="relative rounded-[2rem] shadow-2xl z-10 w-full object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-100 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Siswa Terdaftar</p>
                    <p className="text-lg font-bold text-gray-900">1,200+</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Majors Section */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Keahlian</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai pilihan jurusan kompetensi untuk masa depan yang gemilang sesuai minat dan bakatmu.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majors.map((major, idx) => (
              <motion.div 
                key={major.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200 transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110", major.color)}>
                  <major.Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{major.name}</h3>
                <p className="text-gray-500 leading-relaxed">{major.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">SMK PRIMA UNGGUL</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Mewujudkan sekolah unggulan yang menghasilkan lulusan kompeten, berkarakter, dan siap kerja di era digital.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Navigasi</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Beranda</Link></li>
              <li><Link to="/login" className="hover:text-red-500 transition-colors">Login CMS</Link></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Profil Sekolah</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Kontak</h4>
            <ul className="space-y-4 text-gray-400">
              <li>info@smkprimaunggul.sch.id</li>
              <li>Jl. Pendidikan No. 123</li>
              <li>(021) 12345678</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SMK Prima Unggul. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
