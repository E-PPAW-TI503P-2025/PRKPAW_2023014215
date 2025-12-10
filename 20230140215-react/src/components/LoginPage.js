import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 

const API_URL = 'http://localhost:3001/api/auth/login';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        email: email,
        password: password
      });

      const token = response.data.token;
      // Simpan token ke localStorage
      localStorage.setItem('token', token);

      // Arahkan ke dashboard
      navigate('/dashboard');

    } catch (err) {
      // Tangani error dan tampilkan di UI
      setError(err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      // Mario Bros Castle/Ground Background
      style={{
        backgroundColor: '#4e342e', // Coklat Gelap Tanah/Pondasi
        backgroundImage: 'linear-gradient(to right, #6d4c41 1px, transparent 1px), linear-gradient(to bottom, #6d4c41 1px, transparent 1px)', // Pola Bata
        backgroundSize: '40px 40px',
      }}
    >
      {/* Container Card Login (Efek Question Block/Castle Door) */}
      <div 
        className="p-8 w-full max-w-md relative shadow-2xl transition-transform transform hover:scale-[1.01]"
        style={{
          // Gaya Question Block
          backgroundColor: '#ffc300', // Kuning Koin
          border: '6px solid black',
          boxShadow: '10px 10px 0px 0px #a0522d', // Shadow Coklat
          backgroundImage: 'radial-gradient(circle at 50% 50%, #ffd700 10%, transparent 10%), radial-gradient(circle at 0% 0%, #ffeb3b 5%, transparent 5%)',
          backgroundSize: '30px 30px',
        }}
      >

        <div className="text-center mb-8 border-b-4 border-black pb-4 border-double">
          <h2 className="text-4xl font-extrabold text-black uppercase tracking-widest" style={{ textShadow: "3px 3px 0px #ffffff" }}>
            🔑 LOGIN
          </h2>
          <p className="text-sm font-mono mt-2 italic text-black font-bold">
            
          </p>
        </div>
        
        {/* Pesan Error ala Game Over/Fire Flower */}
        {error && (
          <div className="bg-[#ff4500] text-white p-4 mb-5 font-bold border-4 border-black shadow-[4px_4px_0px_0px_#8b0000]" role="alert">
            <p className="font-extrabold border-b border-white inline-block mb-1 text-lg">ERROR</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-mono">
          
          {/* INPUT EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-black mb-1 uppercase tracking-wide"
              style={{ textShadow: '1px 1px 0 #ffffff' }}
            >
              Email :
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="mario@world1.com"
              className="mt-1 w-full px-4 py-3 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-[#0070c0] focus:bg-[#e0ffff] transition-colors"
              style={{ boxShadow: '2px 2px 0 #000000' }}
            />
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-black mb-1 uppercase tracking-wide"
              style={{ textShadow: '1px 1px 0 #ffffff' }}
            >
              Password :
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="***"
              className="mt-1 w-full px-4 py-3 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-[#0070c0] focus:bg-[#e0ffff] transition-colors"
              style={{ boxShadow: '2px 2px 0 #000000' }}
            />
          </div>

          {/* TOMBOL LOGIN: Efek POW Block */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#ff4500] text-white font-extrabold shadow border-b-8 border-[#8b0000] hover:bg-[#ff6347] active:border-b-0 active:mt-2 transition-all uppercase tracking-widest text-lg"
            style={{ 
                borderRadius: '5px',
                // Garis putus-putus seperti POW Block
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,.2) 0px, rgba(0,0,0,.2) 2px, transparent 2px, transparent 5px)',
                backgroundSize: '8px 8px'
            }}
          >
            Masuk 
          </button>
        </form>

        {/* Tombol/Link Register: Menyerupai Warp Pipe */}
        <div className="mt-8 pt-6 border-t-4 border-black border-dotted text-center">
          <p className="text-sm text-black mb-3 font-mono font-bold">
            Belum ada akun?
          </p>
          <Link 
            to="/register" 
            className="inline-block py-2 px-8 bg-[#339933] text-white font-bold shadow border-b-4 border-[#2e8b57] hover:bg-[#2e8b57] transition-all uppercase tracking-wider text-sm"
            style={{ 
                borderRadius: '10px / 30px',
                boxShadow: '4px 4px 0px 0px #000000' 
            }}
          >
            Lakukan Pendaftaran
          </Link>
        </div>
        
      </div>
      
      <footer className="mt-8 text-white text-xs font-mono opacity-80" style={{ textShadow: '1px 1px 0 #000000' }}>
        Koopa Troopa Troop © 2025
      </footer>

    </div>
  );
}

export default LoginPage;