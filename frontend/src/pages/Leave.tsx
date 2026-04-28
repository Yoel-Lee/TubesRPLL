import { useState } from 'react';

// Mendefinisikan tipe data riwayat cuti
interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Leave() {
  // State untuk form input
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // State dummy untuk tabel riwayat (Nanti data ini dari Backend)
  const [history, setHistory] = useState<LeaveRequest[]>([
    { id: 1, startDate: '2026-04-10', endDate: '2026-04-12', reason: 'Acara Keluarga', status: 'approved' },
    { id: 2, startDate: '2026-03-05', endDate: '2026-03-05', reason: 'Sakit', status: 'approved' },
    { id: 3, startDate: '2026-05-01', endDate: '2026-05-03', reason: 'Liburan', status: 'pending' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulasi menambah data baru ke tabel (tanpa reload)
    const newRequest: LeaveRequest = {
      id: Date.now(),
      startDate,
      endDate,
      reason,
      status: 'pending',
    };

    setHistory([newRequest, ...history]);
    
    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
    
    alert('Pengajuan cuti berhasil dikirim (Simulasi)!');
  };

  // Fungsi pembantu untuk warna badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Disetujui</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Ditolak</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manajemen Cuti</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Form Pengajuan */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Form Pengajuan</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mulai Tanggal</label>
              <input 
                type="date" 
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
              <input 
                type="date" 
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
              <textarea 
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Tuliskan alasan cuti Anda..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Ajukan Cuti
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Tabel Riwayat */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Riwayat Pengajuan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-3 border-b">Tanggal Mulai</th>
                  <th className="p-3 border-b">Tanggal Selesai</th>
                  <th className="p-3 border-b">Alasan</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3">{item.startDate}</td>
                    <td className="p-3">{item.endDate}</td>
                    <td className="p-3 text-gray-600 truncate max-w-[150px]">{item.reason}</td>
                    <td className="p-3">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {history.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                Belum ada riwayat pengajuan cuti.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}