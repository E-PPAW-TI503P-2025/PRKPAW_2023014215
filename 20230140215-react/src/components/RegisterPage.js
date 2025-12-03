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

      showMessage(response.data.message || '1-UP! Registrasi Berhasil.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
      
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : 'Game Over. Registrasi gagal.';
      showMessage(errorMessage, 'error');
    }
  };

  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
            backgroundColor: "#202020", // Underground Level (Black)
            fontFamily: '"Press Start 2P", cursive',
        }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

      {/* Container */}
      <div 
        className="p-6 w-full max-w-md relative z-10"
        style={{
            backgroundColor: "#fbd000", // Question Block Yellow
            border: "4px solid #000000",
            boxShadow: "8px 8px 0px 0px #ffffff", // White shadow for contrast
        }}
      >
        <div className="text-center mb-6 border-b-4 border-black pb-4">
            <h2 className="text-xl text-black mb-2 leading-loose">
            Formulir Pendaftaran
            </h2>
            <p className="text-[#795548] text-xs font-mono mt-2 italic">Lengkapi data untuk melakukan Registrasi.</p>
        </div>

        {success && (
          <div className="bg-[#009c00] text-white p-3 mb-4 text-[10px] border-4 border-black text-center">
            <p>★ {success}</p>
          </div>
        )}

        {error && (
          <div className="bg-[#e70012] text-white p-3 mb-4 text-[10px] border-4 border-black text-center">
             <p>! {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-[10px] mb-1 text-black">Nama Lengkap :</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-2 py-3 bg-white border-4 border-black text-black focus:outline-none"
              style={{ fontSize: '10px' }}
            />
          </div>

          <div>
            <label className="block text-[10px] mb-1 text-black">EMAIL :</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-2 py-3 bg-white border-4 border-black text-black focus:outline-none"
              style={{ fontSize: '10px' }}
            />
          </div>

          <div>
            <label className="block text-[10px] mb-1 text-black">PASSWORD :</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-2 py-3 bg-white border-4 border-black text-black focus:outline-none"
              style={{ fontSize: '10px' }}
            />
          </div>

          <div>
            <label className="block text-[10px] mb-1 text-black">PILIH PERAN :</label>
            <div className="relative">
                <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-2 py-3 bg-white border-4 border-black text-black appearance-none cursor-pointer focus:outline-none"
                style={{ fontSize: '10px' }}
                >
                <option value="mahasiswa">Mahasiswa (Anggota)</option>
                <option value="admin">Administrator (ADMIN)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-black">▼</div>
            </div>
          </div>

          <div className="pt-2">
            <button
                type="submit"
                className="w-full py-3 px-4 bg-[#e70012] text-white text-xs border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
            >
                (REGISTER)
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-black text-[10px] hover:text-[#e70012]">
             &lt; BACK TO TITLE SCREEN
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;