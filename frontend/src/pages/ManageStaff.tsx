import { useState, useEffect } from 'react';
import { Users, ChevronRight, UserPlus, Search, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ManageStaff() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setAllUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data pegawai", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* HEADER & ACTION BUTTON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Pegawai</h2>
          <p className="text-gray-500 text-sm">Lihat dan kelola seluruh akun staff di sistem.</p>
        </div>
        
        {/* Tombol menuju halaman registrasi yang kita buat tadi */}
        <button 
          onClick={() => navigate('/register-staff')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          <UserPlus size={20} /> Daftarkan Staff Baru
        </button>
      </div>

      {/* STATS QUICK VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Pegawai</p>
          <p className="text-3xl font-black text-gray-800 mt-1">{allUsers.length}</p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black">
              <tr>
                <th className="px-8 py-5">Informasi Pegawai</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Manager</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-bold">Memuat data...</td></tr>
              ) : allUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{u.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium tracking-tight">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider border ${
                      u.role === 'ADMIN' 
                      ? 'bg-purple-50 text-purple-600 border-purple-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-xs font-bold text-gray-500">
                    {u.manager?.name ? u.manager.name : <span className="text-gray-300 italic">No Manager</span>}
                  </td>
                  <td className="px-8 py-4 text-center">
                    <button 
                       onClick={() => navigate(`/edit-staff/${u.id}`)}
                       className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
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