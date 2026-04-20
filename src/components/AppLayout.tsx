import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  LogOut, 
  GraduationCap,
  Calendar,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { UserRole } from '../types';
import { format } from 'date-fns';

export default function AppLayout() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setRole(profile.role);
        setUserName(profile.name);
      }
    }
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/app', 
      roles: ['admin', 'guru', 'staff', 'siswa'] 
    },
    { 
      label: 'Manajemen Ujian', 
      icon: BookOpen, 
      path: '/app/ujian', 
      roles: ['admin', 'guru'] 
    },
    { 
      label: 'Bank Soal', 
      icon: Calendar, 
      path: '/app/bank-soal', 
      roles: ['admin', 'guru'] 
    },
    { 
      label: 'Data Siswa', 
      icon: GraduationCap, 
      path: '/app/siswa', 
      roles: ['admin'] 
    },
    { 
      label: 'User Management', 
      icon: Users, 
      path: '/app/users', 
      roles: ['admin'] 
    },
    { 
      label: 'Ujian Saya', 
      icon: BookOpen, 
      path: '/app/ujian-saya', 
      roles: ['siswa'] 
    },
    { 
      label: 'Absensi', 
      icon: ClipboardCheck, 
      path: '/app/absensi', 
      roles: ['admin', 'guru', 'staff', 'siswa'] 
    },
  ];

  const filteredMenu = menuItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="flex h-screen bg-[#fef2f2] text-[#1e293b]">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-[#fee2e2] transition-all duration-300 flex flex-col flex-shrink-0",
          isSidebarOpen ? "w-[260px]" : "w-20"
        )}
      >
        <div className="p-8 border-bottom border-[#fee2e2]">
          {isSidebarOpen ? (
            <div className="space-y-1">
              <div className="text-[#dc2626] text-xl font-extrabold tracking-tighter leading-tight">
                SMK PRIMA<br />UNGGUL
              </div>
              <div className="text-[0.65rem] text-[#94a3b8] font-semibold uppercase tracking-wider">
                CBT & ATTENDANCE SYSTEM
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center mx-auto shadow-sm shadow-red-100">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-5 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 py-3 px-6 mx-3 rounded-lg transition-all text-sm font-medium",
                  isActive 
                    ? "bg-[#fef2f2] text-[#dc2626]" 
                    : "text-[#64748b] hover:text-[#1e293b] hover:bg-gray-50"
                )}
              >
                <item.icon size={18} className={isActive ? "text-[#dc2626]" : "text-[#94a3b8]"} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#fee2e2]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-[0.75rem] font-bold truncate">{userName}</p>
                <p className="text-[0.6rem] text-[#64748b] capitalize">{role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[72px] bg-white border-b border-[#fee2e2] flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-[#64748b] hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">
              {filteredMenu.find(m => m.path === location.pathname)?.label || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-[#64748b] font-medium hidden sm:block">
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#dc2626] text-sm font-bold hover:opacity-80 transition-opacity"
            >
              <span>Keluar</span>
              <div className="w-5 h-5 bg-[#fee2e2] rounded flex items-center justify-center">
                <LogOut size={12} />
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
