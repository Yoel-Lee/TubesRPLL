import { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle, XCircle, Calendar as CalendarIcon } from 'lucide-react';
import api from '../lib/api';

interface Leave {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function LeaveRequest() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get('/leaves');
      setLeaves(data);
    } catch (err) {
      console.error("Gagal mengambil data cuti");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData);
      alert('Pengajuan cuti berhasil dikirim!');
      setFormData({ startDate: '', endDate: '', reason: '' }); // Reset form
      fetchLeaves(); // Refresh tabel
    } catch (err) {
      alert('Gagal mengirim pengajuan cuti');
    }
  };

  return (
    <div className="space-y-8">
      {/* Bagian Atas: Form Pengajuan */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <CalendarIcon size={24} />
          <h3 className="text-lg font-bold">Formulir Pengajuan Cuti</h3>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input 
              type="date" 
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Berakhir</label>
            <input 
              type="date" 
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Cuti</label>
            <textarea 
              required
              rows={3}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Jelaskan alasan Anda..."
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>
          <button className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
            <Send size={18} /> Kirim Pengajuan
          </button>
        </form>
      </div>

      {/* Bagian Bawah: Riwayat Cuti */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Status Pengajuan Anda</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Periode</th>
                <th className="px-6 py-4">Alasan</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {new Date(leave.startDate).toLocaleDateString('id-ID')} - {new Date(leave.endDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full text-xs font-bold ${
                      leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {leave.status === 'APPROVED' && <CheckCircle size={14} />}
                      {leave.status === 'REJECTED' && <XCircle size={14} />}
                      {leave.status === 'PENDING' && <Clock size={14} />}
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">Belum ada pengajuan cuti.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}