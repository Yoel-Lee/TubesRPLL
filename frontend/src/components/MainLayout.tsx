import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  //menu yg sdg aktif
  const isActive = (path: string) => location.pathname === path ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold tracking-wider">HRIS<span className="text-blue-400">Portal</span></h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Menu Utama</p>
          <Link to="/dashboard" className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
          <Link to="/attendance" className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/attendance')}`}>Absensi (QR)</Link>
          <Link to="/leave" className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/leave')}`}>Pengajuan Cuti</Link>
          <Link to="/reimburse" className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/reimburse')}`}>Reimbursement</Link>

          {/* Menu admin */}
          {user?.role === 'admin' && (
            <>
              <p className="px-2 mt-6 text-xs font-semibold text-orange-300 uppercase tracking-wider mb-2">Administrator</p>
              <Link to="/users" className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/users')}`}>User Management</Link>
              <Link to="/payroll" className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/payroll')}`}>Payroll</Link>
            </>
          )}
        </nav>
      </aside>

      {/* konten utama bagian kanan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Atas */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="text-gray-600 font-medium">
            Sistem Informasi SDM Terpadu
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* OUTLET */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}