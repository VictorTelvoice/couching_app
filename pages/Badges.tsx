import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const BadgesPage: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
    
    // Read from global store
    const { badges, profile } = useUserStore();

    const filteredBadges = badges.filter(b => {
        if (filter === 'earned') return b.earned;
        if (filter === 'locked') return !b.earned;
        return true;
    });

    const progressPercent = Math.min(100, Math.max(0, (profile.xp / profile.nextLevelXp) * 100));

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Mis Logros</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 flex flex-col gap-6">
                
                {/* Level Progress Card */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/25">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-accent-mint/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="size-20 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/20 flex items-center justify-center mb-3 relative">
                            <span className="material-symbols-filled text-white text-[32px]">workspace_premium</span>
                            <div className="absolute -bottom-2 bg-accent-orange text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">Nivel {profile.level}</div>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{profile.levelName}</h2>
                        <p className="text-blue-100 text-sm font-medium mb-4">{profile.xp} / {profile.nextLevelXp} XP para Nivel {profile.level + 1}</p>
                        
                        <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-accent-mint rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{width: `${progressPercent}%`}}></div>
                        </div>
                        <div className="w-full flex justify-between text-[10px] text-blue-100 font-medium">
                            <span>Nivel {profile.level}</span>
                            <span>Nivel {profile.level + 1}</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-surface-dark rounded-xl">
                    {(['all', 'earned', 'locked'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {f === 'all' ? 'Todos' : f === 'earned' ? 'Ganados' : 'Por Desbloquear'}
                        </button>
                    ))}
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {filteredBadges.map((badge) => (
                        <div key={badge.id} className={`flex flex-col p-4 rounded-2xl border ${badge.earned ? 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800' : 'bg-gray-50 dark:bg-[#151c2a] border-dashed border-gray-200 dark:border-gray-700 opacity-80'} shadow-sm relative overflow-hidden group`}>
                            {!badge.earned && (
                                <div className="absolute top-2 right-2 text-gray-300 dark:text-gray-600">
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                </div>
                            )}
                            <div className={`size-12 rounded-full ${badge.earned ? badge.bg : 'bg-gray-200 dark:bg-gray-700'} ${badge.earned ? badge.color : 'text-gray-400'} flex items-center justify-center mb-3 self-start transition-transform group-hover:scale-110`}>
                                <span className={`material-symbols-outlined ${badge.earned ? 'material-symbols-filled' : ''}`}>{badge.icon}</span>
                            </div>
                            <h3 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{badge.name}</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight mb-3">{badge.desc}</p>
                            
                            {badge.earned ? (
                                <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                    <span className="material-symbols-outlined text-[12px]">check</span>
                                    Ganado el {badge.date}
                                </div>
                            ) : (
                                <div className="mt-auto w-full">
                                    <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                                        <span>Progreso</span>
                                        <span>{badge.progress || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary/60 rounded-full" style={{width: `${badge.progress || 0}%`}}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <MainNavigation />
        </div>
    );
};

export default BadgesPage;