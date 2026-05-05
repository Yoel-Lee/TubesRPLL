import { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import api from '../lib/api';

export default function ActivityLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/activities');
        setLogs(data);
      } catch (error) {
        console.error("Gagal memuat activity log", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Activity Log</h2>
          <p className="text-gray-500 text-sm">Jejak rekam aktivitas pengguna (Audit Trail).</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">Memuat log aktivitas...</div>
        ) : logs.length > 0 ? (
          <div className="relative border-l-2 border-indigo-100 ml-4 space-y-8 pb-4">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-8 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 group-hover:bg-indigo-500 group-hover:scale-125 transition-all"></div>
                
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-900">{log.user.name}</span>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-md text-[10px] font-black tracking-wider uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                      <Clock size={12} />
                      {formatDateTime(log.createdAt)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 font-bold">Belum ada aktivitas yang tercatat.</div>
        )}
      </div>
    </div>
  );
}