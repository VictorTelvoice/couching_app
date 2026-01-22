import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Badge } from '../store/useUserStore';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    
    // Auth Context
    const { user, loading, signInWithGoogle, logout } = useAuth();

    // Global Store (for static data/badges)
    const { profile: storeProfile, skills, badges } = useUserStore();
    
    // Local UI State
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [showShareToast, setShowShareToast] = useState(false);
    const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // Use Auth data if logged in, otherwise fallback or empty
    const displayProfile = {
        name: user?.displayName || "Usuario Invitado",
        role: user ? "Miembro verificado" : "Visitante",
        email: user?.email || "",
        phone: storeProfile.phone, // Keep store fallback for non-auth fields
        linkedin: storeProfile.linkedin,
        bio: storeProfile.bio,
        avatar: user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        level: storeProfile.level,
        levelName: storeProfile.levelName,
        xp: storeProfile.xp,
        nextLevelXp: storeProfile.nextLevelXp
    };

    // Calculate level progress
    const progressPercent = Math.min(100, Math.max(0, (displayProfile.xp / displayProfile.nextLevelXp) * 100));

    // Determine "Next Badge" (first unearned badge)
    const nextBadge = badges.find(b => !b.earned) || badges[0];
    const nextBadgeProgress = nextBadge?.progress || 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(nextBadgeProgress);
        }, 100);
        return () => clearTimeout(timer);
    }, [nextBadgeProgress]);

    const filteredBadges = badges.filter(b => {
        if (badgeFilter === 'earned') return b.earned;
        if (badgeFilter === 'locked') return !b.earned;
        return true;
    });

    const handleShareSkills = () => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
    };

    // Helper to simulate fetching skill details for the tooltip
    const getSkillMetadata = (skillName: string) => {
        const db: Record<string, { desc: string, courses: string[] }> = {
            "Liderazgo": { desc: "Capacidad de guiar y motivar equipos hacia objetivos comunes.", courses: ["Liderazgo Ágil", "Gestión de Crisis"] },
            "Gestión de Equipos": { desc: "Coordinación eficiente de talento humano y recursos.", courses: ["Dinámicas de Grupo", "Feedback Efectivo"] },
            "Comunicación": { desc: "Transmisión clara, efectiva y empática de ideas.", courses: ["Storytelling", "Oratoria Pública"] },
            "Estrategia": { desc: "Planificación a largo plazo para el éxito organizacional.", courses: ["Pensamiento Estratégico", "OKRs Masterclass"] },
            "Mentoring": { desc: "Desarrollo del potencial profesional de otros.", courses: ["Coaching 101", "Escucha Activa"] },
            "Resolución de Conflictos": { desc: "Manejo constructivo de disputas y negociación.", courses: ["Negociación Avanzada", "Mediación"] }
        };

        return db[skillName] || {
            desc: "Habilidad clave identificada para tu desarrollo profesional.",
            courses: ["Fundamentos de " + skillName, "Taller Práctico"]
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
                
                {/* Auth / Profile Card */}
                {!user ? (
                     <div className="flex flex-col items-center justify-center pt-10 pb-12 px-6 bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm animate-fadeIn">
                        <div className="size-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-[48px] text-gray-400">person_off</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-2xl font-bold mb-2 text-center">Bienvenido</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-center text-sm mb-8 px-4">
                            Inicia sesión para guardar tu progreso, obtener insignias y acceder a tus certificados.
                        </p>
                        <button 
                            onClick={signInWithGoogle}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 bg-white rounded-full p-0.5" alt="G" />
                            Ingresar con Google
                        </button>
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

                {/* Only show details if logged in or allow preview */}
                <div className={`flex flex-col gap-6 ${!user ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Sobre mí</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {displayProfile.bio}
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
                                <div className="size-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                     <span className="material-symbols-outlined text-[16px]">call</span>
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{displayProfile.phone}</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#0077b5]">
                                     <span className="material-symbols-outlined text-[16px]">link</span>
                                </div>
                                <span className="text-xs font-medium text-[#0077b5] hover:underline cursor-pointer">{displayProfile.linkedin}</span>
                            </div>
                        </div>
                    </div>

                     <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Insignias y Logros</h3>
                            <button onClick={() => navigate('/badges')} className="text-primary text-sm font-bold hover:underline">Ver todo</button>
                        </div>

                        <div className="flex gap-2 px-1">
                            {(['all', 'earned', 'locked'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setBadgeFilter(f)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                                        badgeFilter === f 
                                            ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                            : 'bg-white dark:bg-[#1e293b] text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-gray-100 dark:border-gray-700'
                                    }`}
                                >
                                    {f === 'all' ? 'Todos' : f === 'earned' ? 'Ganados' : 'Por ganar'}
                                </button>
                            ))}
                        </div>
                        
                        {/* Next Badge Progress - Hide if filtering for earned */}
                        {badgeFilter !== 'earned' && nextBadge && !nextBadge.earned && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-3 border border-purple-100 dark:border-purple-800/30 flex flex-col gap-2 shadow-sm">
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white dark:bg-white/10 p-1 rounded-full shadow-sm">
                                            <span className="material-symbols-outlined text-purple-500 text-[18px]">{nextBadge.icon}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Próximo logro</span>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white">{nextBadge.name}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">{nextBadgeProgress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.5)] transition-all duration-1000 ease-out" 
                                        style={{width: `${animatedProgress}%`}}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-3">
                            {filteredBadges.slice(0, 6).map((badge, idx) => (
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
                                    {/* Shimmer Effect for Earned Badges */}
                                    {badge.earned && (
                                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent z-0 pointer-events-none skew-x-12"></div>
                                    )}

                                    <div className={`size-14 rounded-full ${badge.bg} ${badge.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10`}>
                                        <span className={`material-symbols-outlined ${badge.filled ? 'material-symbols-filled' : ''}`} style={{fontSize: '28px'}}>{badge.icon}</span>
                                    </div>
                                    <span className={`text-[11px] ${!badge.earned ? 'font-medium text-slate-400' : 'font-bold text-slate-700 dark:text-slate-200'} text-center leading-tight relative z-10`}>{badge.name}</span>
                                    
                                    {badge.earned && (
                                        <div className="absolute top-2 right-2 size-1.5 bg-green-500 rounded-full animate-pulse shadow-sm z-10"></div>
                                    )}
                                </div>
                            ))}
                            {filteredBadges.length === 0 && (
                                <div className="col-span-3 text-center py-4 text-sm text-gray-500 dark:text-gray-400 italic">
                                    No se encontraron insignias.
                                </div>
                            )}
                        </div>
                    </div>
                    
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Habilidades</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 px-1">
                            {skills.map((skill, i) => {
                                 const meta = getSkillMetadata(skill);
                                 return (
                                    <div key={i} className="relative group">
                                         <span className="cursor-help px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-transparent animate-fadeIn block hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                            {skill}
                                         </span>
                                         
                                         {/* Tooltip */}
                                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none transform origin-bottom scale-95 group-hover:scale-100">
                                            <p className="font-bold mb-1.5 text-sm">{skill}</p>
                                            <p className="mb-2 opacity-90 leading-tight">{meta.desc}</p>
                                            <div className="border-t border-white/10 dark:border-gray-200 pt-1.5">
                                                <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 mb-1 font-bold">Cursos Sugeridos:</p>
                                                <ul className="list-disc list-inside space-y-0.5">
                                                    {meta.courses.map((c, idx) => (
                                                        <li key={idx} className="text-[10px] opacity-90 truncate">{c}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* Tooltip Arrow */}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-white rotate-45"></div>
                                         </div>
                                    </div>
                                 );
                            })}
                        </div>
                        
                        <button onClick={handleShareSkills} className="mx-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm font-bold hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>share</span>
                            Compartir Habilidades
                        </button>
                    </div>

                     <div className="flex flex-col gap-4">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold px-2">Estadísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="material-symbols-outlined" style={{fontSize: '80px'}}>school</span></div>
                                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center z-10"><span className="material-symbols-outlined" style={{fontSize: '20px'}}>school</span></div>
                                <div className="z-10">
                                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">24</p>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cursos</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="material-symbols-outlined" style={{fontSize: '80px'}}>bolt</span></div>
                                <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center z-10"><span className="material-symbols-filled" style={{fontSize: '20px'}}>bolt</span></div>
                                <div className="z-10">
                                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{displayProfile.xp}</p>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Puntos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <MainNavigation />

            {/* Badge Detail Modal */}
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
                            <span className={`material-symbols-outlined ${selectedBadge.filled ? 'material-symbols-filled' : ''}`} style={{fontSize: '48px'}}>{selectedBadge.icon}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{selectedBadge.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 px-2">{selectedBadge.desc}</p>
                        
                        {selectedBadge.earned ? (
                            <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl p-3 flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-sm">
                                    <span className="material-symbols-filled text-[18px]">check_circle</span>
                                    <span>¡Insignia Desbloqueada!</span>
                                </div>
                                <span className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">Obtenida el {selectedBadge.date}</span>
                            </div>
                        ) : (
                             <div className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">En Progreso</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedBadge.progress || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-gray-400 rounded-full" style={{width: `${selectedBadge.progress || 0}%`}}></div>
                                </div>
                                <p className="text-[10px] text-gray-400">Sigue aprendiendo para desbloquear este logro.</p>
                            </div>
                        )}
                        
                        <button className="mt-6 text-sm font-bold text-primary hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">share</span>
                            Compartir Logro
                        </button>
                    </div>
                </div>
            )}

            {/* Share Toast */}
            {showShareToast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
                     <span className="material-symbols-filled text-green-400 dark:text-green-600">check_circle</span>
                     <span className="text-sm font-bold">Habilidades compartidas con tu red</span>
                </div>
            )}
         </div>
     );
}

export default ProfilePage;