import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// --- LEAFLET IMPORTS (Untuk Peta Visual Saja) ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix Icon Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function DashboardPage() {
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('');
  const [coords, setCoords] = useState(null); // Hanya untuk visualisasi peta
  
  const navigate = useNavigate();

  // 1. LOGOUT
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // 2. NAVIGASI (Tombol-tombol)
  const goToPresensi = () => navigate('/presensi');
  const goToLaporan = () => navigate('/laporan');

  // 3. AMBIL LOKASI (Hanya untuk visualisasi peta di dashboard)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return handleLogout();

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.nama || 'User');
      setUserRole(decoded.role || 'user');
      if (decoded.exp * 1000 < Date.now()) handleLogout();
    } catch (err) {
      handleLogout();
    }

    // Ambil lokasi sekedar untuk menampilkan peta "Lokasi Anda Sekarang"
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, [handleLogout]);

  // --- TAMPILAN DASHBOARD ---
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4"
      // Mario Bros Sky Background (Langit Biru cerah)
      style={{
        backgroundColor: '#6b8cff', // Warna Langit Mario
        backgroundImage: 'radial-gradient(circle, #ffffff 15%, transparent 20%)', // Efek Awan
        backgroundSize: '200px 200px',
        backgroundPosition: '0 50px, 100px 150px'
      }}
    >
      {/* HEADER: Coin Block / Papan Skor */}
      <header 
        className="w-full max-w-xl flex justify-between items-center py-3 px-4 mb-8 border-4 border-black bg-[#ff8c00] text-black shadow-[4px_4px_0px_0px_#000000]"
        style={{
            // Gaya Kotak Koin (Coin Block)
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.1) 0px, rgba(255,255,255,.1) 1px, transparent 1px, transparent 8px)',
            backgroundSize: '10px 10px',
        }}
      >
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white shadow-text-black"
            style={{ textShadow: '2px 2px 0 #000000' }}>
          ⭐ DASHBOARD
        </h1>
        <button
          onClick={handleLogout}
          // Tombol Keluar: Menyerupai 'Question Block' atau 'Warp Zone' sign
          className="py-1 px-4 text-sm font-bold bg-[#f7e000] text-black border-4 border-black shadow-[2px_2px_0px_0px_#8b4513] hover:bg-[#f3ca40] transition"
        >
          KELUAR 🚪
        </button>
      </header>

      {/* KARTU UTAMA: Menyerupai Balok Bata (Brick Block) */}
      <div 
        className="p-8 w-full max-w-xl space-y-6 relative shadow-lg"
        style={{
          // Gaya Balok Bata (Brick Block)
          backgroundColor: '#a52a2a', // Coklat Bata
          border: '4px solid black',
          boxShadow: '8px 8px 0px 0px #8b4513', // Shadow Coklat Tua
          backgroundImage: 'linear-gradient(to right, #8b4513 1px, transparent 1px), linear-gradient(to bottom, #8b4513 1px, transparent 1px)',
          backgroundSize: '25px 25px',
          backgroundPosition: '0 0, 0 0',
        }}
      >
        {/* Info User */}
        <div className="text-center border-b-4 border-black border-dotted pb-6">
          <h2 className="text-3xl font-extrabold text-white" 
              style={{ textShadow: '2px 2px 0 #000000' }}>
            👑 {userName}
          </h2>
          <p className="text-sm text-[#f7e000] italic font-mono uppercase tracking-widest mt-2"
             style={{ textShadow: '1px 1px 0 #000000' }}>
            {userRole} USER
          </p>
        </div>

        {/* --- MENU TOMBOL --- */}
        <div className="grid gap-6 pt-4">
            
            {/* TOMBOL 1: KE HALAMAN ABSEN (PIPA WARP ZONE) */}
            <button
                onClick={goToPresensi}
                className="w-full py-5 bg-[#339933] text-white text-2xl font-extrabold uppercase tracking-widest shadow-[4px_4px_0px_0px_#000000] hover:bg-[#2e8b57] hover:scale-[1.01] transition-transform border-4 border-black flex items-center justify-center gap-3"
                style={{ borderRadius: '15px / 45px', borderBottom: 'none' }} // Efek Pipa
            >
                PRESENSI 🍄
            </button>

            {/* TOMBOL 2: KE HALAMAN LAPORAN (GREEN SHELL / MUSHROOM) */}
            <button
                onClick={goToLaporan}
                className="w-full py-4 bg-[#f0e68c] text-black font-bold uppercase tracking-wider border-4 border-black hover:bg-[#ffeb3b] transition shadow-[3px_3px_0px_0px_#a52a2a] flex items-center justify-center gap-3"
                style={{ borderRadius: '5px' }}
            >
                📜 LAPORAN
            </button>
        </div>
      </div>

      <footer className="mt-10 text-black text-xs font-mono opacity-80"
              style={{ textShadow: '1px 1px 0 #ffffff' }}>
        Koopa Troopa Troop © 2025
      </footer>
    </div>
  );
}

export default DashboardPage; 