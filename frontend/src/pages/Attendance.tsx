import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, History, CheckCircle2, XCircle } from 'lucide-react';
import api from '../lib/api';

interface Log {
  id: number;
  time: string;
  type: 'IN' | 'OUT';
}

export default function Attendance() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Ambil riwayat absen hari ini
  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/attendance');
      setLogs(data);
    } catch (err) {
      console.error("Gagal ambil history");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleScan = async (detectedCodes: any[]) => {
    if (detectedCodes.length > 0) {
      const qrData = detectedCodes[0].rawValue;
      setIsScanning(false);

      // Validasi sederhana: QR harus berisi kode unik kantor
      if (qrData === "ITHB-HRIS-2026") {
        try {
          // Tentukan IN atau OUT otomatis berdasarkan data terakhir
          const nextType = logs.length > 0 && logs[0].type === 'IN' ? 'OUT' : 'IN';
          
          await api.post('/attendance', { type: nextType });
          
          setMessage({ text: `Absen ${nextType} Berhasil!`, type: 'success' });
          fetchLogs(); // Refresh tabel
        } catch (err: any) {
          setMessage({ text: err.response?.data?.message || 'Gagal absen', type: 'error' });
        }
      } else {
        setMessage({ text: 'QR Code Tidak Valid!', type: 'error' });
      }
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* KIRI: Scanner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <Camera size={24} />
          <h3 className="text-lg font-bold">Pindai QR Absensi</h3>
        </div>

        <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
          {isScanning ? (
            <Scanner onScan={handleScan} formats={['qr_code']} />
          ) : (
            <div className="text-center text-gray-400">
              <Camera size={48} className="mx-auto mb-2 opacity-20" />
              <p>Kamera Nonaktif</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition ${
            isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isScanning ? 'Batalkan' : 'Mulai Absen'}
        </button>

        {message && (
          <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}
      </div>

      {/* KANAN: Riwayat */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-gray-700">
          <History size={24} />
          <h3 className="text-lg font-bold">Riwayat Kehadiran</h3>
        </div>

        <div className="space-y-4">
          {logs.length === 0 && <p className="text-gray-400 text-center py-10">Belum ada absen hari ini.</p>}
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${log.type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {log.type}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{log.type === 'IN' ? 'Masuk Kerja' : 'Pulang Kerja'}</p>
                  <p className="text-sm text-gray-500">{new Date(log.time).toLocaleTimeString('id-ID')}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md">BERHASIL</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}