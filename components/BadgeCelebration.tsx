
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

const BadgeCelebration: React.FC = () => {
    const { recentBadgeEarned, clearCelebration } = useUserStore();
    const [visible, setVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (recentBadgeEarned) {
            setShouldRender(true);
            // Pequeño delay para que el render ocurra antes de la transición
            const timer = setTimeout(() => setVisible(true), 50);
            
            const autoClose = setTimeout(() => {
                handleClose();
            }, 6000); // 6 segundos de gloria
            
            return () => {
                clearTimeout(timer);
                clearTimeout(autoClose);
            };
        }
    }, [recentBadgeEarned]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            setShouldRender(false);
            clearCelebration();
        }, 500); // Tiempo de la animación de salida
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            {/* Sistema de Confeti mejorado */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(24)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`absolute size-3 rounded-sm animate-bounce`} 
                        style={{
                            backgroundColor: ['#1152d4', '#00d4a3', '#fb923c', '#F59E0B', '#ec4899', '#8b5cf6'][i % 6],
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            opacity: visible ? 0.8 : 0,
                            transition: 'opacity 1s ease-in',
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className={`bg-white dark:bg-surface-dark w-full max-w-sm rounded-[3rem] p-10 shadow-[0_0_50px_rgba(17,82,212,0.3)] relative flex flex-col items-center text-center transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${visible ? 'scale-100 translate-y-0 rotate-0' : 'scale-50 translate-y-20 rotate-12'}`}>
                
                <div className="relative mb-8">
                    {/* Brillo exterior animado */}
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-[40px] animate-pulse scale-150"></div>
                    
                    <div className={`size-32 rounded-full ${recentBadgeEarned?.bg || 'bg-primary'} ${recentBadgeEarned?.color || 'text-white'} flex items-center justify-center shadow-2xl relative z-10 border-[6px] border-white dark:border-surface-dark animate-in zoom-in-50 duration-500 delay-300`}>
                        <span className="material-symbols-filled text-[64px] drop-shadow-lg">{recentBadgeEarned?.icon}</span>
                    </div>

                    {/* Partículas pequeñas orbitando */}
                    <div className="absolute top-0 left-0 w-full h-full animate-spin duration-[10s]">
                        <span className="absolute -top-2 left-1/2 size-4 bg-accent-gold rounded-full blur-sm"></span>
                        <span className="absolute -bottom-2 left-1/2 size-3 bg-accent-mint rounded-full blur-sm"></span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mb-8">
                    <span className="text-primary dark:text-blue-400 font-extrabold text-xs uppercase tracking-[0.2em]">¡Insignia Desbloqueada!</span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{recentBadgeEarned?.name}</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent-mint mx-auto my-1 rounded-full"></div>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium px-2">
                        {recentBadgeEarned?.desc}
                    </p>
                </div>

                <button 
                    onClick={handleClose}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 hover:shadow-primary/40"
                >
                    ¡INCREÍBLE!
                </button>
            </div>
        </div>
    );
};

export default BadgeCelebration;
