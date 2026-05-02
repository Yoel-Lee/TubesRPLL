import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Lock } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      alert("Password berhasil diganti!");
      navigate('/login');
    } catch (err) {
      alert("Token kadaluarsa atau tidak valid.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Atur Ulang Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative text-left">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" required placeholder="Password Baru"
              className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition">
            Simpan Password Baru
          </button>
        </form>
      </div>
    </div>
  );
}