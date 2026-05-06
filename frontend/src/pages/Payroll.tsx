import { useState, useEffect } from 'react';
import { Calculator, AlertCircle, Receipt } from 'lucide-react';
import api from '../lib/api';

interface PayrollData {
  employee: string;
  month: number;
  year: number;
  details: {
    baseSalary: number;
    totalReimburse: number;
    totalLatePenalty: number;
    totalLateRecords: number;
    totalDenda: number;
    totalBonus: number;
    unpaidLeaveDays: number;
    unpaidLeaveDeduction: number;
    grandTotal: number;
  };
}

export default function Payroll() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [payroll, setPayroll] = useState<PayrollData | null>(null);
  const [loading, setLoading] = useState(false);

  // Ambil daftar user untuk dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get('/users');
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleCalculate = async () => {
    if (!selectedUser) return alert("Pilih pegawai terlebih dahulu");
    setLoading(true);
    try {
      const { data } = await api.post('/payroll/calculate', {
        userId: selectedUser,
        month: Number(month),
        year: 2026
      });
      setPayroll(data);
    } catch (err) {
      alert("Gagal menghitung payroll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <Calculator size={24} />
          <h3 className="text-lg font-bold">Kalkulator Gaji Pegawai</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pegawai</label>
            <select
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Pilih Nama --</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              className="w-full p-3 border rounded-xl outline-none"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Bulan ke-{i + 1}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Menghitung...' : 'Generate Payroll'}
          </button>
        </div>
      </div>

      {payroll && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-50 overflow-hidden max-w-2xl mx-auto">
          <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
            <div>
              <h4 className="text-xl font-bold">SLIP GAJI DIGITAL</h4>
              <p className="opacity-70 text-sm">Periode: {payroll.month} / {payroll.year}</p>
            </div>
            <Receipt size={40} className="opacity-20" />
          </div>

          <div className="p-8 space-y-6">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Nama Pegawai</span>
              <span className="font-bold text-gray-800">{payroll.employee}</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Gaji Pokok</span>
                <span className="font-medium">Rp {payroll.details.baseSalary.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Insentif (Reimburse)</span>
                <span className="font-medium">+ Rp {payroll.details.totalReimburse.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Bonus</span>
                <span className="font-medium">
                  + Rp {payroll.details.totalBonus?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between text-red-600">
                <span className="flex items-center gap-1">
                  Potongan Telat ({payroll.details.totalLateRecords}x)
                  <AlertCircle size={14} />
                </span>
                <span className="font-medium">- Rp {payroll.details.totalLatePenalty.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-red-600">
                <span>Denda</span>
                <span>- Rp {payroll.details.totalDenda.toLocaleString() || 0}</span>
              </div>

              {payroll.details.unpaidLeaveDays > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>
                    Cuti Tidak Dibayar ({payroll.details.unpaidLeaveDays} hari)
                  </span>
                  <span>
                    - Rp {payroll.details.unpaidLeaveDeduction.toLocaleString() || 0}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t-2 border-dashed flex justify-between items-center">
              <span className="text-lg font-bold text-gray-700">Total Gaji Bersih</span>
              <span className="text-2xl font-black text-indigo-600">
                Rp {payroll.details.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
            Dihasilkan secara otomatis oleh ITHB HRIS System
          </div>
        </div>
      )}
    </div>
  );
}