
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Badge } from '../store/useUserStore';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading, signInWithGoogle, logout } = useAuth();
    const { profile: storeProfile, badges } = useUserStore();
    
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    const displayProfile = {
        name: user?.displayName || storeProfile.name,
        role: user ? storeProfile.role : "Invitado",
        email: user?.email || storeProfile.email,
        phone: storeProfile.phone,
        linkedin: storeProfile.linkedin,
        bio: storeProfile.bio,
        avatar: user?.photoURL || storeProfile.avatar,
        level: storeProfile.level,
        levelName: storeProfile.levelName,
        xp: storeProfile.xp,
        nextLevelXp: storeProfile.nextLevelXp
    };

    const progressPercent = Math.min(100, Math.max(0, (displayProfile.xp / displayProfile.nextLevelXp) * 100));

    const filteredBadges = badges.filter(b => {
        if (badgeFilter === 'earned') return b.earned;
        if (badgeFilter === 'locked') return !b.earned;
        return true;
    });

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
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

            <main className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto hide-scrollbar">
                
                {!user ? (
                    <div className="flex flex-col items-center justify-center pt-10 pb-12 px-6 bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                        <div className="size-32 bg-primary/5 rounded-3xl flex items-center justify-center mb-8 p-4 overflow-hidden">
                            <img 
                                src="https://i.ibb.co/ZzV3GmT/couchfy-logo.png" 
                                alt="Couchfy Logo" 
                                className="w-full h-auto object-contain drop-shadow-sm"
                                onError={(e) => {
                                    (e.target as any).src = "https://www.svgrepo.com/show/532397/heart-handshake.svg";
                                }}
                            />
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold mb-2 text-center tracking-tight">Couchfy</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-center text-sm mb-10 px-6 font-medium leading-relaxed">
                            Potencia tu crecimiento profesional con mentorías de expertos y rutas guiadas.
                        </p>
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 bg-white rounded-full p-0.5" alt="G" />
                            Acceder con Google
                        </button>
                        <p className="mt-8 text-[11px] text-slate-400 text-center uppercase tracking-widest font-bold">Inicia sesión para comenzar</p>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center pt-6 pb-6 px-6 bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm animate-fadeIn">
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
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                )}

                <div className={`flex flex-col gap-6 ${!user ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Sobre mí</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {displayProfile.bio || "No se ha añadido biografía aún."}
                            </p>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
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

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Insignias y Logros</h3>
                            <button onClick={() => navigate('/badges')} className="text-primary text-sm font-bold hover:underline">Ver todo</button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {filteredBadges.slice(0, 6).map((badge) => (
                                <div 
                                    key={badge.id} 
                                    onClick={() => setSelectedBadge(badge)}
                                    className={`
                                        flex flex-col items-center gap-2 p-3 rounded-2xl shadow-sm border border-transparent transition-all cursor-pointer relative group overflow-hidden
                                        ${!badge.earned 
                                            ? 'bg-slate-50 dark:bg-[#1e293b]/50 grayscale-[0.5]' 
                                            : 'bg-white dark:bg-[#1e293b] animate-in zoom-in-50 duration-500 hover:-translate-y-1 hover:shadow-md'
                                        }
                                        ${badge.border}
                                    `}
                                >
                                    {badge.earned && (
                                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent z-0 pointer-events-none skew-x-12"></div>
                                    )}
                                    <div className={`size-14 rounded-full ${badge.earned ? badge.bg : 'bg-gray-100'} ${badge.earned ? badge.color : 'text-gray-400'} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10`}>
                                        <span className={`material-symbols-outlined ${badge.earned ? 'material-symbols-filled' : ''}`} style={{fontSize: '28px'}}>{badge.icon}</span>
                                    </div>
                                    <span className={`text-[11px] ${!badge.earned ? 'font-medium text-slate-400' : 'font-bold text-slate-700 dark:text-slate-200'} text-center leading-tight relative z-10`}>{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <MainNavigation />

            {selectedBadge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
                        <button 
                            onClick={() => setSelectedBadge(null)} 
                            className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <div className={`size-24 rounded-full ${selectedBadge.bg} ${selectedBadge.color} flex items-center justify-center mb-4 shadow-lg`}>
                            <span className={`material-symbols-outlined ${selectedBadge.earned ? 'material-symbols-filled' : ''}`} style={{fontSize: '48px'}}>{selectedBadge.icon}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{selectedBadge.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 px-2">{selectedBadge.desc}</p>
                        <button className="mt-6 text-sm font-bold text-primary hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">share</span>
                            Compartir en Couchfy
                        </button>
                    </div>
                </div>
            )}
         </div>
     );
}

export default ProfilePage;
