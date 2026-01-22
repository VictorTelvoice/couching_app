import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Notificaciones</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 px-6 py-2 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Hoy</h3>
                    <div className="relative bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                        <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined">schedule</span>
                        </div>
                        <div className="flex flex-col gap-1 pr-6">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Próxima Sesión</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">Tu sesión de coaching 1:1 comienza en 15 minutos.</p>
                        </div>
                        <div className="absolute top-4 right-4 size-2 rounded-full bg-red-500"></div>
                    </div>
                     <div className="relative bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                        <div className="size-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <div className="flex flex-col gap-1 pr-6">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Curso Completado</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">¡Felicidades! Has completado "Fundamentos de Gestión".</p>
                        </div>
                    </div>
                </div>
                
                 <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ayer</h3>
                    <div className="relative bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 opacity-75">
                        <div className="size-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                            <span className="material-symbols-outlined">forum</span>
                        </div>
                        <div className="flex flex-col gap-1 pr-6">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Nueva Respuesta</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">Elena comentó en tu publicación del foro.</p>
                        </div>
                    </div>
                </div>
            </main>
            <MainNavigation />
        </div>
    );
};

export default NotificationsPage;