
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const CoachingPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useUserStore(); // Get global profile
    const [selectedCoachId, setSelectedCoachId] = useState(1);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0); // Default to today (index 0)
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Generate the next 14 days dynamically for horizontal scroll
    const upcomingDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, []);

    // Format current month based on the selected date
    const currentMonthLabel = useMemo(() => {
        const selectedDate = upcomingDates[selectedDateIndex] || new Date();
        const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
        const parts = formatter.format(selectedDate);
        return parts.charAt(0).toUpperCase() + parts.slice(1);
    }, [upcomingDates, selectedDateIndex]);

    const liveSessions = [
        {
            id: 101,
            title: "Cumbre de Liderazgo Global 2024",
            host: "GrowthLab Official",
            viewers: "1.2k",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0",
            thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Aczdrc_j2A5IOyQPQet5oRUi6wKAbLdBDClo4vu5QjkGw-kl6PPAB3_vz_oLKLGSo3WK2KDSfvOpAqQkap1PFvOcSWPq4thlGJPL3Z_lIXUzSttm04n0B_bpPWEx2ixngZz166MDwPa8e4TJS8h9RnVA1UQzOtPFrht41Rctcp2_aDbwHAYulXbt5-Ct4isjDoVovwWrf2FnRNeytCLMclBUCgcUbs5Z6NS0QGzl4ekZkAbbwHAbYelO-XjgioVGI83eSnRfOsE",
            category: "Evento Principal"
        },
        {
            id: 102,
            title: "Cómo dar Feedback sin herir sentimientos",
            host: "Maria Gonzalez",
            viewers: "450",
            avatar: "https://i.pravatar.cc/150?img=5",
            thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Soft Skills"
        },
        {
            id: 103,
            title: "Q&A: Tendencias Tech Q4",
            host: "David Mendoza",
            viewers: "890",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw",
            thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Tecnología"
        }
    ];

    const coaches = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Senior Leadership Coach",
            company: "Google",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0",
            skills: ["Liderazgo", "Gestión", "Conflictos"],
            rating: 4.9,
            available: true
        },
        {
            id: 2,
            name: "David Mendoza",
            role: "Tech Lead Mentor",
            company: "Amazon",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw",
            skills: ["Python", "Arquitectura", "Cloud"],
            rating: 5.0,
            available: true
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            role: "Product Strategist",
            company: "Spotify",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfL4b0NpEn-87yRPSzPP3ZoYLJkh07-KWn-FcNVw5C5d8GXmbtwkc1AxfHzzF0BPxciiM7nGupmh9VOXeivOaH1cm0mJwbZgK0mYARZuo0TrbnxDds5FEwFqTMkfkv2-GGxx3JKMV6vHXuMnoIINjpNmqqzhT4QTxnDy82pj5gI-4kiy8jWLLFO3QIpCTAIuZ66FPSVu4XUMQEXSJ-ni9S1gDwEV2Co5Zu_Qek7SLYhHCW1poQGv85YfU90MNwQ23OtBzSM79zKAs",
            skills: ["Agile", "Product Market Fit", "UX"],
            rating: 4.8,
            available: false
        }
    ];

    const activeCoach = coaches.find(c => c.id === selectedCoachId) || coaches[0];

    const handleConfirmSession = () => {
        if (!selectedTime) return;
        setIsBooking(true);
        // Simulate a booking process
        setTimeout(() => {
            setIsBooking(false);
            setBookingSuccess(true);
        }, 1500);
    };

    if (bookingSuccess) {
        const selectedDate = upcomingDates[selectedDateIndex];
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark px-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 shadow-xl shadow-green-500/10">
                    <span className="material-symbols-filled text-green-600 dark:text-green-400 text-[48px]">check_circle</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">¡Cita Confirmada!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                    Tu sesión con <span className="font-bold text-slate-900 dark:text-white">{activeCoach.name}</span> ha sido programada para el <span className="font-bold text-primary">{selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span> a las <span className="font-bold text-primary">{selectedTime}</span>.
                </p>
                <div className="w-full flex flex-col gap-3">
                    <button 
                        onClick={() => setBookingSuccess(false)}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
                    >
                        Entendido
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-4 rounded-2xl bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200 font-bold border border-gray-100 dark:border-gray-800 transition-all active:scale-[0.98]"
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
             <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex shrink-0 items-center">
                    <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" style={{backgroundImage: `url("${profile.avatar}")`}}></div>
                        <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></div>
                    </div>
                </div>
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Coaching y Eventos</h2>
                <div className="flex w-10 items-center justify-end">
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 p-4">
                
                {/* Live Sessions - YouTube Style */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-[#111318] dark:text-white text-lg font-bold px-1 flex items-center gap-2">
                        <span className="material-symbols-filled text-red-600 animate-pulse">sensors</span>
                        En Vivo Ahora
                    </h3>
                    
                    <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 hide-scrollbar snap-x">
                        {liveSessions.map((session) => (
                            <div key={session.id} className="snap-center shrink-0 w-[280px] flex flex-col gap-3 group cursor-pointer">
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `url("${session.thumbnail}")`}}></div>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                    
                                    {/* Live Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">visibility</span>
                                        {session.viewers}
                                    </div>
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                        <span className="relative flex h-1.5 w-1.5">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                        </span>
                                        EN VIVO
                                    </div>
                                    
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="size-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                                            <span className="material-symbols-filled text-[24px]">play_arrow</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Info */}
                                <div className="flex gap-3 px-1">
                                    <div className="size-9 rounded-full bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-700" style={{backgroundImage: `url("${session.avatar}")`}}></div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 mb-0.5 group-hover:text-primary transition-colors">{session.title}</h4>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                            <span>{session.host}</span>
                                            <span className="size-0.5 rounded-full bg-slate-400"></span>
                                            <span>{session.category}</span>
                                        </div>
                                        <button className="mt-2 w-fit px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-dark transition-colors">
                                            Unirse
                                        </button>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white h-fit">
                                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coach Selection */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[#111318] dark:text-white text-lg font-bold">Mentores Destacados</h3>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-primary text-xs font-bold px-2 py-1 rounded-lg">2 Créditos</span>
                    </div>
                    
                    <div className="flex w-full overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar snap-x gap-4">
                        {coaches.map((coach) => (
                            <div 
                                key={coach.id}
                                onClick={() => setSelectedCoachId(coach.id)}
                                className={`snap-center shrink-0 w-[240px] flex flex-col p-4 rounded-2xl border transition-all cursor-pointer relative ${selectedCoachId === coach.id ? 'bg-white dark:bg-[#1e293b] border-primary shadow-xl shadow-primary/10 ring-1 ring-primary' : 'bg-white dark:bg-[#1e293b] border-gray-100 dark:border-gray-800 shadow-sm opacity-90'}`}
                            >
                                {selectedCoachId === coach.id && (
                                    <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                                        <span className="material-symbols-filled text-[24px]">check_circle</span>
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="relative">
                                        <div className="size-14 rounded-full bg-cover bg-center" style={{backgroundImage: `url("${coach.image}")`}}></div>
                                        {coach.available && <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></div>}
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-0.5">{coach.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{coach.role}</p>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="material-symbols-filled text-yellow-400 text-[14px]">star</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{coach.rating}</span>
                                    <span className="text-xs text-slate-400 ml-1">• {coach.company}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {coach.skills.slice(0, 2).map(skill => (
                                        <span key={skill} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                                            {skill}
                                        </span>
                                    ))}
                                    {coach.skills.length > 2 && <span className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-400 text-[10px] font-bold">+{coach.skills.length - 2}</span>}
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/mentor-profile/${coach.id}`);
                                    }}
                                    className="w-full mt-auto py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 text-[10px] font-bold transition-colors border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-1"
                                >
                                    Ver Perfil
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            
                {/* Booking Section */}
                 <div className="flex flex-col gap-5 animate-fadeIn">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[#111318] dark:text-white text-lg font-bold">
                            Agenda tu sesión
                        </h2>
                         <button 
                            onClick={() => navigate('/calendar', { state: { mentorId: selectedCoachId } })} 
                            className="text-primary text-sm font-bold hover:underline"
                        >
                            Ver calendario completo
                        </button>
                    </div>
                    
                    {/* Horizontal Date Picker */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1 mb-1">
                             <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{currentMonthLabel}</span>
                        </div>
                        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x -mx-4 px-4">
                            {upcomingDates.map((date, idx) => {
                                const active = idx === selectedDateIndex;
                                const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date).replace('.', '').toUpperCase();
                                const dayNumber = date.getDate();
                                
                                return (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedDateIndex(idx)}
                                        className={`
                                            snap-center flex flex-col items-center justify-center shrink-0 w-[4.5rem] h-20 rounded-2xl border transition-all duration-300
                                            ${active 
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105 z-10' 
                                                : 'bg-white dark:bg-[#1e293b] border-gray-100 dark:border-gray-800 text-gray-400 hover:border-primary/30'
                                            }
                                        `}
                                    >
                                        <span className={`text-[10px] font-bold mb-1 ${active ? 'opacity-80' : ''}`}>{dayName}</span>
                                        <span className={`text-2xl font-extrabold ${active ? '' : 'text-slate-800 dark:text-white'}`}>{dayNumber}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold text-gray-900 dark:text-white px-1">Horarios Disponibles</span>
                        <div className="grid grid-cols-3 gap-3">
                            {["09:00 AM", "10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:00 PM"].map((time, i) => {
                                const isSelected = selectedTime === time;
                                const isDisabled = i === 0 || i === 5; // Mock disabled states
                                
                                return (
                                    <button 
                                        key={time}
                                        disabled={isDisabled}
                                        onClick={() => setSelectedTime(time)}
                                        className={`
                                            py-3 px-2 rounded-xl text-xs font-bold transition-all border
                                            ${isDisabled 
                                                ? 'bg-gray-50 dark:bg-gray-900/50 text-gray-300 dark:text-gray-700 border-transparent cursor-not-allowed decoration-slice' 
                                                : isSelected 
                                                    ? 'bg-white dark:bg-[#1e293b] text-primary border-primary ring-1 ring-primary shadow-md' 
                                                    : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200 border-gray-100 dark:border-gray-700 hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Confirmation Button */}
                    <div className="mt-2">
                        <button 
                            disabled={!selectedTime || isBooking}
                            onClick={handleConfirmSession}
                            className={`
                                w-full py-4 rounded-2xl text-white text-base font-bold shadow-xl flex items-center justify-center gap-2 transition-all duration-300
                                ${selectedTime 
                                    ? 'bg-primary hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98]' 
                                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-80'
                                }
                            `}
                        >
                            {isBooking ? (
                                <div className="flex items-center gap-2">
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Confirmando...</span>
                                </div>
                            ) : (
                                <>
                                    <span>{selectedTime ? 'Confirmar sesión' : 'Selecciona un horario'}</span>
                                    {selectedTime && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                                </>
                            )}
                        </button>
                    </div>
                 </div>
             </div>

            <MainNavigation />
        </div>
    )
}

export default CoachingPage;
