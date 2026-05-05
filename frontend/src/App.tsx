import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Attendance from './pages/Attendance';
import LeaveRequest from './pages/LeaveRequest';
import Payroll from './pages/Payroll';
import Reimbursement from './pages/Reimbursement';
import AdminApprovals from './pages/AdminApprovals';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ManageAttendance from './pages/ManageAttendance';
import Profile from './pages/Profile';
import RegisterStaff from './pages/RegisterStaff';
import ManageStaff from './pages/ManageStaff';
import EditStaff from './pages/EditStaff';
import LeaveCalendar from './pages/LeaveCalendar';
import ReportingLine from './pages/ReportingLine';
import ActivityLog from './pages/ActivityLog';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rute Terproteksi */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/attendance" replace />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<LeaveRequest />} />
          <Route path="leave-calendar" element={<LeaveCalendar />} />
          <Route path="reporting-line" element={<ReportingLine />} />
          <Route path="reimburse" element={<Reimbursement />} />
          
          {/* 2. TAMBAHKAN RUTE PROFILE DI SINI */}
          <Route path="profile" element={<Profile />} />

          {/* Rute Khusus Admin */}
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="manage-attendance" element={<ManageAttendance />} />
          <Route path="manage-staff" element={<ManageStaff />} />          
          <Route path="register-staff" element={<RegisterStaff />} />
          <Route path="edit-staff/:id" element={<EditStaff />} />
          <Route path="activity-log" element={<ActivityLog />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;