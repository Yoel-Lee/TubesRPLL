import { useState } from 'react';
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
  Clock, 
  Network, 
  Bell, 
  CheckCheck, 
  Activity
} from 'lucide-react';

// Import Custom Hook untuk Notifikasi
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardLayout() {
  const navigate = useNavigate();
  
  // Ambil data user dari localStorage dengan aman
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};

  // Panggil logika notifikasi dari Custom Hook
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user.role);
  
  // State khusus untuk urusan UI (buka-tutup menu dropdown notifikasi)
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-indigo-300 tracking-tight">ITHB HRIS</h1>

        <nav className="space-y-4 flex-1">
          {/* Menu Umum (Staff & Admin) */}
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
            <CalendarDays size={20} /> Kalender Cuti
          </Link>

          {/* Menu Khusus Admin */}
          {user.role === 'ADMIN' && (
            <>
              <div className="pt-6 pb-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">Admin Menu</div>
              <Link to="/approvals" className="flex items-center gap-3 hover:text-indigo-300 transition">
                <ClipboardCheck size={20} /> Approvals
              </Link>
              <Link to="/activity-log" className="flex items-center gap-3 hover:text-indigo-300 transition">
                <Activity size={20} /> Activity Log
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

        {/* --- BAGIAN PROFILE & LOGOUT --- */}
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50 relative">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Dashboard</p>
            <h2 className="text-xl font-bold text-gray-800">Halo, {user.name} 👋</h2>
          </div>
          
          <div className="flex items-center gap-5">
            
            {/* --- LONCENG NOTIFIKASI --- */}
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="p-2.5 bg-gray-50 rounded-xl hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-all relative"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Notifikasi */}
              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-800 transition-colors"
                      >
                        <CheckCheck size={14} /> Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => !notif.isRead && markAsRead(notif.id)}
                          className={`p-4 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50/30 hover:bg-indigo-50'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm ${notif.isRead ? 'font-semibold text-gray-700' : 'font-black text-indigo-900'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && <span className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></span>}
                          </div>
                          <p className={`text-xs ${notif.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notif.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-sm font-bold text-gray-400">
                        Belum ada notifikasi
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* --- BADGE ROLE --- */}
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider border border-indigo-100">
              {user.role}
            </span>
          </div>
        </header>

        {/* Konten Halaman (Outlet) */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {showNotif && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotif(false)}
        ></div>
      )}
    </div>
  );
}