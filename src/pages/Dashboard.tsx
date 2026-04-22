import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  // Mengambil data user dan fungsi logout dari store
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Proteksi sederhana: Jika belum login, jangan tampilkan apa-apa
  if (!user) {
    return <div className="p-10 text-center">Akses Ditolak. Silakan Login terlebih dahulu.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">HRIS Dashboard</h2>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
          <p>Selamat datang, <strong>{user.name}</strong>!</p>
          <p>Role Anda saat ini adalah: <span className="uppercase font-bold">{user.role}</span></p>
        </div>

        {/* Contoh Rendering Berbasis Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Menu Staff Umum</h3>
            <ul className="list-disc pl-5 space-y-1 text-blue-600">
              <li><a href="#">Absensi / Attendance</a></li>
              <li><a href="#">Pengajuan Cuti</a></li>
              <li><a href="#">Pengajuan Reimburse</a></li>
            </ul>
          </div>

          {/* Kolom ini HANYA muncul jika role-nya admin */}
          {user.role === 'admin' && (
            <div className="border p-4 rounded-lg shadow-sm bg-orange-50 border-orange-200">
              <h3 className="font-semibold text-lg text-orange-800 mb-2">Panel Admin Utama</h3>
              <ul className="list-disc pl-5 space-y-1 text-orange-600">
                <li><a href="#">User Management</a></li>
                <li><a href="#">Approval Cuti & Reimburse</a></li>
                <li><a href="#">Hitung Payroll</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}