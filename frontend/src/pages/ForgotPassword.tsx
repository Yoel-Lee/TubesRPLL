import { useState } from 'react';
import api from '../lib/api';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-indigo-600 mb-6 hover:underline text-sm">
          <ArrowLeft size={16} /> Kembali ke Login
        </Link>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lupa Password?</h2>
        <p className="text-gray-500 mb-6 text-sm">Masukkan email Anda untuk menerima instruksi reset password.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" required placeholder="email@hris.com"
              className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Kirim Instruksi
          </button>
        </form>
        {message && <p className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</p>}
      </div>
    </div>
  );
}