import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Webcam from 'react-webcam'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// --- LEAFLET ICON SETUP ---
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// URL API
const API_URL_CHECKIN = 'http://localhost:3001/api/presensi/checkin';
const API_URL_CHECKOUT = 'http://localhost:3001/api/presensi/checkout';

function PresensiPage() {
  // State Data
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null); 
  const [userName, setUserName] = useState('Pengguna');
  const [userRole, setUserRole] = useState('');
  
  // State UI
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Helper: Get Token
  const getToken = () => localStorage.getItem('token');

  // --- LOGIC: LOGOUT & AUTH ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = getToken();
    if (!token) return handleLogout();

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.nama || 'Pengguna');
      setUserRole(decoded.role || 'mahasiswa');
      if (decoded.exp * 1000 < Date.now()) handleLogout();
    } catch (err) {
      handleLogout();
    }
  }, [handleLogout]);

  // --- LOGIC: LOKASI ---
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          setError('Gagal mendapatkan lokasi: ' + err.message);
          setCoords(null);
        }
      );
    } else {
      setError('Geolocation tidak didukung browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // --- LOGIC: WEBCAM ---
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // --- LOGIC: SUBMIT ---
  const handleSubmit = async (type) => {
    setError(null);
    setMessage('');

    if (!coords) {
      setError('Lokasi belum ditemukan. Tunggu sebentar...');
      return;
    }
    if (!image) {
      setError('Harap ambil foto selfie terlebih dahulu!');
      return;
    }

    setIsLoading(true);

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg');

      const url = type === 'in' ? API_URL_CHECKIN : API_URL_CHECKOUT;
      const actionText = type === 'in' ? 'Check-in' : 'Check-out';

      await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMessage(`${actionText} berhasil pada pukul ${timeNow} WIB`);
      
      // Tetap jaga foto untuk Check-Out
    } catch (err) {
      console.error(err);
      const serverMsg = err.response ? err.response.data.message : 'Terjadi kesalahan pada server';
      setError(`Gagal: ${serverMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPresensi = () => navigate('/laporan');

  // --- RENDER SECTION ---
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4"
      // Mario Bros Sky Background (Langit Biru cerah)
      style={{
        backgroundColor: '#6b8cff', 
        backgroundImage: 'radial-gradient(circle, #ffffff 15%, transparent 20%)', 
        backgroundSize: '200px 200px',
        backgroundPosition: '0 50px, 100px 150px'
      }}
    >
      {/* Header: Papan Skor */}
      <header 
        className="w-full max-w-xl flex justify-between items-center py-3 px-4 mb-8 border-4 border-black bg-[#ff8c00] text-black shadow-[4px_4px_0px_0px_#000000]"
        style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.1) 0px, rgba(255,255,255,.1) 1px, transparent 1px, transparent 8px)',
            backgroundSize: '10px 10px',
        }}
      >
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white shadow-text-black" style={{ textShadow: '2px 2px 0 #000000' }}>
          LEVEL PRESENSI
        </h1>
        <button
          onClick={handleLogout}
          className="py-1 px-4 text-sm font-bold bg-[#f7e000] text-black border-4 border-black shadow-[2px_2px_0px_0px_#8b4513] hover:bg-[#f3ca40] transition"
        >
          KELUAR 🚪
        </button>
      </header>

      {/* Main Card: Area Permainan (Warna Tanah/Bata) */}
      <div 
        className="p-8 w-full max-w-xl space-y-6 relative shadow-xl"
        style={{
          backgroundColor: '#a52a2a', // Coklat Bata
          border: '4px solid black',
          boxShadow: '8px 8px 0px 0px #8b4513', // Shadow Coklat Tua
          backgroundImage: 'linear-gradient(to right, #8b4513 1px, transparent 1px), linear-gradient(to bottom, #8b4513 1px, transparent 1px)',
          backgroundSize: '25px 25px',
          backgroundPosition: '0 0, 0 0',
        }}
      >
        <div className="pb-4 border-b-4 border-black border-dotted bg-[#ffeb3b] p-3 -mt-3 -mx-3">
          <h2 className="text-2xl font-bold text-black">Pahlawan: {userName}.</h2>
          <p className="text-sm text-black italic mt-1 font-mono">Role: {userRole} 🍄</p>
        </div>

        {/* --- AREA NOTIFIKASI --- */}
        {message && (
          <div className="bg-[#339933] text-white p-4 font-bold border-4 border-black shadow-[4px_4px_0px_0px_#2e8b57] text-sm">
            <p>✅ SUKSES! {message} (COIN GET!)</p>
          </div>
        )}
        {error && (
          <div className="bg-[#ff4500] text-white p-4 font-bold border-4 border-black shadow-[4px_4px_0px_0px_#8b0000] text-sm">
            <p>❌ ERROR: {error} (GOOMBA ATTACK!)</p>
          </div>
        )}

        {/* --- BAGIAN 1: PETA (WORLD MAP) --- */}
        <div className="space-y-4 bg-white/90 p-3 border-4 border-black shadow-[3px_3px_0px_0px_#8b4513]">
          <h3 className="text-lg font-bold text-black flex items-center border-l-4 border-[#ffc300] pl-2">
            📍 Lokasi Peta Dunia
            <button onClick={getLocation} className="ml-3 text-sm text-[#0070c0] underline hover:text-black italic font-normal">
              (Update GPS Star)
            </button>
          </h3>

          {coords ? (
            <p className="text-sm text-[#339933] font-mono bg-white/50 p-2 inline-block border-2 border-[#339933] font-bold">
              Koordinat ditemukan!
            </p>
          ) : (
            <p className="text-sm text-[#ff4500] font-mono bg-white/50 p-2 inline-block border-2 border-[#ff4500] font-bold">
              Mencari Sinyal Satelit...
            </p>
          )}

          {coords && (
            <div
              className="p-1 shadow-inner bg-[#6b8cff]"
              style={{ border: "2px solid #000000" }}
            >
              <div className="overflow-hidden h-[200px] w-full" style={{ filter: "sepia(50%) hue-rotate(180deg) contrast(110%)" }}>
                <MapContainer
                  key={`${coords.lat}-${coords.lng}`}
                  center={[coords.lat, coords.lng]}
                  zoom={16}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>Level Ini!</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* --- BAGIAN 2: KAMERA (PIPA WARP) --- */}
        <div className="space-y-2 pt-4 border-t-4 border-black border-dashed">
            <h3 className="text-lg font-bold text-white flex items-center border-l-4 border-[#f7e000] pl-2" style={{ textShadow: '1px 1px 0 #000000' }}>
                📸 Warp Pipe View
            </h3>
            <div className="border-4 border-[#2e8b57] bg-black overflow-hidden shadow-lg relative" 
                 style={{ minHeight: '250px', borderRadius: '10px / 30px' }}> {/* Efek Pipa */}
                {image ? (
                    <img src={image} alt="Selfie Preview" className="w-full h-auto object-cover" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-auto"
                        videoConstraints={{ facingMode: "user" }}
                    />
                )}
            </div>
            {/* Tombol Kamera: Menyerupai Super Mushroom */}
            <div className="flex gap-2">
                {!image ? (
                    <button onClick={capture} className="w-full py-2 bg-[#ff4500] text-white font-extrabold border-4 border-black hover:bg-[#ff6347] shadow-[2px_2px_0px_0px_#8b0000] uppercase text-sm">
                        Jepret (POWER UP)
                    </button>
                ) : (
                    <button onClick={() => setImage(null)} className="w-full py-2 bg-[#0070c0] text-white font-extrabold border-4 border-black hover:bg-[#0090f0] shadow-[2px_2px_0px_0px_#000000] uppercase text-sm">
                        Foto Ulang (KOOPA SHELL)
                    </button>
                )}
            </div>
        </div>

        {/* --- TOMBOL AKSI SUBMIT: CHECK IN/OUT --- */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black border-double">
          <button
            onClick={() => handleSubmit('in')}
            disabled={isLoading || !coords || !image}
            className={`py-3 px-4 text-white font-extrabold shadow uppercase tracking-widest transition-all ${
              !isLoading && coords && image
                ? 'bg-[#339933] hover:bg-[#2e8b57] border-b-4 border-black active:border-b-0 active:mt-1' // Warna Pipa
                : 'bg-gray-500 cursor-not-allowed opacity-50 border-b-4 border-gray-700'
            }`}
          >
            {isLoading ? 'LOADING...' : 'Check (In) ⬆️'}
          </button>

          <button
            onClick={() => handleSubmit('out')}
            disabled={isLoading || !coords || !image}
            className={`py-3 px-4 text-white font-extrabold shadow uppercase tracking-widest transition-all ${
              !isLoading && coords && image
                ? 'bg-[#ffc300] hover:bg-[#ffdb58] border-b-4 border-black active:border-b-0 active:mt-1' // Warna Koin
                : 'bg-gray-500 cursor-not-allowed opacity-50 border-b-4 border-gray-700'
            }`}
          >
             {isLoading ? 'LOADING...' : 'Check (Out) ⬇️'}
          </button>
        </div>

        {userRole === 'admin' && (
          <div className="pt-2">
            <button
              onClick={handleViewPresensi}
              className="w-full py-2 px-4 bg-[#0070c0] text-white font-bold border-4 border-black hover:bg-[#0090f0] transition shadow-md uppercase text-sm"
            >
              🏰 Lihat Laporan (CASTLE)
            </button>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-white text-xs font-mono opacity-80" style={{ textShadow: '1px 1px 0 #000000' }}>
        Game By Nintendo © 2025
      </footer>
    </div>
  );
}

export default PresensiPage;