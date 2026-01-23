
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative size-12 flex items-center justify-center">
            <svg className="transform -rotate-90 size-12">
                <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                <circle 
                    cx="24" cy="24" r={radius} 
                    stroke="currentColor" strokeWidth="3" fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    className="text-primary transition-all duration-1000 ease-out" 
                />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-900 dark:text-white tabular-nums">{percentage}%</span>
        </div>
    );
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, getUnreadCount } = useUserStore();
    const unreadNotifications = getUnreadCount?.() || 0;
    const firstName = (profile?.name || "Usuario").split(' ')[0];

    const sectionTitleStyle = "text-sm font-extrabold leading-tight text-slate-900 dark:text-white px-1";

    // Simulación de racha y datos de progreso
    const streak = 7;
    const dailyGoalProgress = 50;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-[#F8FAFC] dark:bg-background-dark font-display">
            {/* Header Estilo Premium */}
            <div className="flex items-center px-6 pt-12 pb-6 justify-between bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="relative cursor-pointer group" onClick={() => navigate('/profile')}>
                        <div className="size-12 rounded-full bg-cover bg-center ring-4 ring-white dark:ring-slate-800 shadow-md transition-transform group-active:scale-90" style={{backgroundImage: `url("${profile?.avatar}")`}}></div>
                        <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Hola, {firstName}</p>
                        <h2 className="text-sm font-extrabold leading-tight text-slate-900 dark:text-white">¡A aprender! 🚀</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">META DIARIA</span>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white">15/30 min</span>
                    </div>
                    <CircularProgress percentage={dailyGoalProgress} />
                    <button onClick={() => navigate('/notifications')} className="relative size-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        {unreadNotifications > 0 && (
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-9 w-full pt-6">
                
                {/* 1. ACCIONES RÁPIDAS */}
                <div className="px-6 animate-fadeIn">
                    <h3 className={`${sectionTitleStyle} mb-5`}>Acciones Rápidas</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Retomar', icon: 'play_arrow', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', path: '/course-detail' },
                            { label: 'Comunidad', icon: 'groups', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20', path: '/community' },
                            { label: 'Mentores', icon: 'person_search', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', path: '/coaching-directory' },
                            { label: 'AI Coach', icon: 'smart_toy', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', path: '/coaching-chat' }
                        ].map((item, i) => (
                            <div key={i} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 cursor-pointer group">
                                <div className={`size-16 rounded-full ${item.color} flex items-center justify-center shadow-sm border border-white dark:border-slate-800 group-active:scale-90 transition-all`}>
                                    <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. BIENVENIDA */}
                <div className="px-6 animate-fadeIn">
                    <h3 className={`${sectionTitleStyle} mb-4`}>Bienvenida</h3>
                    <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none cursor-pointer group" onClick={() => navigate('/course-detail')}>
                        <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt="Welcome"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="size-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                                <span className="material-symbols-filled text-[42px]">play_arrow</span>
                            </div>
                        </div>
                        <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black flex items-center gap-1.5 border border-white/10">
                            <span className="material-symbols-outlined text-[14px]">videocam</span> 2:15
                        </div>
                        <div className="absolute bottom-7 left-7 right-7 text-white">
                            <h4 className="text-xl font-black leading-tight tracking-tight">Tu viaje comienza aquí</h4>
                            <p className="text-sm opacity-80 mt-1 font-medium">Una introducción personal a GrowthLab.</p>
                        </div>
                    </div>
                </div>

                {/* 3. TU APRENDIZAJE */}
                <div className="px-6 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={sectionTitleStyle}>Tu Aprendizaje</h3>
                        <Link to="/my-list" className="text-xs font-bold text-primary">Ver todo</Link>
                    </div>
                    <div onClick={() => navigate('/course-detail')} className="bg-white dark:bg-surface-dark p-4 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden cursor-pointer group active:scale-[0.98] transition-all">
                        <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-filled text-[32px]">play_arrow</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-primary uppercase mb-1 tracking-widest">REANUDAR MENTORÍA</p>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Tácticas Avanzadas de Negocia...</h4>
                            <p className="text-[11px] text-slate-400 font-medium">Módulo 3 • 5 min restantes</p>
                        </div>
                        <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1.5 bg-slate-50 dark:bg-slate-800 w-full">
                            <div className="h-full bg-primary rounded-r-full" style={{width: '60%'}}></div>
                        </div>
                    </div>
                </div>

                {/* 4. DOSIS DIARIA - REDISEÑO AMIGABLE Y COMPACTO */}
                <div className="px-6 animate-fadeIn">
                    <div 
                        onClick={() => navigate('/daily-dose')}
                        className="relative overflow-hidden bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-[1.5rem] p-4 text-white shadow-xl flex items-center gap-4 border border-white/10 group cursor-pointer active:scale-[0.98] transition-all"
                    >
                        {/* Brillo sutil de fondo */}
                        <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        
                        {/* Icono Ampolleta a la Izquierda */}
                        <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 shrink-0">
                            <span className="material-symbols-filled text-[32px] text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.4)]">lightbulb</span>
                        </div>

                        {/* Texto Centralizado Verticalmente */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-80">Dosis Diaria: Bienestar</span>
                                <div className="h-2 w-[1px] bg-white/20"></div>
                                <span className="text-[8px] font-black opacity-60">1 MIN</span>
                            </div>
                            
                            <h3 className="text-base font-extrabold mb-1 leading-tight tracking-tight">Micro-Descansos Visuales</h3>
                            
                            <p className="text-[11px] text-white/80 leading-snug line-clamp-2 font-medium mb-2">
                                Tus ojos sufren con las pantallas. La regla 20-20-20 es el hábito más simple para cuidar tu salud...
                            </p>

                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white group-hover:gap-2 transition-all">
                                <span>LEER TIP</span>
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. EXPLORAR POR CATEGORÍA */}
                <div className="px-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className={sectionTitleStyle}>Explorar por Categoría</h3>
                        <Link to="/explore" className="text-xs font-bold text-primary">Ver todo</Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 -mx-2 px-2">
                        {['Liderazgo', 'Ventas', 'Tech', 'Marketing', 'Diseño'].map((cat, i) => (
                            <button key={i} className={`px-5 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all uppercase tracking-wide ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-500'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-5 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2 snap-x">
                        {[
                            { title: 'Gestión de Equipos Remotos', author: 'Sarah Jenkins', rating: 4.8, img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80', label: 'MANAGEMENT' },
                            { title: 'Inteligencia Emocional', author: 'Dr. Mario Ruiz', rating: 4.9, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', label: 'SOFT SKILLS' }
                        ].map((course, i) => (
                            <div key={i} onClick={() => navigate('/course-detail')} className="snap-center shrink-0 w-[260px] bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <div className="h-36 w-full bg-cover bg-center relative" style={{backgroundImage: `url("${course.img}")`}}>
                                    <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded-lg text-[8px] font-black text-white tracking-widest uppercase">{course.label}</div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="material-symbols-filled text-yellow-400 text-[14px]">star</span>
                                        <span className="text-xs font-black text-slate-700">{course.rating}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">{course.title}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{course.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. TU PROGRESO (ULTRA REDUCIDO -40% ADICIONAL) */}
                <div className="px-6 pb-16">
                    <h3 className={`${sectionTitleStyle} mb-5`}>Tu Progreso</h3>
                    <div className="grid grid-cols-2 gap-4 max-w-[280px] mx-auto">
                        <div className="bg-[#111318] rounded-2xl p-2 text-white relative overflow-hidden aspect-square flex flex-col justify-between shadow-lg">
                            <div className="flex flex-col">
                                <p className="text-[6px] font-black opacity-40 uppercase tracking-widest mb-0">RACHA</p>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-xl font-black text-orange-500 leading-none">{streak}</span>
                                    <span className="text-[7px] font-bold opacity-60 uppercase">días</span>
                                </div>
                            </div>
                            <div className="bg-white/10 px-1.5 py-0.5 rounded-md w-fit flex items-center gap-1 text-[6px] font-black border border-white/5 backdrop-blur-sm">
                                <span className="material-symbols-filled text-orange-500 text-[10px]">local_fire_department</span> FIRE
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[36px] opacity-5 text-white">local_fire_department</span>
                        </div>

                        <div onClick={() => navigate('/badges')} className="bg-white dark:bg-surface-dark rounded-2xl p-2 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between aspect-square cursor-pointer active:scale-95 transition-all">
                            <div className="flex justify-between items-start">
                                <p className="text-[6px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">BADGES</p>
                                <div className="size-4 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <div className="size-6 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center shadow-sm border border-white">
                                    <span className="material-symbols-filled text-[14px]">military_tech</span>
                                </div>
                                <div className="size-6 rounded-lg bg-blue-50 text-primary flex items-center justify-center shadow-sm border border-white">
                                    <span className="material-symbols-filled text-[14px]">verified</span>
                                </div>
                                <div className="size-6 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 text-[8px] font-black">
                                    +5
                                </div>
                            </div>
                            <p className="text-[6px] font-black text-slate-400 uppercase tracking-tight">7/12</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <MainNavigation />
        </div>
    );
};

export default HomePage;
