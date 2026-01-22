import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

const CourseDetailPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col bg-surface-light dark:bg-background-dark min-h-screen pb-24">
            <div className="relative h-[340px] w-full shrink-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3o3mGPf1c15aSUXZH3CAadspVPFP_yTlwBo8qQ7E7Ipq6U6-gpj62nOSuRn-0IKDgwhXx0Zt3CA0xzLFCaar-Hfj6jzLQ6BLhmRpFSgAnjB7nCCBIRTrrsuey5A8xi0WhC9ZlZw6flhqVmVM-ytbLVyIbo2aQwIjW3p_ygyQstnyQwaoIanPS7XNgXB0L23u3ciyXRyHrzOFsxHGutf-SExGrZZvnVVDaMGe5eZ0ELMx3-gbUeviWCCeB7jUuTW5SCf5BHSRiZQg")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full px-6 pt-12 pb-4 flex justify-between items-center z-20">
                    <button onClick={() => navigate(-1)} className="size-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button className="size-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg">
                        <span className="material-symbols-outlined">bookmark_border</span>
                    </button>
                </div>
            </div>
            
            <div className="relative z-10 -mt-12 flex flex-1 flex-col rounded-t-[2.5rem] bg-surface-light dark:bg-background-dark px-6 pt-8 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide">Habilidades Blandas</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <span className="material-symbols-filled text-yellow-400 text-[14px]">star</span> 4.8
                    </span>
                </div>
                
                <h1 className="text-3xl font-bold text-[#111318] dark:text-white leading-tight mb-4">Negociación Eficaz y Resolución de Conflictos</h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    Aprende las estrategias clave para negociar acuerdos exitosos y resolver conflictos en el entorno laboral moderno, manteniendo relaciones positivas a largo plazo.
                </p>

                <div className="flex items-center gap-6 mb-8 border-y border-gray-100 dark:border-gray-800 py-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Duración</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">2h 15m</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                     <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Módulos</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">5 Lecciones</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                     <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Certificado</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Sí</span>
                    </div>
                </div>

                <div className="mb-24">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4">Temario</h3>
                     <div className="flex flex-col gap-3">
                        <div className="group flex items-center gap-4 rounded-2xl bg-white dark:bg-surface-dark p-3 pr-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <span className="material-symbols-filled text-[20px]">play_arrow</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">1. Introducción a la Negociación</h4>
                                <p className="text-xs text-gray-500">15 min • Video</p>
                            </div>
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                        <div className="group flex items-center gap-4 rounded-2xl bg-white dark:bg-surface-dark p-3 pr-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-colors opacity-60">
                            <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">2. Estilos de Comunicación</h4>
                                <p className="text-xs text-gray-500">25 min • Interactivo</p>
                            </div>
                        </div>
                         <div className="group flex items-center gap-4 rounded-2xl bg-white dark:bg-surface-dark p-3 pr-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-colors opacity-60">
                            <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">3. Tácticas de Cierre</h4>
                                <p className="text-xs text-gray-500">30 min • Quiz</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 pb-8">
                <button className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform">
                    <span className="material-symbols-filled">play_circle</span> Continuar Curso
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;