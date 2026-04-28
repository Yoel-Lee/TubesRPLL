import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ringkasan Dashboard</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-600">
          Selamat datang kembali, <span className="font-semibold text-blue-600">{user?.name}</span>!
        </p>
        <p className="text-sm text-gray-500 mt-1">Gunakan menu di sebelah kiri untuk menavigasi sistem HRIS.</p>
      </div>

      {/* Grid kartu ringkasan (dummy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Sisa Cuti Tahunan</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12 <span className="text-lg text-gray-500 font-normal">Hari</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Status Kehadiran Hari Ini</h3>
          <p className="text-xl font-bold text-green-600 mt-2">Hadir (08:05 WIB)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
          <h3 className="text-gray-500 text-sm font-medium">Reimburse Pending</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">1 <span className="text-lg text-gray-500 font-normal">Pengajuan</span></p>
        </div>
      </div>
    </div>
  );
}