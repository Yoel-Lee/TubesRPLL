import { useState } from 'react';

interface PayrollData {
  id: number;
  employeeName: string;
  role: string;
  baseSalary: number;
  allowance: number;
  deduction: number;
  status: 'paid' | 'unpaid';
}

export default function Payroll() {
  const [payrolls] = useState<PayrollData[]>([
    { id: 1, employeeName: 'Pak Bos Admin', role: 'admin', baseSalary: 15000000, allowance: 2000000, deduction: 500000, status: 'paid' },
    { id: 2, employeeName: 'Budi Santoso', role: 'staff', baseSalary: 8000000, allowance: 1000000, deduction: 200000, status: 'unpaid' },
    { id: 3, employeeName: 'Siti Aminah', role: 'staff', baseSalary: 7500000, allowance: 1000000, deduction: 150000, status: 'unpaid' },
  ]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Payroll</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Proses Semua Gaji
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Beban Gaji Bulan Ini</p>
          <p className="text-2xl font-bold text-gray-800">{formatRupiah(34800000)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Sudah Dibayar</p>
          <p className="text-2xl font-bold text-green-600">1 <span className="text-sm font-normal text-gray-500">Karyawan</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Belum Dibayar</p>
          <p className="text-2xl font-bold text-orange-600">2 <span className="text-sm font-normal text-gray-500">Karyawan</span></p>
        </div>
      </div>

      {/* Tabel Data Gaji */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-medium">Karyawan</th>
                <th className="p-4 font-medium">Gaji Pokok</th>
                <th className="p-4 font-medium">Tunjangan</th>
                <th className="p-4 font-medium">Potongan</th>
                <th className="p-4 font-medium text-blue-700">Total Diterima (Nett)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {payrolls.map((pr) => {
                const netSalary = pr.baseSalary + pr.allowance - pr.deduction;
                return (
                  <tr key={pr.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{pr.employeeName}</p>
                      <p className="text-xs text-gray-500 uppercase">{pr.role}</p>
                    </td>
                    <td className="p-4 text-gray-600">{formatRupiah(pr.baseSalary)}</td>
                    <td className="p-4 text-green-600">+{formatRupiah(pr.allowance)}</td>
                    <td className="p-4 text-red-500">-{formatRupiah(pr.deduction)}</td>
                    <td className="p-4 font-bold text-gray-900">{formatRupiah(netSalary)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pr.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {pr.status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                        Slip Gaji
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}