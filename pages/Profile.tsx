
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Badge } from '../store/useUserStore';
import { useAuth } from '../context/AuthContext';

const GrowthLabLogo = ({ className = "size-16" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" className="fill-primary" />
    </svg>
);

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
    const { profile: storeProfile, badges } = useUserStore();
    
    // Auth Form State
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');

    // Calcular nivel dinámicamente basado en insignias
    const earnedBadgesCount = useMemo(() => badges.filter(b => b.earned).length, [badges]);
    const displayLevel = earnedBadgesCount || 1; // Si no hay insignias, sigue siendo Nivel 1 (Pionero)
    
    // Determinar nombre del nivel (Nivel 1 siempre es Pionero)
    const displayLevelName = useMemo(() => {
        if (displayLevel === 1) return "Pionero";
        return storeProfile.levelName || "Miembro";
    }, [displayLevel, storeProfile.levelName]);

    const handleGoogleLogin = async () => {
        setAuthError(null);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (error: any) {
            console.error("Error en login Google:", error);
            setAuthError("No se pudo iniciar sesión con Google.");
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        
        if (!email || !password || (isRegistering && !name)) {
            setAuthError("Por favor completa todos los campos.");
            return;
        }

        setIsAuthLoading(true);
        try {
            if (isRegistering) {
                await registerWithEmail(email, password, name);
            } else {
                await loginWithEmail(email, password);
            }
            navigate('/');
        } catch (error: any) {
            console.error("Error en auth email:", error);
            let message = "Ocurrió un error inesperado.";
            if (error.code === 'auth/email-already-in-use') message = "Este correo ya está registrado.";
            if (error.code === 'auth/weak-password') message = "La contraseña debe tener al menos 6 caracteres.";
            if (error.code === 'auth/invalid-email') message = "El formato del correo es inválido.";
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') message = "Correo o contraseña incorrectos.";
            setAuthError(message);
        } finally {
            setIsAuthLoading(false);
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
        level: displayLevel,
        levelName: displayLevelName,
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
                    <div className="flex flex-col items-center justify-center pt-8 pb-12 px-6 bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
                        <div className="size-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-50 dark:border-gray-700">
                            <GrowthLabLogo className="size-12" />
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-2xl font-extrabold mb-1 text-center tracking-tight">GrowthLab</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-center text-xs mb-8 px-4 font-medium leading-relaxed">
                            {isRegistering ? 'Crea tu cuenta para comenzar tu crecimiento.' : 'Bienvenido de nuevo a tu panel de aprendizaje.'}
                        </p>

                        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4">
                            {isRegistering && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                />
                            </div>

                            {authError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 rounded-xl">
                                    <p className="text-[11px] text-red-600 dark:text-red-400 font-bold text-center">{authError}</p>
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={isAuthLoading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
                            >
                                {isAuthLoading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    isRegistering ? 'Crear Cuenta' : 'Ingresar'
                                )}
                            </button>
                        </form>

                        <div className="w-full flex items-center gap-4 my-6">
                            <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O continúa con</span>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1"></div>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="G" />
                            Ingresar con Google
                        </button>

                        <button 
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setAuthError(null);
                            }}
                            className="mt-8 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                        >
                            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
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
                        
                        <div className="relative w-fit mx-auto mb-6">
                            <div className="bg-primary/5 dark:bg-primary/20 border border-primary/10 dark:border-primary/30 text-primary dark:text-blue-300 px-6 py-2 rounded-full text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                                <span className="material-symbols-filled text-accent-orange" style={{fontSize: '18px'}}>workspace_premium</span>
                                <span>Nivel {displayProfile.level} — {displayProfile.levelName}</span>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#1e293b]">
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
                    <div className="bg-white dark:bg-[#1e293b] w-full max-sm rounded-[2rem] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
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
                            Compartir en GrowthLab
                        </button>
                    </div>
                </div>
            )}
         </div>
     );
}

export default ProfilePage;
