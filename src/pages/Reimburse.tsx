import { useState } from 'react';

interface ReimburseRequest {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Reimburse() {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const [history, setHistory] = useState<ReimburseRequest[]>([
    { id: 1, date: '2026-04-15', description: 'Beli Tinta Printer & Kertas HVS', amount: 350000, status: 'approved' },
    { id: 2, date: '2026-04-20', description: 'Taksi online meeting client', amount: 125000, status: 'pending' },
  ]);

  // Fungsi untuk memformat angka menjadi Rupiah (IDR)
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: ReimburseRequest = {
      id: Date.now(),
      date,
      description,
      amount: parseInt(amount),
      status: 'pending',
    };
    setHistory([newRequest, ...history]);
    setDate('');
    setDescription('');
    setAmount('');
    alert('Pengajuan Reimburse berhasil dikirim!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Pengajuan Reimbursement</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Pengajuan */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Form Reimburse</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengeluaran</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Keperluan</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Beli perlengkapan kantor..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="50000" />
            </div>
            {/* Simulasi Upload Bukti */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bukti/Nota</label>
              <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2">Ajukan Dana</button>
          </form>
        </div>

        {/* Tabel Riwayat */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Riwayat Reimburse</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-3 border-b">Tanggal</th>
                  <th className="p-3 border-b">Deskripsi</th>
                  <th className="p-3 border-b">Nominal</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3">{item.date}</td>
                    <td className="p-3 text-gray-600">{item.description}</td>
                    <td className="p-3 font-medium text-gray-800">{formatRupiah(item.amount)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}