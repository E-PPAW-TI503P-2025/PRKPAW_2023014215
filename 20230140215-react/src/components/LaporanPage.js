import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3001/api/presensi';

// 1. GANTI BASE URL JADI ROOT SERVER SAJA (HAPUS 'uploads/' DI SINI)
const SERVER_URL = 'http://localhost:3001/'; 

function LaporanPage() {
    const [laporan, setLaporan] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    };

    // --- 2. FUNGSI PINTAR UNTUK URL GAMBAR ---
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // Bersihkan backslash (\) jadi slash (/) untuk kompatibilitas Windows
        let cleanPath = imagePath.replace(/\\/g, '/');

        // Hapus slash di depan jika ada (misal: /uploads/... jadi uploads/...)
        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        // LOGIKA UTAMA: Cek apakah path sudah mengandung 'uploads/'
        if (cleanPath.startsWith('uploads/')) {
            // Jika SUDAH ADA 'uploads', jangan ditambah lagi. Langsung tempel ke SERVER_URL
            // Hasil: http://localhost:3001/uploads/file.jpg
            return `${SERVER_URL}${cleanPath}`;
        } else {
            // Jika BELUM ADA (cuma nama file), baru kita tambahkan 'uploads/'
            // Hasil: http://localhost:3001/uploads/file.jpg
            return `${SERVER_URL}uploads/${cleanPath}`;
        }
    };

    const renderLocation = (lat, long) => {
        if (!lat || !long) return <span className="text-gray-400">-</span>;
        // Ganti URL Google Maps biasa (google.com) untuk menghindari masalah rendering atau tautan mati
        // Saya asumsikan link ini untuk menampilkan lokasi, bukan masalah UI.
        const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${long}`;
        return (
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#0070c0] hover:underline font-bold text-xs"
               style={{ textShadow: '1px 1px 0 #ffffff' }}>
                <span>{parseFloat(lat).toFixed(5)}, {parseFloat(long).toFixed(5)}</span>
            </a>
        );
    };

    const fetchLaporan = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token'); 
            if (!token) { navigate('/login'); return; }

            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.presensi || response.data.data || [];
            setLaporan(data); 
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Gagal mengambil data');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => { fetchLaporan(); }, []); 

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-4"
            // Mario Bros Sky Background (Langit Biru cerah)
            style={{
                backgroundColor: '#6b8cff', // Warna Langit Mario
                backgroundImage: 'radial-gradient(circle, #ffffff 15%, transparent 20%)', // Efek Awan
                backgroundSize: '200px 200px',
                backgroundPosition: '0 50px, 100px 150px'
            }}>
            
            <header className="w-full max-w-7xl flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h2 className="text-3xl font-extrabold uppercase text-white" style={{ textShadow: '2px 2px 0 #000000' }}>
                    📜 RIWAYAT
                </h2>
                <Link to="/dashboard" 
                    // Tombol Kembali: Menyerupai 'Warp Pipe' kecil
                    className="py-2 px-4 bg-[#339933] text-white font-bold border-4 border-black shadow-[2px_2px_0px_0px_#2e8b57] hover:bg-[#2e8b57] text-sm"
                    style={{ borderRadius: '10px / 30px' }}>
                    ← KEMBALI
                </Link>
            </header>

            {/* Error Message: Menyerupai Teks Game Over */}
            {error && (
                <div className="bg-[#ff4500] text-white p-4 mb-4 font-bold border-4 border-black shadow-[4px_4px_0px_0px_#8b0000]">
                    ❌ ERROR: {error}
                </div>
            )}


            <div className="w-full max-w-7xl mb-6">
                <button onClick={fetchLaporan} disabled={isLoading} 
                    // Tombol Refresh: Menyerupai 'Star' atau 'Super Mushroom'
                    className="px-6 py-2 bg-[#ffc300] text-black font-extrabold border-4 border-black shadow-[4px_4px_0px_0px_#a0522d] hover:bg-[#ffdb58] transition">
                    {isLoading ? '⏳ Loading ...' : '🔄 REFRESH '}
                </button>
            </div>

            {/* TABEL: Menyerupai Area Permainan / Castle Wall */}
            <div className="w-full max-w-7xl p-6 relative shadow-2xl bg-[#a52a2a]" // Coklat Bata
                 style={{ border: '4px solid black', boxShadow: '8px 8px 0px 0px #8b4513' }}>
                <div className="overflow-x-auto border-4 border-black bg-white/90">
                    <table className="min-w-full divide-y divide-black">
                        {/* THEAD: Menyerupai Papan Tulis / Area Informasi */}
                        <thead className="bg-[#f0e68c] border-b-4 border-black"> 
                            <tr>
                                <th className="px-4 py-3 text-left font-extrabold text-black uppercase border-r-2 border-black">NO</th>
                                <th className="px-4 py-3 text-left font-extrabold text-black uppercase border-r-2 border-black">NAMA</th>
                                <th className="px-4 py-3 text-center font-extrabold text-black uppercase border-r-2 border-black">FOTO</th>
                                <th className="px-4 py-3 text-left font-extrabold text-black uppercase border-r-2 border-black">MASUK </th>
                                <th className="px-4 py-3 text-left font-extrabold text-black uppercase border-r-2 border-black">LOKASI</th>
                                <th className="px-4 py-3 text-left font-extrabold text-black uppercase border-r-2 border-black">KELUAR </th>
                                <th className="px-4 py-3 text-left font-extrabold text-black uppercase">STATUS</th>
                            </tr>
                        </thead>
                        {/* TBODY: Menyerupai Kotak Teks Game */}
                        <tbody className="divide-y divide-gray-400 text-sm text-black">
                            {laporan.map((item, index) => {
                                const finalImageUrl = getImageUrl(item.buktiFoto);

                                return (
                                    <tr key={index} className="hover:bg-[#ffefc5]"> {/* Hover: Warna Pasir */}
                                        <td className="px-4 py-4 border-r border-gray-400 font-bold">{index + 1}.</td>
                                        <td className="px-4 py-4 font-extrabold border-r border-gray-400">{item.User?.nama || 'User'}</td>
                                        
                                        {/* TAMPILKAN FOTO */}
                                        <td className="px-4 py-2 border-r border-gray-400 text-center">
                                            {finalImageUrl ? (
                                                <a href={finalImageUrl} target="_blank" rel="noreferrer">
                                                    <img 
                                                        src={finalImageUrl} 
                                                        alt="Bukti" 
                                                        // Gaya Foto: Seperti Item yang Jatuh
                                                        className="w-16 h-12 object-cover rounded-full border-4 border-[#ffc300] hover:scale-[1.7] transition-transform mx-auto shadow-md"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50?text=Error"; }} 
                                                    />
                                                </a>
                                            ) : <span className="text-gray-600 italic">No Power Up</span>}
                                        </td>

                                        <td className="px-4 py-4 border-r border-gray-400 text-[#008000] font-mono font-bold">{formatDate(item.checkIn)}</td>
                                        <td className="px-4 py-4 border-r border-gray-400">{renderLocation(item.latitude_in, item.longitude_in)}</td>
                                        <td className="px-4 py-4 border-r border-gray-400 text-[#ff4500] font-mono font-bold">{item.checkOut ? formatDate(item.checkOut) : 'AKTIF'}</td>
                                        <td className="px-4 py-4 italic font-bold">
                                            {item.checkOut 
                                                ? <span className="text-[#008000]">SELESAI ✅</span> 
                                                : <span className="text-[#ff4500]">BERJALAN... 🏃</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Jika tidak ada data */}
                            {laporan.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-lg font-bold text-gray-700">
                                        No Data: Silahkan Kembali!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LaporanPage;