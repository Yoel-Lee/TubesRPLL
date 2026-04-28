import { useState } from 'react';

// Mendefinisikan tipe data untuk User List
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
}

export default function Users() {
  // State dummy untuk daftar user (Nanti dari Backend)
  const [users] = useState<UserData[]>([
    { id: 1, name: 'Pak Bos Admin', email: 'admin@perusahaan.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Budi Santoso', email: 'budi@perusahaan.com', role: 'staff', status: 'active' },
    { id: 3, name: 'Siti Aminah', email: 'siti@perusahaan.com', role: 'staff', status: 'inactive' },
  ]);

  // State untuk mengontrol visibilitas Modal Tambah User
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Karyawan
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-medium">Nama Karyawan</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="p-4 font-medium text-gray-800">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah User (Tampil jika isModalOpen === true) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Tambah Karyawan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert('Disimpan sementara!'); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}