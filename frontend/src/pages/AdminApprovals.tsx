import { useState, useEffect } from 'react';
import { Check, X, User as UserIcon } from 'lucide-react';
import api from '../lib/api';

export default function AdminApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [activeTab, setActiveTab] = useState<'LEAVE' | 'REIMBURSE'>('LEAVE');

  const fetchData = async () => {
    try {
      const [leaveRes, reimburseRes] = await Promise.all([
        api.get('/leaves'),
        api.get('/reimbursements')
      ]);
      setLeaves(leaveRes.data);
      setReimbursements(reimburseRes.data);
    } catch (err) {
      console.error("Gagal mengambil data approvals");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (
    type: 'leaves' | 'reimbursements',
    id: number,
    status: 'APPROVED' | 'REJECTED',
    isPaid?: boolean
  ) => {
    try {
      await api.patch(`/${type}/${id}`, { status, isPaid });
      alert(`Berhasil update status menjadi ${status}`);
      fetchData();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('LEAVE')}
          className={`pb-4 px-4 font-bold transition ${activeTab === 'LEAVE'
            ? 'border-b-2 border-indigo-600 text-indigo-600'
            : 'text-gray-400'
            }`}
        >
          Persetujuan Cuti
        </button>
        <button
          onClick={() => setActiveTab('REIMBURSE')}
          className={`pb-4 px-4 font-bold transition ${activeTab === 'REIMBURSE'
            ? 'border-b-2 border-indigo-600 text-indigo-600'
            : 'text-gray-400'
            }`}
        >
          Persetujuan Reimburse
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Pegawai</th>
              <th className="px-6 py-4">
                {activeTab === 'LEAVE' ? 'Periode' : 'Deskripsi'}
              </th>
              <th className="px-6 py-4">Detail</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {(activeTab === 'LEAVE' ? leaves : reimbursements).map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50">

                {/* Pegawai */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                      <UserIcon size={16} />
                    </div>
                    <span className="font-medium text-gray-800">
                      {item.user?.name}
                    </span>
                  </div>
                </td>

                {/* Periode / Deskripsi */}
                <td className="px-6 py-4 text-sm">
                  {activeTab === 'LEAVE' ? (
                    <div>
                      <div>
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </div>

                      {/* Badge Paid / Unpaid */}
                      {item.isPaid ? (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Paid Leave
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          Cuti Tak Berbayar
                        </span>
                      )}
                    </div>
                  ) : (
                    item.description
                  )}
                </td>

                {/* Detail */}
                <td className="px-6 py-4 text-sm">
                  {activeTab === 'LEAVE' ? (
                    item.reason
                  ) : (
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(item.amount)
                  )}
                </td>

                {/* Aksi */}
                <td className="px-6 py-4">
                  {item.status === 'PENDING' ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          if (activeTab === 'LEAVE') {
                            const choiceRaw = window.prompt("Ketik: paid / unpaid");

                            const choice = choiceRaw?.toLowerCase().trim();

                            if (choice === "paid" || choice === "unpaid") {
                              const isPaid = choice === "paid";

                              handleUpdateStatus(
                                'leaves',
                                item.id,
                                'APPROVED',
                                isPaid
                              );
                            } else {
                              alert("Input harus 'paid' atau 'unpaid'");
                            }
                          } else {
                            handleUpdateStatus(
                              'reimbursements',
                              item.id,
                              'APPROVED'
                            );
                          }
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            activeTab === 'LEAVE' ? 'leaves' : 'reimbursements',
                            item.id,
                            'REJECTED'
                          )
                        }
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`text-center text-xs font-bold px-2 py-1 rounded-full ${item.status === 'APPROVED'
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-600 bg-red-50'
                        }`}
                    >
                      {item.status}
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {(activeTab === 'LEAVE' ? leaves : reimbursements).length === 0 && (
          <div className="p-10 text-center text-gray-400">
            Tidak ada pengajuan yang masuk.
          </div>
        )}
      </div>
    </div>
  );
}