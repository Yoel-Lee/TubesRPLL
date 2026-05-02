import { useState, useEffect } from 'react';
import { Edit3, Search, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function ManageAttendance() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [editForm, setEditForm] = useState({ time: '', type: '' });

  const fetchAllLogs = async () => {
    const { data } = await api.get('/attendance/');
    setLogs(data);
  };

  useEffect(() => { fetchAllLogs(); }, []);

  const handleEditClick = (log: any) => {
    setSelectedLog(log);
    // Format tanggal agar cocok dengan input type="datetime-local"
    const date = new Date(log.time);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    setEditForm({ 
      time: date.toISOString().slice(0, 16), 
      type: log.type 
    });
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/attendance/${selectedLog.id}`, editForm);
      alert("Data berhasil dikoreksi!");
      setSelectedLog(null);
      fetchAllLogs();
    } catch (err) {
      alert("Gagal update data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Absensi Pegawai</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Nama Pegawai</th>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{log.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(log.time).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    log.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEditClick(log)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                  >
                    <Edit3 size={16} /> Koreksi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL KOREKSI */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Koreksi Absen</h3>
            <p className="text-gray-500 mb-6 text-sm">Pegawai: <span className="font-bold">{selectedLog.user.name}</span></p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Waktu Absen</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editForm.time}
                  onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Tipe Absen</label>
                <select 
                  className="w-full p-3 border rounded-xl outline-none"
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                >
                  <option value="IN">Masuk (IN)</option>
                  <option value="OUT">Pulang (OUT)</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button 
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}