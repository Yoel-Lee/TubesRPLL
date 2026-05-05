import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';

export default function LeaveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarLeaves = async () => {
      try {
        const { data } = await api.get('/leaves/calendar');
        setLeaves(data);
      } catch (error) {
        console.error("Gagal mengambil data kalender", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarLeaves();
  }, []);

  // Logika Kalender
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const getLeavesForDay = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);

    return leaves.filter(leave => {
      const start = new Date(leave.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.endDate);
      end.setHours(23, 59, 59, 999);
      
      return checkDate >= start && checkDate <= end;
    });
  };

  const colors = ['bg-pink-100 text-pink-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700'];
  const getColorForName = (name: string) => colors[name.length % colors.length];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kalender Cuti Bersama</h2>
          <p className="text-gray-500 text-sm">Lihat jadwal pegawai yang sedang berhalangan hadir.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        {/* Header Navigasi Kalender */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} className="p-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-xl font-black text-gray-800 tracking-wide">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Memuat jadwal cuti...</div>
        ) : (
          <div>
            {/* Nama Hari (Header Grid) */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-[11px] font-black uppercase tracking-widest text-gray-400 pb-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Kotak-kotak Tanggal */}
            <div className="grid grid-cols-7 gap-2">
              {/* Padding kosong sebelum tanggal 1 */}
              {Array.from({ length: firstDayIndex }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[100px] bg-gray-50/50 rounded-2xl border border-transparent"></div>
              ))}

              {/* Tanggal Sebenarnya */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayLeaves = getLeavesForDay(day);
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                return (
                  <div key={day} className={`min-h-[100px] p-2 rounded-2xl border transition-all ${isToday ? 'border-indigo-400 bg-indigo-50/30' : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm'}`}>
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    
                    {/* Daftar Pegawai yang cuti di kotak ini */}
                    <div className="space-y-1 mt-1">
                      {dayLeaves.map((leave, i) => (
                        <div key={i} className={`text-[10px] font-bold px-2 py-1 rounded-md truncate ${getColorForName(leave.user.name)}`} title={leave.user.name}>
                          {leave.user.name.split(' ')[0]} {/* Tampilkan nama depan saja agar muat */}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}