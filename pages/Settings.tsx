
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    
    // Estado para el modo oscuro detectando la clase actual en el HTML
    const [isDarkMode, setIsDarkMode] = useState(() => 
        document.documentElement.classList.contains('dark')
    );

    // Efecto para aplicar el cambio y persistir en localStorage
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                 <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Ajustes</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 px-6 py-4 overflow-y-auto hide-scrollbar">
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">General</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Notificaciones Push</h4>
                                </div>
                            </div>
                            <div className="block w-12 h-7 bg-secondary rounded-full cursor-pointer relative transition-colors">
                                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Modo Oscuro</h4>
                                </div>
                            </div>
                            {/* Interruptor funcional */}
                            <div 
                                onClick={toggleDarkMode}
                                className={`w-12 h-7 rounded-full cursor-pointer relative transition-all duration-300 ${isDarkMode ? 'bg-secondary' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </section>

                 <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Cuenta</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                        <button onClick={() => navigate('/edit-profile')} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Editar Perfil</span>
                            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                        </button>
                        <button className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                            <span className="text-sm font-semibold text-red-500">Cerrar Sesión</span>
                            <span className="material-symbols-outlined text-red-400">logout</span>
                        </button>
                    </div>
                </section>
            </main>
            <MainNavigation />
        </div>
    );
};

export default SettingsPage;
