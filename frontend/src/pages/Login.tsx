import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/attendance');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal, periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <LogIn className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-gray-500 mt-2">Silakan masuk ke akun HRIS Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-xl animate-shake">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Kantor</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" 
                required 
                placeholder="nama@ithb.ac.id" 
                className="w-full p-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <Link 
                to="/forgot-password" 
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full p-3.5 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 disabled:bg-gray-400 disabled:shadow-none mt-4"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </button>
        </form>

       
      </div>
    </div>
  );
}