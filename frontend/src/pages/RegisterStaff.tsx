import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Wallet, Phone, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

export default function RegisterStaff() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STAFF',
        baseSalary: 0,
        phoneNumber: '',
        address: '',
        managerId: ''
    });

    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await api.get('/users');
                const managerList = res.data.filter((u: any) => u.role === 'MANAGER');
                setManagers(managerList);
            } catch (err) {
                console.error("Gagal mengambil data manajer");
            }
        };
        fetchManagers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.endsWith('@gmail.com')) {
            alert("Pendaftaran hanya diperbolehkan menggunakan domain @gmail.com");
            return;
        }

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
                managerId: formData.managerId === '' ? null : Number(formData.managerId)
            };

            const response = await api.post('/users/register', payload);

            if (response.status === 201) {
                alert(`Berhasil! Akun untuk ${formData.name} telah dibuat.`);

                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'STAFF',
                    baseSalary: 0,
                    phoneNumber: '',
                    address: '',
                    managerId: ''
                });

                navigate('/manage-staff');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Gagal mendaftarkan staff";
            alert(errorMessage);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/manage-staff')}
                    className="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-indigo-600 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                        <UserPlus size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Daftarkan Staff Baru</h2>
                        <p className="text-gray-500 text-sm">Tambahkan anggota tim baru ke dalam sistem HRIS.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                <option value="MANAGER">MANAGER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

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

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <UserPlus size={16} /> Atasan / Manajer
                        </label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.managerId}
                            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                        >
                            <option value="">-- Tanpa Manajer --</option>
                            {managers.map((manager: any) => (
                                <option key={manager.id} value={manager.id}>
                                    {manager.name}
                                </option>
                            ))}
                        </select>
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