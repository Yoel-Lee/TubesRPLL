import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, Edit3, Users, ChevronRight, Phone, MapPin } from 'lucide-react';
import api from '../lib/api';

export default function Profile() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [profile, setProfile] = useState<any>(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Update Initial State dengan phoneNumber dan address
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    phoneNumber: '', 
    address: '', 
    managerId: '' 
  });

 const fetchProfile = async () => {
  try {
    const { data } = await api.get(`/users/${currentUser.id}`);
    setProfile(data);

    setFormData({
      name: data.name || '',
      role: data.role || '',
      phoneNumber: data.phoneNumber || '',
      address: data.address || '',
      managerId: data.managerId || ''
    });
  } catch (err) {
    console.error(err);
  }
};

  const fetchAllUsers = async () => {
    if (currentUser.role === 'ADMIN') {
      const { data } = await api.get('/users');
      setAllUsers(data);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAllUsers();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/users/updateme`, formData);
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
      localStorage.setItem('user', JSON.stringify({ ...currentUser, name: formData.name }));
      window.location.reload(); 
    } catch (err) {
      alert("Gagal memperbarui profil");
    }
  };

  if (!profile) return <div className="p-8 text-center font-bold text-indigo-600">Memuat Profil...</div>;

  return (
    <div className="animate-slide-right max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* SECTION 1: USER SELF PROFILE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 h-32 w-full relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 flex justify-between items-end">
            <div className="p-1 bg-white rounded-3xl shadow-sm">
               <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-4xl font-black shadow-inner">
                 {profile.name.charAt(0)}
               </div>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="mb-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
              >
                <Edit3 size={18} /> Edit Profil
              </button>
            ) : (
              <button 
                onClick={handleUpdate}
                className="mb-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
              >
                <Save size={18} /> Simpan Perubahan
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Nama */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <input 
                type="text" 
                disabled={!isEditing}
                className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-60"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Akun)</label>
              <div className="w-full mt-1.5 p-3.5 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 flex items-center gap-3 font-medium">
                <Mail size={18} className="opacity-40" /> {profile.email}
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
              <div className="relative mt-1.5">
                <Phone size={18} className="absolute left-4 top-4 text-gray-400" />
                <input 
                  type="text" 
                  disabled={!isEditing}
                  placeholder="Contoh: 0812xxxx"
                  className="w-full p-3.5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-60"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jabatan / Role</label>
              <div className="w-full mt-1.5 p-3.5 bg-gray-100 border border-gray-100 rounded-2xl text-indigo-600 flex items-center gap-3 font-black">
                <Shield size={18} className="opacity-40" /> {profile.role}
              </div>
            </div>

            {/* Alamat - Full Width */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Domisili</label>
              <div className="relative mt-1.5">
                <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                <textarea 
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Masukkan alamat lengkap Anda..."
                  className="w-full p-3.5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-60 resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN USER MANAGEMENT */}
      {currentUser.role === 'ADMIN' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><Users size={20}/></div>
              <h3 className="text-xl font-bold text-gray-800">Manajemen Pegawai</h3>
            </div>
            <span className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-xl text-xs font-black tracking-tight">
              {allUsers.length} TOTAL PEGAWAI
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black">
                <tr>
                  <th className="px-8 py-5">Informasi Pegawai</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Manager</th>
                  <th className="px-8 py-5 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-200 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm shadow-sm group-hover:border-indigo-200">
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
                      {u.manager?.name ? (
                        <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            {u.manager.name}
                        </span>
                      ) : (
                        <span className="text-gray-300 font-normal italic">No Manager</span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}