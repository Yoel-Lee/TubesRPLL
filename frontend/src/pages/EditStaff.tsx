import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Shield, Wallet, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    role: 'STAFF',
    status: 'ACTIVE',
    baseSalary: 0
  });

  const [email, setEmail] = useState(''); // Email biasanya tidak diedit agar tidak merusak relasi login, jadi kita pisah untuk display saja.

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setEmail(data.email);
        setFormData({
          name: data.name || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          role: data.role || 'STAFF',
          status: data.status || 'ACTIVE',
          baseSalary: data.baseSalary || 0
        });
      } catch (err) {
        alert("Gagal mengambil data pegawai");
        navigate('/manage-staff');
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pastikan baseSalary dikirim sebagai Number
      const payload = {
        ...formData,
        baseSalary: Number(formData.baseSalary)
      };
      
      await api.put(`/users/${id}`, payload);
      alert("Data staff berhasil diperbarui!");
      navigate('/manage-staff'); // Kembali ke daftar staff setelah sukses
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal memperbarui data staff");
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-indigo-600">Memuat Data...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/manage-staff')}
          className="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Data Pegawai</h2>
          <p className="text-gray-500 text-sm">Update informasi, jabatan, atau gaji untuk {email}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={16} /> Nama Lengkap</label>
              <input 
                type="text" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Nomor Telepon */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone size={16} /> Nomor Telepon</label>
              <input 
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>

            {/* Role / Jabatan */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Shield size={16} /> Hak Akses (Role)</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Gaji Pokok */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Wallet size={16} /> Gaji Pokok (Rp)</label>
              <input 
                type="number" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.baseSalary}
                onChange={(e) => setFormData({...formData, baseSalary: Number(e.target.value)})}
              />
            </div>
            
            {/* Status Aktif */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Shield size={16} /> Status Akun</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="ACTIVE">AKTIF (Bisa Login)</option>
                <option value="INACTIVE">NONAKTIF / BLOKIR</option>
              </select>
            </div>
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={16} /> Alamat Domisili</label>
            <textarea 
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-200 mt-4"
          >
            <Save size={20} /> Simpan Perubahan Data
          </button>
        </form>
      </div>
    </div>
  );
}