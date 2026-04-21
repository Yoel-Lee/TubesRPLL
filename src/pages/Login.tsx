import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // Mendefinisikan tipe data state sebagai string
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Nanti di sini kita panggil REST API untuk verifikasi
    console.log("Login dengan:", email, password);
    
    // Simulasi sukses login, pindah ke dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '50px' }}>
      <h2>Login Portal HRIS</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <br />
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}