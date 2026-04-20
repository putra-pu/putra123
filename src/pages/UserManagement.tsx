import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  UserPlus, 
  Trash2, 
  Search, 
  GraduationCap,
  Mail,
  User,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import { Profile, UserRole } from '../types';
import { cn } from '../lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;
    
    // In a real app, you'd call a Supabase function or Edge Function to delete from auth.users too.
    // Here we assume standard row delete.
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-gray-500 mt-2">Atur hak akses dan profil seluruh staf serta siswa.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
          <UserPlus size={20} /> Undang User
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Cari user..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 transition-all font-medium"
             />
           </div>
           <div className="flex items-center gap-2">
              {['admin', 'guru', 'staff', 'siswa'].map(r => (
                <button key={r} className="px-4 py-1.5 rounded-lg border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all capitalize">
                  {r}
                </button>
              ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profil</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">user_{user.id.substring(0,6)}@smkprima.sch.id</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider",
                      user.role === 'admin' ? "bg-red-50 text-red-600" :
                      user.role === 'guru' ? "bg-blue-50 text-blue-600" :
                      user.role === 'siswa' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-green-600 text-[10px] font-bold">
                       <ShieldCheck size={12} /> Terverifikasi
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2Icon size={16} />
                       </button>
                       <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Edit2Icon({ size, className }: any) {
  return (
    <svg 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
}
