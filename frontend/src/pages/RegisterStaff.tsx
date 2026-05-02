import { useState } from 'react';
import { UserPlus, Mail, Lock, User, Wallet, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function RegisterStaff() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STAFF',
        baseSalary: 0,
        phoneNumber: '',
        address: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Email Karyawan Baru
        if (!formData.email.endsWith('@gmail.com')) {
            alert("Pendaftaran hanya diperbolehkan menggunakan domain @gmail.com");
            return;
        }

        // 2. Validasi Password Default (mencegah input kosong)
        if (!formData.password) {
            alert("Password default harus diisi (misal: 123)");
            return;
        }

        try {
            const payload = {
                name: formData.name,         
                email: formData.email,        
                password: formData.password,  
                role: formData.role,        
                baseSalary: Number(formData.baseSalary) || 0, 
                phoneNumber: formData.phoneNumber,             
                address: formData.address,                     
                managerId: null                               
            };

            const response = await api.post('/users/register', payload);

            if (response.status === 201) {
                alert(`Berhasil! Akun untuk ${formData.name} telah dibuat.`);

                setFormData({
                    name: '',
                    email: '',
                    password: '', // Kembali kosong untuk inputan berikutnya
                    role: 'STAFF',
                    baseSalary: 0,
                    phoneNumber: '',
                    address: ''
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Gagal mendaftarkan staff";
            alert(errorMessage);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Daftarkan Staff Baru</h2>
                    <p className="text-gray-500 text-sm">Tambahkan anggota tim baru ke dalam sistem HRIS.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <User size={16} /> Nama Lengkap
                            </label>
                            <input
                                type="text" required placeholder="Contoh: Budi"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Mail size={16} /> Email (@gmail.com)
                            </label>
                            <input
                                type="email" required placeholder="budi@gmail.com"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Lock size={16} /> Password
                            </label>
                            <input
                                type="password" required placeholder="••••••••"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Gaji Pokok */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Wallet size={16} /> Gaji Pokok (Rp)
                            </label>
                            <input
                                type="number" required
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.baseSalary}
                                onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                            />
                        </div>

                        {/* Nomor Telepon */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Phone size={16} /> Nomor Telepon
                            </label>
                            <input
                                type="text" placeholder="0812..."
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <UserPlus size={16} /> Hak Akses
                            </label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="STAFF">STAFF</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <MapPin size={16} /> Alamat Domisili
                        </label>
                        <textarea
                            rows={3} placeholder="Jl. Merdeka No. 1..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                    >
                        <CheckCircle2 size={20} /> Daftarkan Staff Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
}