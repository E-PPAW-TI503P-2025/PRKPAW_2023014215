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
      localStorage.setItem('token', token);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Login gagal. Periksa kembali email dan password.');
    }
  };

  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
            backgroundColor: "#5c94fc", // Mario Sky Blue
            fontFamily: '"Press Start 2P", cursive', // Pixel Font
        }}
    >
      {/* Import Font Pixel */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}
      </style>

      {/* Awan-awan Dekorasi (CSS Only) */}
      <div className="absolute top-10 left-10 text-white opacity-80 text-6xl">☁</div>
      <div className="absolute top-20 right-20 text-white opacity-80 text-6xl">☁</div>

      {/* Container Box (Style Batu Bata / Brick) */}
      <div 
        className="p-8 w-full max-w-md relative z-10"
        style={{
            backgroundColor: "#ffffff",
            border: "4px solid #000000",
            boxShadow: "8px 8px 0px 0px #000000", // Hard shadow
        }}
      >
        {/* Header Title */}
        <div className="text-center mb-8">
            <h2 className="text-2xl text-[#e70012] mb-2" style={{ textShadow: "2px 2px #000" }}>
            ABSENSI 
            </h2>
            <div className="bg-[#fbd000] border-2 border-black p-2 inline-block">
                <p className="text-[10px] text-black">LOGIN </p>
            </div>
        </div>
        
        {/* Error Message Box */}
        {error && (
          <div className="bg-[#000] text-white p-3 mb-5 text-xs border-2 border-white text-center animate-pulse">
            <p>☠ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* INPUT EMAIL */}
          <div>
            <label className="block text-xs mb-2 text-black">EMAIL :</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@mario.com"
              className="w-full px-4 py-3 bg-[#e0e0e0] border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:bg-[#fff] focus:border-[#e70012]"
              style={{ fontSize: '10px' }}
            />
          </div>

          {/* INPUT PASSWORD */}
          <div>
            <label className="block text-xs mb-2 text-black">PASSWORD :</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
              className="w-full px-4 py-3 bg-[#e0e0e0] border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:bg-[#fff] focus:border-[#e70012]"
              style={{ fontSize: '10px' }}
            />
          </div>

          {/* TOMBOL LOGIN (Green Pipe Style) */}
          <button
            type="submit"
            className="w-full py-4 px-4 bg-[#009c00] text-white text-xs border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:bg-[#00b300]"
          >
           (LOGIN)
          </button>
        </form>

        <div className="mt-8 text-center pt-4 border-t-4 border-black border-dotted">
          <p className="text-[10px] mb-2">Belum terdaftar ?</p>
          <Link 
            to="/register" 
            className="text-[#e70012] text-xs hover:underline decoration-2"
          >
            Lakukan Pendaftaran &gt;
          </Link>
        </div>
      </div>
      
      {/* Lantai / Ground */}
      <div className="fixed bottom-0 w-full h-8 bg-[#c84c0c] border-t-4 border-black" 
           style={{ backgroundImage: "linear-gradient(45deg, #d46b38 25%, transparent 25%, transparent 75%, #d46b38 75%, #d46b38), linear-gradient(45deg, #d46b38 25%, transparent 25%, transparent 75%, #d46b38 75%, #d46b38)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }}>
      </div>
    </div>
  );
}

export default LoginPage;