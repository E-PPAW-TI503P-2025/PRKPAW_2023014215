import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
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

const API_URL = 'http://localhost:3001/api/presensi';

function DashboardPage() {
  const [coords, setCoords] = useState(null);
  const [userName, setUserName] = useState('Player');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const getLocation = () => {
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) setError('Akses lokasi ditolak.');
          else if (error.code === error.POSITION_UNAVAILABLE) setError('Lokasi tidak tersedia.');
          else setError('Gagal mendapatkan lokasi.');
          setCoords(null);
        }
      );
    } else {
      setError('Browser tidak support Geolocation.');
      setCoords(null);
    }
  };

  const showTempMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } else {
      setMessage(msg);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!coords) return showTempMessage('Lokasi belum ditemukan!', true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/checkin`,
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTempMessage(response.data.message || '1-UP! Check-in Berhasil!');
    } catch (err) {
      showTempMessage(err.response ? err.response.data.message : 'Check-in Gagal.', true);
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    if (!coords) return showTempMessage('Lokasi belum ditemukan!', true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/checkout`,
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTempMessage(response.data.message || 'Stage Clear! Check-out Berhasil!');
    } catch (err) {
      showTempMessage(err.response ? err.response.data.message : 'Check-out Gagal.', true);
    }
  };

  const handleViewPresensi = () => navigate('/laporan');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return handleLogout();
    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.nama || 'Player');
      setUserRole(decoded.role || 'mahasiswa');
      if (decoded.exp * 1000 < Date.now()) handleLogout();
    } catch (err) {
      handleLogout();
    }
    getLocation();
  }, [handleLogout]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4"
      style={{
        backgroundColor: "#5c94fc", // Sky Blue Mario
        fontFamily: '"Press Start 2P", cursive',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

      {/* Awan-awan Dekorasi (CSS Only) */}
      <div className="absolute top-10 left-10 text-white opacity-80 text-6xl">☁</div>
      <div className="absolute top-20 right-20 text-white opacity-80 text-6xl">☁</div>

      {/* HUD Header */}
      <header className="w-full max-w-xl flex justify-between items-start py-4 px-4 mb-4 text-white text-[10px] drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
        <div>
            <p className="text-[#fbd000] mb-1">NAMA :</p>
            <p>{userName.toUpperCase()}</p>
        </div>
        <div className="text-right">
             <p className="text-[#fbd000] mb-1">STATUS :</p>
             <p>{userRole.toUpperCase()}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-600 border-2 border-white px-2 py-1 hover:bg-red-800">
            KELUAR
        </button>
      </header>

      {/* Game Card */}
      <div 
        className="w-full max-w-xl relative p-1"
        style={{
          backgroundColor: "#ffccc5", 
          border: "4px solid #000",
          boxShadow: "8px 8px 0px 0px rgba(0,0,0,0.5)"
        }}
      >
        {/* Title Box */}
        <div className="bg-[#c84c0c] p-4 border-b-4 border-black text-white mb-4 text-center">
            <h2 className="text-xs">ABSENSI </h2>
        </div>

        <div className="px-4 pb-4 space-y-4">
            {/* Notification Box */}
            {message && (
                <div className="bg-[#009c00] border-4 border-black text-white p-3 text-[10px] text-center">
                    <p>★ {message}</p>
                </div>
            )}
            {error && (
                <div className="bg-[#e70012] border-4 border-black text-white p-3 text-[10px] text-center">
                    <p>☠ {error}</p>
                </div>
            )}

            {/* MAP AREA */}
            <div className="border-4 border-black bg-[#9290ff] p-1">
                <div className="flex justify-between items-center bg-black text-white p-2 mb-1">
                    <span className="text-[10px]">MAP : </span>
                    <button onClick={getLocation} className="text-[#fbd000] text-[10px] hover:underline">RESET</button>
                </div>
                {coords ? (
            <p className="text-sm text-[#33691e] font-mono bg-[#dce775] bg-opacity-20 p-2 inline-block border border-[#cddc39]">
              Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-sm text-[#bf360c] font-mono bg-[#ffccbc] bg-opacity-20 p-2 inline-block border border-[#ffab91]">
              Menunggu sinyal lokasi...
            </p>
          )}
                <div className="h-[250px] w-full bg-white relative">
                    {coords ? (
                        <MapContainer center={[coords.lat, coords.lng]} zoom={17} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[coords.lat, coords.lng]}><Popup>Here!</Popup></Marker>
                        </MapContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[8px] text-black">
                            <p>LOADING TERRAIN...</p>
                        </div>
                    )}
                    
                </div>
            </div>

            {/* Action Blocks */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleCheckIn}
                    disabled={!coords}
                    className={`py-4 border-4 border-black text-[10px] shadow-[4px_4px_0_0_black] active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 ${coords ? 'bg-[#fbd000] text-black hover:bg-yellow-300' : 'bg-gray-500 text-white cursor-not-allowed'}`}
                >
                   <span className="text-lg">?</span> CHECK IN
                </button>

                <button
                    onClick={handleCheckOut}
                    disabled={!coords}
                    className={`py-4 border-4 border-black text-[10px] shadow-[4px_4px_0_0_black] active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 ${coords ? 'bg-[#e70012] text-white hover:bg-red-500' : 'bg-gray-500 text-white cursor-not-allowed'}`}
                >
                   <span className="text-lg">!</span> CHECK OUT
                </button>
            </div>

            {userRole === 'admin' && (
                <button onClick={handleViewPresensi} className="w-full py-3 bg-[#009c00] text-white text-[10px] border-4 border-black shadow-[4px_4px_0_0_black] hover:bg-green-600">
                    ENTER WARP PIPE (LAPORAN) &gt;&gt;
                </button>
            )}
        </div>
      </div>
      
      {/* Ground */}
      <div className="fixed bottom-0 w-full h-12 bg-[#c84c0c] border-t-4 border-black" 
           style={{ backgroundImage: "linear-gradient(45deg, #d46b38 25%, transparent 25%, transparent 75%, #d46b38 75%, #d46b38), linear-gradient(45deg, #d46b38 25%, transparent 25%, transparent 75%, #d46b38 75%, #d46b38)", backgroundSize: "20px 20px" }}>
      </div>
    </div>
  );
}

export default DashboardPage;