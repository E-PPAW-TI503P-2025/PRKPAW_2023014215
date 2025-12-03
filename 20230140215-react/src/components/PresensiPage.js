import React, { useState, useEffect } from 'react';
import React, { useState, useRef, useCallback, } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';


const MOCK_USER_DATA = {
    nama: 'Budi Santoso (Mock)',
    role: 'mahasiswa',
    isLoggedIn: true,
};

const getMockUser = () => MOCK_USER_DATA;

function PresensiPage() {
    const [coords, setCoords] = useState(null);
    const [userName, setUserName] = useState('Pengguna');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [isViewReport, setIsViewReport] = useState(false); 

    useEffect(() => {
        const user = getMockUser();
        if (user.isLoggedIn) {
            setUserName(user.nama);
            setUserRole(user.role);
            getLocation(); 
        } else {
            setUserName('Tamu');
            setUserRole('');
        }
    }, []);

    const getLocation = () => {
        setError(null);
        setMessage('SCANNING AREA...');
        
        if (navigator.geolocation) {
            const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy 
                    });
                    setMessage(`TARGET ACQUIRED! ACCURACY: ±${position.coords.accuracy.toFixed(2)}m`);
                },
                (error) => {
                    setError("SIGNAL LOST: " + error.message);
                    setCoords(null);
                    setMessage(null);
                },
                options 
            );
        } else {
            setError("NO HARDWARE DETECTED.");
            setCoords(null);
            setMessage(null);
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

    const handleCheckIn = (e) => {
        e.preventDefault();
        if (!coords) { showTempMessage("MAP NOT READY", true); return; }
        setTimeout(() => { showTempMessage(`[SAVE] GAME SAVED AT ${new Date().toLocaleTimeString()}!`); }, 800);
    };

    const handleCheckOut = (e) => {
        e.preventDefault();
        setTimeout(() => { showTempMessage(`[END] SESSION ENDED AT ${new Date().toLocaleTimeString()}!`); }, 800);
    };

    const handleViewPresensi = (e) => {
        e.preventDefault();
        setIsViewReport(true); 
    };

    // --- TAMPILAN POPUP LAPORAN (Style: Castle/Boss Room) ---
    if (isViewReport) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 font-serif"
                style={{ backgroundColor: "#000000", fontFamily: '"Press Start 2P", cursive', color: "white" }}>
                <div className="max-w-xl w-full p-6 border-4 border-gray-500 bg-[#202020] shadow-[8px_8px_0_0_#fff]">
                    <h1 className="text-xl text-[#e70012] mb-4 text-center border-b-4 border-gray-500 pb-2">SECRET FILES</h1>
                    <div className="border-2 border-white p-4 bg-black space-y-2 mb-6 text-[10px]">
                        <ul className="space-y-4">
                            <li className="text-green-400">User A: START 07:45 | END -</li>
                            <li className="text-yellow-400">User B: START 08:05 | END 16:30</li>
                            <li className="text-blue-400">User C: START 07:58 | END 17:01</li>
                        </ul>
                    </div>
                    <button onClick={() => setIsViewReport(false)} className="w-full py-3 bg-[#e70012] text-white border-4 border-white hover:bg-red-700 text-xs">
                        CLOSE FILE
                    </button>
                </div>
            </div>
        );
    }

    // --- TAMPILAN UTAMA (Style: Underground 1-2) ---
    return (    
        <div className="min-h-screen flex flex-col items-center p-4"
            style={{
                backgroundColor: "#000000", // Black Background
                backgroundImage: "linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)",
                backgroundSize: "20px 20px",
                fontFamily: '"Press Start 2P", cursive',
                color: "white"
            }}
        >
            <style>{`
                .vintage-map-frame { height: 400px; width: 100%; border: 4px solid #fff; filter: grayscale(100%) contrast(120%); }
            `}</style>
            
            {/* Header */}
            <header className="w-full max-w-xl flex justify-between items-center py-4 px-2 mb-4 border-b-4 border-[#003ad7]">
                <h1 className="text-lg text-[#003ad7] uppercase">UNDERGROUND OPS</h1>
                <button className="py-1 px-2 text-[8px] bg-gray-700 border-2 border-white">LOGOUT</button>
            </header>
            
            {/* Main Card (Blue Bricks) */}
            <div className="p-6 w-full max-w-xl space-y-6 bg-[#003ad7] border-4 border-white shadow-[8px_8px_0_0_#555]">
                {/* Info */}
                <div className="text-center pb-4 border-b-4 border-black/20">
                    <h2 className="text-sm mb-1">AGENT: {userName.toUpperCase()}</h2>
                    <p className="text-[8px] bg-black inline-block px-2 py-1 text-[#fbd000]">{userRole.toUpperCase()}</p>
                </div>

                {/* Status */}
                {message && <div className="bg-[#009c00] border-2 border-white p-2 text-[8px] text-center animate-pulse">{message}</div>}
                {error && <div className="bg-[#e70012] border-2 border-white p-2 text-[8px] text-center">{error}</div>}

                {/* Map */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <h3 className="text-xs text-[#fbd000]">SECTOR MAP</h3>
                        <button onClick={getLocation} className="text-[8px] underline cursor-pointer hover:text-red-300">REFRESH SIGNAL</button>
                    </div>
                    {coords ? (
                        <>
                            <div className="bg-black p-2 border-2 border-white font-mono text-[8px] text-green-500 mb-1">
                                <p>LAT: {coords.lat.toFixed(6)} | LNG: {coords.lng.toFixed(6)}</p>
                            </div>
                            <div className="border-4 border-white">
                                <iframe
                                    className="vintage-map-frame"
                                    loading="lazy"
                                    allowFullScreen
                                    src={`http://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                                    title="Peta Lokasi"
                                ></iframe>
                            </div>
                        </>
                    ) : (
                        <div className="bg-black p-6 text-center border-4 border-white h-[200px] flex items-center justify-center">
                            <p className="text-red-500 text-[8px] blink">NO SIGNAL INPUT...</p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 border-t-4 border-black/20 pt-4">
                    <button onClick={handleCheckIn} disabled={!coords} className={`py-3 text-[10px] border-2 border-white shadow-[4px_4px_0_0_black] active:translate-y-1 active:shadow-none ${coords ? 'bg-[#fbd000] text-black' : 'bg-gray-600 text-gray-400'}`}>
                        START
                    </button>
                    <button onClick={handleCheckOut} disabled={!coords} className={`py-3 text-[10px] border-2 border-white shadow-[4px_4px_0_0_black] active:translate-y-1 active:shadow-none ${coords ? 'bg-[#e70012] text-white' : 'bg-gray-600 text-gray-400'}`}>
                        STOP
                    </button>
                </div>
                
                {userRole === 'admin' && (
                    <button onClick={handleViewPresensi} className="w-full py-2 bg-white text-black text-[10px] border-2 border-black hover:bg-gray-200">
                        OPEN ARCHIVES
                    </button>
                )}
            </div>
            
            <footer className="mt-8 text-gray-500 text-[8px]">PRESS START TO BEGIN</footer>
        </div>
    );
}

export default PresensiPage;