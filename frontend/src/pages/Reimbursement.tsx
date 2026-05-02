import { useState, useEffect } from 'react';
import { DollarSign, Plus, Receipt, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

interface Reimbursment {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function Reimbursement() {
  const [items, setItems] = useState<Reimbursment[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: ''
  });

  const fetchReimbursements = async () => {
    try {
      const { data } = await api.get('/reimbursements');
      setItems(data);
    } catch (err) {
      console.error("Gagal mengambil data reimburse");
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reimbursements', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      alert('Klaim reimburse berhasil diajukan!');
      setFormData({ date: new Date().toISOString().split('T')[0], description: '', amount: '' });
      fetchReimbursements();
    } catch (err) {
      alert('Gagal mengajukan reimburse');
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Input */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <Plus size={24} className="bg-indigo-100 p-1 rounded-lg" />
          <h3 className="text-lg font-bold">Ajukan Klaim Reimburse</h3>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kwitansi</label>
            <input 
              type="date" required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Nominal)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">Rp</span>
              <input 
                type="number" required placeholder="0"
                className="w-full p-3 pl-10 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan Pengeluaran</label>
            <input 
              type="text" required placeholder="Contoh: Bensin Operasional / Makan Klien"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <Receipt size={18} /> Ajukan Sekarang
          </button>
        </form>
      </div>

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <DollarSign size={20} className="text-gray-400" />
          <h3 className="text-lg font-bold">Riwayat Klaim Anda</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Nominal</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                  <td className="px-6 py-4 text-sm font-bold">
                    Rp {item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'APPROVED' && <CheckCircle size={14} />}
                      {item.status === 'REJECTED' && <XCircle size={14} />}
                      {item.status === 'PENDING' && <Clock size={14} />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-10 text-center text-gray-400">Belum ada data klaim.</p>}
        </div>
      </div>
    </div>
  );
}