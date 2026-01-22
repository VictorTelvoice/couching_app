import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

// Mock Data for Mentors (Simulating DB)
const MENTORS_DB: Record<number, any> = {
    1: {
        id: 1,
        name: "Sarah Jenkins",
        role: "Senior Leadership Coach",
        company: "Google",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0",
        rating: 4.9
    },
    2: {
        id: 2,
        name: "David Mendoza",
        role: "Tech Lead Mentor",
        company: "Amazon",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw",
        rating: 5.0
    },
    3: {
        id: 3,
        name: "Elena Rodriguez",
        role: "Product Strategist",
        company: "Spotify",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfL4b0NpEn-87yRPSzPP3ZoYLJkh07-KWn-FcNVw5C5d8GXmbtwkc1AxfHzzF0BPxciiM7nGupmh9VOXeivOaH1cm0mJwbZgK0mYARZuo0TrbnxDds5FEwFqTMkfkv2-GGxx3JKMV6vHXuMnoIINjpNmqqzhT4QTxnDy82pj5gI-4kiy8jWLLFO3QIpCTAIuZ66FPSVu4XUMQEXSJ-ni9S1gDwEV2Co5Zu_Qek7SLYhHCW1poQGv85YfU90MNwQ23OtBzSM79zKAs",
        rating: 4.8
    }
};

// Mock Available Time Slots grouped by session (Morning/Afternoon)
const TIME_SLOTS = [
    { time: "09:00 AM", period: "morning" },
    { time: "10:00 AM", period: "morning" },
    { time: "11:30 AM", period: "morning" },
    { time: "02:30 PM", period: "afternoon" },
    { time: "04:00 PM", period: "afternoon" },
    { time: "05:00 PM", period: "afternoon" }
];

const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get Mentor ID from navigation state or default to 1
    const mentorId = location.state?.mentorId || 1;
    const mentor = MENTORS_DB[mentorId] || MENTORS_DB[1];
    
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsMonthPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calendar Logic
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 = Sunday

    const monthData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysCount = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate); 
        
        const days = [];
        
        // Empty slots for previous month padding
        for (let i = 0; i < startDay; i++) {
            days.push({ day: null, fullDate: null });
        }
        
        // Actual days
        for (let i = 1; i <= daysCount; i++) {
            days.push({ 
                day: i, 
                fullDate: new Date(year, month, i) 
            });
        }

        return days;
    }, [currentDate]);

    // Generate next 12 months for the dropdown
    const availableMonths = useMemo(() => {
        const months = [];
        const start = new Date(); // Start from today
        for(let i = 0; i < 12; i++) {
            const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
            months.push(d);
        }
        return months;
    }, []);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const jumpToMonth = (date: Date) => {
        setCurrentDate(date);
        setIsMonthPickerOpen(false);
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date | null) => {
        if (!date) return false;
        return date.getDate() === selectedDate.getDate() &&
               date.getMonth() === selectedDate.getMonth() &&
               date.getFullYear() === selectedDate.getFullYear();
    };

    const isPast = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0,0,0,0);
        return date < today;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-32">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Agendar Sesión</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-6 pt-4">
                
                {/* Mentor Profile Card */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="relative shrink-0">
                         <div className="size-16 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-600" style={{backgroundImage: `url("${mentor.image}")`}}></div>
                         <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{mentor.name}</h2>
                        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1.5">{mentor.role}</p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-md">
                                <span className="material-symbols-filled text-yellow-400 text-[12px]">star</span>
                                <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400">{mentor.rating}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">• 1h Duración</span>
                        </div>
                    </div>
                </div>

                {/* Month Navigation & Selector */}
                <div className="flex items-center justify-between mb-4 px-2 relative" ref={pickerRef}>
                    <button onClick={() => changeMonth(-1)} className="size-9 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    
                    {/* Dropdown Trigger */}
                    <button 
                        onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors group"
                    >
                        <span className="text-lg font-bold text-slate-900 dark:text-white capitalize group-hover:text-primary transition-colors">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isMonthPickerOpen ? 'rotate-180' : ''}`}>arrow_drop_down</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isMonthPickerOpen && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-30 overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="max-h-60 overflow-y-auto hide-scrollbar p-2">
                                {availableMonths.map((m, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => jumpToMonth(m)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold capitalize transition-colors flex justify-between items-center ${
                                            m.getMonth() === currentDate.getMonth() && m.getFullYear() === currentDate.getFullYear()
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        {monthNames[m.getMonth()]} {m.getFullYear()}
                                        {m.getMonth() === currentDate.getMonth() && m.getFullYear() === currentDate.getFullYear() && (
                                            <span className="material-symbols-outlined text-[16px]">check</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={() => changeMonth(1)} className="size-9 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                    {/* Weekdays */}
                    <div className="grid grid-cols-7 mb-3">
                        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day, i) => (
                            <div key={i} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* Days */}
                    <div className="grid grid-cols-7 gap-y-1">
                        {monthData.map((item, index) => {
                            if (!item.fullDate) return <div key={index}></div>;
                            
                            const isSelectedDate = isSelected(item.fullDate);
                            const isTodayDate = isToday(item.fullDate);
                            const isPastDate = isPast(item.fullDate);
                            const isWeekend = item.fullDate.getDay() === 0 || item.fullDate.getDay() === 6;
                            const isAvailable = !isPastDate && !isWeekend;

                            return (
                                <div key={index} className="flex flex-col items-center justify-center relative aspect-square">
                                    <button
                                        disabled={!isAvailable}
                                        onClick={() => handleDateClick(item.fullDate!)}
                                        className={`
                                            size-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all relative
                                            ${isSelectedDate 
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10' 
                                                : isTodayDate 
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-primary font-bold' 
                                                    : !isAvailable 
                                                        ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {item.day}
                                    </button>
                                    {isAvailable && !isSelectedDate && !isTodayDate && (
                                        <div className="absolute bottom-1 size-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Available Slots Section */}
                <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-500">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                        </h3>
                         <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Zona Local</span>
                    </div>

                    {isPast(selectedDate) || (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) ? (
                         <div className="flex flex-col items-center justify-center py-8 bg-white dark:bg-surface-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-[32px] text-gray-300 mb-2">event_busy</span>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sin disponibilidad</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {TIME_SLOTS.map((slot) => {
                                const active = selectedTime === slot.time;
                                return (
                                    <button 
                                        key={slot.time}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={`
                                            py-3 px-2 rounded-xl text-sm font-bold transition-all border relative overflow-hidden group
                                            ${active 
                                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/25' 
                                                : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        <span className="relative z-10">{slot.time}</span>
                                        {active && <div className="absolute inset-0 bg-white/10"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

            </main>

            {/* Sticky Confirm Button */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50">
                {selectedTime ? (
                     <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2">
                         <div className="flex justify-between items-center px-2">
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase">Fecha y Hora</span>
                                 <span className="text-sm font-bold text-slate-900 dark:text-white">
                                     {selectedDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} • {selectedTime}
                                 </span>
                             </div>
                             <div className="flex flex-col items-end">
                                 <span className="text-[10px] text-gray-500 font-bold uppercase">Costo</span>
                                 <span className="text-sm font-bold text-slate-900 dark:text-white">2 Créditos</span>
                             </div>
                         </div>
                         <button 
                            className="w-full py-4 rounded-2xl bg-[#111318] dark:bg-white dark:text-[#111318] text-white text-base font-bold shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                            <span>Confirmar Reserva</span>
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                     </div>
                ) : (
                    <button 
                        disabled
                        className="w-full py-4 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-400 font-bold cursor-not-allowed"
                    >
                        Selecciona una hora
                    </button>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;