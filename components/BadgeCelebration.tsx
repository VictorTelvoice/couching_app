
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

const BadgeCelebration: React.FC = () => {
    const { recentBadgeEarned, clearCelebration } = useUserStore();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (recentBadgeEarned) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(clearCelebration, 500); // Esperar a que termine la animación de salida
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [recentBadgeEarned, clearCelebration]);

    if (!recentBadgeEarned && !visible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white dark:bg-surface-dark w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col items-center text-center transform transition-all duration-500 ${visible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}`}>
                
                {/* Partículas de "Confeti" con CSS */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div 
                            key={i} 
                            className="absolute size-2 rounded-full animate-ping" 
                            style={{
                                backgroundColor: ['#1152d4', '#00d4a3', '#fb923c', '#F59E0B'][i % 4],
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: '2s'
                            }}
                        ></div>
                    ))}
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className={`size-28 rounded-full ${recentBadgeEarned?.bg || 'bg-primary'} ${recentBadgeEarned?.color || 'text-white'} flex items-center justify-center shadow-2xl relative z-10 border-4 border-white dark:border-surface-dark animate-bounce`}>
                        <span className="material-symbols-filled" style={{fontSize: '56px'}}>{recentBadgeEarned?.icon}</span>
                    </div>
                </div>

                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2">¡Nuevo Logro!</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">{recentBadgeEarned?.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[240px]">
                    {recentBadgeEarned?.desc}
                </p>

                <button 
                    onClick={() => setVisible(false)}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    ¡Excelente!
                </button>
            </div>
        </div>
    );
};

export default BadgeCelebration;
