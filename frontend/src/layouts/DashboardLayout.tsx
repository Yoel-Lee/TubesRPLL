import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  LogOut,
  Receipt,
  DollarSign,
  ChevronRight,
  User as UserIcon,
  CalendarDays,
  Users,
  Clock, Network
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-indigo-300 tracking-tight">ITHB HRIS</h1>

        <nav className="space-y-4 flex-1">
          <Link to="/attendance" className="flex items-center gap-3 hover:text-indigo-300 transition">
            <LayoutDashboard size={20} /> Absensi
          </Link>
          <Link to="/leave" className="flex items-center gap-3 hover:text-indigo-300 transition">
            <Calendar size={20} /> Cuti
          </Link>
          <Link to="/reimburse" className="flex items-center gap-3 hover:text-indigo-300 transition">
            <Receipt size={20} /> Reimburse
          </Link>
          <Link to="/reporting-line" className="flex items-center gap-3 hover:text-indigo-300 transition">
            <Network size={20} /> Struktur Organisasi
          </Link>
          <Link to="/leave-calendar" className="flex items-center gap-3 hover:text-indigo-300 transition">
            <CalendarDays size={20} /> Calendar
          </Link>

          {user.role === 'ADMIN' && (
            <>
              <div className="pt-6 pb-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">Admin Menu</div>
              <Link to="/approvals" className="flex items-center gap-3 hover:text-indigo-300 transition">
                <ClipboardCheck size={20} /> Approvals
              </Link>
              <Link to="/payroll" className="flex items-center gap-3 hover:text-indigo-300 transition">
                <DollarSign size={20} /> Payroll
              </Link>
              <Link to="/manage-attendance" className="flex items-center gap-3 hover:text-indigo-300 transition">
                <Clock size={20} /> Koreksi Absen
              </Link>
              <Link to="/manage-staff" className="flex items-center gap-3 hover:text-indigo-300 transition">
                <Users size={20} /> Manage Staff
              </Link>
            </>
          )}
        </nav>

        {/* --- BAGIAN PROFILE (YANG BISA DIKLIK) --- */}
        <div className="border-t border-indigo-800 pt-6 mt-auto space-y-4">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-3 bg-indigo-800/50 rounded-2xl cursor-pointer hover:bg-indigo-800 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate group-hover:text-indigo-200 transition-colors">{user.name}</p>
              <p className="text-[10px] opacity-50 uppercase font-black tracking-tighter">{user.role}</p>
            </div>
            <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 transition-colors text-sm font-bold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Dashboard</p>
            <h2 className="text-xl font-bold text-gray-800">Halo, {user.name} 👋</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider border border-indigo-100">
              {user.role}
            </span>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}