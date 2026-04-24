import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

// Tipe data untuk log presensi
interface AttendanceLog {
  id: number;
  time: string;
  type: 'in' | 'out';
  status: 'success';
}

export default function Attendance() {
  const [logs, setLogs] = useState<AttendanceLog[]>([
    { id: 1, time: '08:05:12 WIB', type: 'in', status: 'success' }
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Fungsi yang dipanggil saat kamera berhasil membaca QR
  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const qrData = detectedCodes[0].rawValue;
      
      // Matikan kamera sejenak setelah berhasil scan
      setIsScanning(false);
      
      // Simulasi validasi QR (Misal QR yang valid isinya "HRIS-ABSEN-HARI-INI")
      if (qrData) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID') + ' WIB';
        
        // Tambah ke tabel riwayat
        setLogs([{ id: Date.now(), time: timeString, type: 'out', status: 'success' }, ...logs]);
        setScanMessage({ text: 'Absen berhasil dicatat!', type: 'success' });
      } else {
        setScanMessage({ text: 'QR Code tidak valid untuk absensi.', type: 'error' });
      }

      // Hilangkan pesan setelah 3 detik
      setTimeout(() => setScanMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Absensi Harian (QR Scanner)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom Kiri: Kamera Scanner */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4 w-full text-center">Pindai QR Absensi</h3>
          
          <div className="w-full max-w-sm aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative">
            {isScanning ? (
              <Scanner 
                onScan={handleScan}
                formats={['qr_code']}
              />
            ) : (
              <div className="text-center p-6">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 text-sm">Kamera tidak aktif.</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`mt-6 px-6 py-2 rounded-lg font-medium text-white transition-colors w-full max-w-sm ${isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isScanning ? 'Batalkan Scan' : 'Mulai Pindai QR'}
          </button>

          {/* Pesan Sukses/Error */}
          {scanMessage && (
            <div className={`mt-4 p-3 rounded-lg w-full max-w-sm text-center text-sm font-medium ${scanMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {scanMessage.text}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Riwayat Hari Ini */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Log Kehadiran Anda Hari Ini</h3>
          
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${log.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {log.type === 'in' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{log.type === 'in' ? 'Absen Masuk' : 'Absen Pulang'}</p>
                    <p className="text-sm text-gray-500">Terekam pada: {log.time}</p>
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Berhasil</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}