
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Badge } from '../store/useUserStore';
import { useAuth } from '../context/AuthContext';

// Logotipo vectorial integrado
const GrowthLabLogo = ({ className = "size-16" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" className="fill-primary" />
    </svg>
);

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading, signInWithGoogle, logout } = useAuth();
    const { profile: storeProfile, badges } = useUserStore();
    
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    const displayProfile = {
        name: user?.displayName || storeProfile.name || "Usuario",
        role: user ? (storeProfile.role || "Miembro") : "Invitado",
        email: user?.email || storeProfile.email || "",
        avatar: user?.photoURL || storeProfile.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        level: storeProfile.level || 1,
        levelName: storeProfile.levelName || "Pionero",
        xp: storeProfile.xp || 0,
        nextLevelXp: storeProfile.nextLevelXp || 500,
        bio: storeProfile.bio || "",
        linkedin: storeProfile.linkedin || ""
    };

    const progressPercent = Math.min(100, Math.max(0, (displayProfile.xp / displayProfile.nextLevelXp) * 100));

    // Función para obtener colores vivos basados en la definición de la insignia
    const getBadgeLiveColors = (badge: Badge) => {
        if (!badge.earned) return {};
        const colorMap: Record<string, string> = {
            'text-blue-500': '#3b82f6',
            'text-accent-orange': '#f97316',
            'text-emerald-500': '#10b981',
            'text-primary': '#1152d4',
            'text-purple-500': '#a855f7',
            'text-pink-500': '#ec4899'
        };
        const hex = colorMap[badge.color] || '#6366f1';
        return {
            borderBottom: `4px solid ${hex}`,
            boxShadow: `0 10px 15px -3px ${hex}20`
        };
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight">Mi Perfil</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button onClick={() => navigate('/settings')} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>settings</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto hide-scrollbar pt-4">
                {!user ? (
                    <div className="flex flex-col items-center justify-center pt-10 pb-12 px-6 bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                        <div className="size-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-md border border-gray-50 dark:border-gray-700">
                            <GrowthLabLogo className="size-16" />
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold mb-2 text-center tracking-tight">GrowthLab</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-center text-sm mb-10 px-6 font-medium leading-relaxed">
                            Accede a tu panel personalizado y sigue tu progreso de aprendizaje.
                        </p>
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 bg-white rounded-full p-0.5" alt="G" />
                            Acceder con Google
                        </button>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center pt-6 pb-6 px-6 bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm animate-fadeIn border border-gray-100 dark:border-gray-800">
                        <button 
                            onClick={() => navigate('/edit-profile')} 
                            className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all z-10"
                            title="Editar Perfil"
                        >
                            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>edit</span>
                        </button>

                        <div className="relative mb-4 group cursor-pointer">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-28 border-4 border-slate-50 dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform duration-300" style={{backgroundImage: `url("${displayProfile.avatar}")`}}></div>
                            <div className="absolute bottom-1 right-1 size-5 bg-green-500 rounded-full border-4 border-white dark:border-[#1e293b]"></div>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight mb-1 text-center">{displayProfile.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-5 text-center">{displayProfile.role}</p>
                        
                        <div className="relative w-full max-w-[280px] mb-6">
                            <div className="bg-primary/5 dark:bg-primary/20 border border-primary/10 dark:border-primary/30 text-primary dark:text-blue-300 px-4 py-2 rounded-full text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
                                <span className="material-symbols-filled text-accent-orange" style={{fontSize: '18px'}}>workspace_premium</span>
                                Nivel {displayProfile.level} - {displayProfile.levelName}
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#1e293b]">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
                                    style={{width: `${progressPercent}%`}}
                                ></div>
                            </div>
                        </div>

                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors mt-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                )}

                <div className={`flex flex-col gap-6 ${!user ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    {/* Sección Sobre Mí */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider opacity-60">Sobre mí</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {displayProfile.bio || "No se ha añadido biografía aún."}
                            </p>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-700/50"></div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[16px]">mail</span>
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{displayProfile.email}</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#0077b5]">
                                     <span className="material-symbols-outlined text-[16px]">link</span>
                                </div>
                                <span className="text-xs font-medium text-[#0077b5] hover:underline cursor-pointer">{displayProfile.linkedin || "LinkedIn no vinculado"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sección Insignias Mejorada */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Insignias y Logros</h3>
                            <button onClick={() => navigate('/badges')} className="text-primary text-sm font-bold hover:underline">Ver todo</button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {badges.slice(0, 4).map((badge, idx) => (
                                <div 
                                    key={badge.id} 
                                    onClick={() => setSelectedBadge(badge)}
                                    className={`
                                        flex flex-col p-4 rounded-3xl transition-all cursor-pointer relative overflow-hidden h-40 animate-fadeIn
                                        ${!badge.earned 
                                            ? 'bg-slate-50 dark:bg-[#1e293b]/50 border-2 border-dashed border-slate-200 dark:border-slate-700' 
                                            : 'bg-white dark:bg-[#1e293b] border-2 border-transparent shadow-lg hover:-translate-y-1.5 hover:shadow-xl ring-1 ring-slate-100 dark:ring-slate-800'
                                        }
                                    `}
                                    style={{ 
                                        ...getBadgeLiveColors(badge),
                                        animationDelay: `${(idx + 2) * 100}ms`
                                    }}
                                >
                                    {/* Efecto de Brillo (Shimmer) Sutil para insignias ganadas */}
                                    {badge.earned && (
                                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent z-0 pointer-events-none skew-x-12"></div>
                                    )}

                                    <div className="flex justify-between items-start mb-auto relative z-10">
                                        <div className={`
                                            size-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner
                                            ${badge.earned ? `${badge.bg} ${badge.color}` : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}
                                        `}>
                                            <span className={`material-symbols-outlined ${badge.earned ? 'material-symbols-filled' : ''}`} style={{fontSize: '32px'}}>{badge.icon}</span>
                                        </div>
                                        {badge.earned && (
                                            <div className="size-6 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-500">
                                                <span className="material-symbols-filled" style={{fontSize: '14px'}}>check</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-3 relative z-10">
                                        <h4 className={`text-[13px] ${!badge.earned ? 'font-bold text-slate-400 opacity-60' : 'font-extrabold text-slate-800 dark:text-slate-100'} leading-tight line-clamp-1`}>
                                            {badge.name}
                                        </h4>
                                        {badge.earned ? (
                                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Desbloqueado</p>
                                        ) : (
                                             <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 mt-1 uppercase tracking-tighter italic">Por conseguir</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <MainNavigation />

            {/* Modal de Detalle de Insignia */}
            {selectedBadge && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col items-center text-center border border-white/20">
                        <button 
                            onClick={() => setSelectedBadge(null)} 
                            className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>close</span>
                        </button>
                        
                        <div className="relative mb-6">
                            <div className={`absolute inset-0 ${selectedBadge.earned ? selectedBadge.bg : 'bg-slate-200'} rounded-full blur-3xl opacity-50 animate-pulse`}></div>
                            <div className={`size-28 rounded-[2.5rem] ${selectedBadge.bg} ${selectedBadge.color} flex items-center justify-center shadow-2xl relative z-10 border-4 border-white dark:border-slate-800 transition-transform hover:scale-105 duration-300`}>
                                <span className={`material-symbols-outlined ${selectedBadge.earned ? 'material-symbols-filled' : ''}`} style={{fontSize: '56px'}}>{selectedBadge.icon}</span>
                            </div>
                        </div>

                        <span className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${selectedBadge.earned ? 'text-primary' : 'text-slate-400'}`}>
                            {selectedBadge.earned ? 'Logro Coleccionado' : 'Requisito de Logro'}
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">{selectedBadge.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 px-4 leading-relaxed font-medium">{selectedBadge.desc}</p>
                        
                        {selectedBadge.earned ? (
                            <button className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                                Compartir Logro
                            </button>
                        ) : (
                             <button 
                                onClick={() => { setSelectedBadge(null); navigate('/explore'); }}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Ver guía para obtenerla
                            </button>
                        )}
                    </div>
                </div>
            )}
         </div>
     );
}

export default ProfilePage;