import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3001/api/presensi';

function LaporanPage() {
    const [laporan, setLaporan] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fungsi untuk memformat tanggal (LOGIKA TETAP SAMA)
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const fetchLaporan = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token'); 
            
            if (!token) {
                 navigate('/login');
                 return;
            }
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                setError('Akses ditolak. Game Master Only (Admin).');
                setIsLoading(false);
                return;
            }

            const response = await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                } 
            );
            setLaporan(response.data.presensi); 
            setError(null);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Gagal mengambil data level');
            setLaporan([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchLaporan();
        } else {
            navigate('/login');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div 
            className="min-h-screen flex flex-col items-center py-10 px-4 relative overflow-hidden"
            style={{
                backgroundColor: "#5c94fc", // Mario Sky Blue
                fontFamily: '"Press Start 2P", cursive', // Pixel Font
                color: "#000"
            }}
        >
            {/* Inject Google Font untuk gaya Pixel */}
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}
            </style>

            {/* Dekorasi Awan (CSS Only) */}
            <div className="absolute top-5 left-10 text-white opacity-80 text-6xl select-none">☁</div>
            <div className="absolute top-20 right-20 text-white opacity-80 text-6xl select-none">☁</div>

            {/* Header Box */}
            <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 z-10">
                <div className="bg-[#e70012] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 md:mb-0">
                    <h2 className="text-xl md:text-2xl text-white tracking-widest drop-shadow-md">
                        ★ LAPORAN ★
                    </h2>
                </div>
                
                <Link 
                    to="/dashboard"
                    className="bg-[#fbd000] border-4 border-black px-4 py-3 text-xs md:text-sm hover:bg-[#ffdf4e] transition-transform active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    &lt; KEMBALI KE DASHBOARD
                </Link>
            </header>

            {/* Kontrol & Error */}
            <div className="w-full max-w-6xl mb-6 flex flex-col gap-4 z-10">
                <div className="flex justify-start">
                    <button 
                        onClick={fetchLaporan} 
                        disabled={isLoading}
                        className={`px-6 py-3 border-4 border-black text-white text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none ${
                            isLoading 
                                ? 'bg-gray-500 cursor-wait' 
                                : 'bg-[#009c00] hover:bg-[#00b300]' // Green Pipe Color
                        }`}
                    >
                        {isLoading ? 'LOADING...' : '↻ REFRESH DATA'}
                    </button>
                </div>

                {error && (
                    <div className="bg-black border-4 border-white text-[#e70012] p-4 text-xs text-center animate-pulse">
                        <p>☠ ERROR: {error}</p>
                    </div>
                )}
            </div>

            {/* Container Tabel (High Score Style) */}
            <div 
                className="w-full max-w-6xl relative z-10"
                style={{
                    backgroundColor: "#000000", // Black Arcade Background
                    border: "4px solid #ffffff",
                    boxShadow: "8px 8px 0px 0px rgba(0,0,0,0.5)",
                }}
            >
                <div className="overflow-x-auto p-2">
                    {laporan.length === 0 && !isLoading && !error ? (
                        <p className="text-center text-white py-10 text-xs">NO DATA FOUND IN CASTLE...</p>
                    ) : (
                        <table className="min-w-full text-[10px] md:text-xs font-mono leading-loose">
                            {/* Header Tabel */}
                            <thead>
                                <tr className="text-[#fbd000] border-b-4 border-white">
                                    <th className="px-4 py-4 text-left">NO</th>
                                    <th className="px-4 py-4 text-left">NAMA</th>
                                    <th className="px-4 py-4 text-left"> MASUK</th>
                                    <th className="px-4 py-4 text-left"> KELUAR</th>
                                    <th className="px-4 py-4 text-center">STATUS</th>
                                </tr>
                            </thead>
                            
                            {/* Body Tabel */}
                            <tbody className="text-white">
                                {laporan.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-[#333333] transition-colors border-b border-gray-700">
                                        <td className="px-4 py-4">{index + 1}</td>
                                        <td className="px-4 py-4 text-[#5c94fc]">
                                            {item.User ? item.User.nama.toUpperCase() : 'UNKNOWN'}
                                        </td>
                                        <td className="px-4 py-4 text-[#009c00]">
                                            {formatDate(item.checkIn)}
                                        </td>
                                        <td className="px-4 py-4 text-[#e70012]">
                                            {item.checkOut ? (
                                                formatDate(item.checkOut)
                                            ) : (
                                                <span className="text-gray-500">---</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {item.checkOut ? (
                                                <span className="bg-gray-700 text-white px-2 py-1 border-2 border-gray-500">SELESAI</span>
                                            ) : (
                                                <span className="bg-[#e70012] text-white px-2 py-1 border-2 border-white animate-pulse">BERJALAN</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Ground Decoration (Hiasan Lantai Bata) */}
            <div className="fixed bottom-0 w-full h-16 bg-[#c84c0c] border-t-4 border-black z-0" 
                 style={{ 
                     backgroundImage: "linear-gradient(45deg, #d46b38 25%, transparent 25%, transparent 75%, #d46b38 75%, #d46b38), linear-gradient(45deg, #d46b38 25%, transparent 25%, transparent 75%, #d46b38 75%, #d46b38)",
                     backgroundSize: "20px 20px",
                     backgroundPosition: "0 0, 10px 10px"
                 }}>
            </div>

            
        </div>
    );
}

export default LaporanPage;