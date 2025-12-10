import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const showMessage = (msg, type = 'error') => {
    if (type === 'success') {
      setSuccess(msg);
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(msg);
      setSuccess(null);
      setTimeout(() => setError(null), 5000);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama, 
        email: email,
        password: password,
        role: role,
      });

      showMessage(response.data.message || 'Registrasi Berhasil! Anda akan diarahkan ke halaman Login.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
      
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Registrasi gagal. Coba lagi nanti.';
      showMessage(errorMessage, 'error');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      // Mario Bros Grass/Ground Background
      style={{
        backgroundColor: '#90ee90', // Hijau Rumput Muda
        backgroundImage: 'linear-gradient(to right, #698b69 1px, transparent 1px), linear-gradient(to bottom, #698b69 1px, transparent 1px)', // Pola Rumput
        backgroundSize: '40px 40px',
      }}
    >
      {/* Container Card Register (Efek Super Mushroom - Kepala Putih Titik Merah) */}
      <div 
        className="p-8 w-full max-w-md relative shadow-2xl transition-transform transform hover:scale-[1.005]"
        style={{
          backgroundColor: '#ffffff', // Kepala Jamur Putih
          border: '6px solid black',
          boxShadow: '10px 10px 0px 0px #8b4513', // Shadow Coklat Batang Jamur
          borderRadius: '20px',
          backgroundImage: 'radial-gradient(circle, #ff4500 15%, transparent 15%)', // Titik Merah
          backgroundSize: '80px 80px',
          backgroundPosition: '10px 10px, 50px 50px, 90px 30px'
        }}
      >

        <div className="text-center mb-6 border-b-4 border-black pb-4 border-double">
          <h2 className="text-3xl font-extrabold text-black uppercase tracking-widest" style={{ textShadow: "2px 2px 0px #ffeb3b" }}>
            📝 SILAHKAN MELAKUKAN PENDAFTARAN
          </h2>
         
        </div>

        {/* Pesan Sukses: Efek 1UP */}
        {success && (
          <div className="bg-[#339933] text-white p-4 font-bold border-4 border-black shadow-[4px_4px_0px_0px_#2e8b57] text-sm mb-4" role="alert">
            <p className="font-extrabold border-b border-white inline-block mb-1 text-lg">REGISTRASI BERHASIL</p>
            <p>{success}</p>
          </div>
        )}

        {/* Pesan Error: Efek Goomba */}
        {error && (
          <div className="bg-[#ff4500] text-white p-4 font-bold border-4 border-black shadow-[4px_4px_0px_0px_#8b0000] text-sm mb-4" role="alert">
             <p className="font-extrabold border-b border-white inline-block mb-1 text-lg">GOOMBA!</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          
          {/* Input Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-bold text-black mb-1 uppercase" style={{ textShadow: '1px 1px 0 #ffffff' }}>Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Your Character Name"
              className="w-full px-4 py-2 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-[#0070c0] focus:bg-[#e0ffff] transition-colors"
              style={{ boxShadow: '2px 2px 0 #000000' }}
            />
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-black mb-1 uppercase" style={{ textShadow: '1px 1px 0 #ffffff' }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="luigi@world2.com"
              className="w-full px-4 py-2 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-[#0070c0] focus:bg-[#e0ffff] transition-colors"
              style={{ boxShadow: '2px 2px 0 #000000' }}
            />
          </div>

          {/* Input Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-black mb-1 uppercase" style={{ textShadow: '1px 1px 0 #ffffff' }}>Kata Sandi</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 6 Coin"
              className="w-full px-4 py-2 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-[#0070c0] focus:bg-[#e0ffff] transition-colors"
              style={{ boxShadow: '2px 2px 0 #000000' }}
            />
          </div>

          {/* Input Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-bold text-black mb-1 uppercase" style={{ textShadow: '1px 1px 0 #ffffff' }}>Posisi :</label>
            <div className="relative">
                <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-white border-4 border-black text-black focus:outline-none focus:border-[#0070c0] focus:bg-[#e0ffff] appearance-none cursor-pointer"
                style={{ boxShadow: '2px 2px 0 #000000' }}
                >
                <option value="mahasiswa">Mahasiswa (Anggota)</option>
                <option value="admin">Administrator (Pengurus)</option>
                </select>
                {/* Custom Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>

          <div className="pt-4">
            <button
                type="submit"
                // Tombol Register: Warna Fire Flower
                className="w-full py-3 px-4 bg-[#ff4500] text-white font-extrabold uppercase tracking-widest shadow border-b-8 border-[#8b0000] hover:bg-[#ff6347] active:border-b-0 active:mt-2 transition-all text-lg"
                style={{ 
                    borderRadius: '5px',
                    // Garis putus-putus seperti POW Block
                    backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,.2) 0px, rgba(0,0,0,.2) 2px, transparent 2px, transparent 5px)',
                    backgroundSize: '8px 8px'
                }}
            >
                🚀 Register 
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center border-t-4 border-black border-dashed pt-4">
          <p className="text-sm text-black font-bold">
            Sudah Mempunyai akun?
            <Link to="/login" className="text-[#0070c0] font-bold underline hover:text-[#005a9c] ml-1 transition duration-150 uppercase tracking-wide">
              Login Sekarang!
            </Link>
          </p>
        </div>

      </div>

      <footer className="mt-8 text-black text-xs font-mono opacity-80" style={{ textShadow: '1px 1px 0 #ffffff' }}>
        System Developed by UNO © 2025
      </footer>
    </div>
  );
}

export default RegisterPage;