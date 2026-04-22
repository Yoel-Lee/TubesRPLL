import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/login" element={<Login />} />

        {/* parent terbesar -> cek dulu udah login apa belom */}
        <Route element={<ProtectedRoute />}>
          {/*kalo ud login , mainlayout disini sebagai parent route juga, biar anak dibawahnya ke load semua komponen sidebar / header nya */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Siapkan tempat untuk halaman lainnya nanti */}
            <Route path="/attendance" element={<div>Halaman Attendance (QR) akan di sini</div>} />
            <Route path="/leave" element={<div>Halaman Cuti akan di sini</div>} />
            <Route path="/reimburse" element={<div>Halaman Reimburse akan di sini</div>} />
            <Route path="/users" element={<div>Halaman User Management akan di sini</div>} />
            <Route path="/payroll" element={<div>Halaman Payroll akan di sini</div>} />
          </Route>
        </Route>
        
        {/* URL ga valid */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;