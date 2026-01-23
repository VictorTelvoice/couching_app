
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const CourseDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { mySessions, updateSessionProgress } = useUserStore();
    
    // Simulemos que estamos viendo el curso 101 (Negociación)
    const COURSE_ID = 101;
    const session = mySessions.find(s => s.id === COURSE_ID);
    
    const modules = [
        { id: 1, title: '1. Introducción a la Negociación', duration: '15 min', type: 'Video' },
        { id: 2, title: '2. Estilos de Comunicación', duration: '25 min', type: 'Interactivo' },
        { id: 3, title: '3. Tácticas de Cierre', duration: '30 min', type: 'Quiz' },
        { id: 4, title: '4. Resolución de Conflictos', duration: '20 min', type: 'Video' },
        { id: 5, title: '5. Casos Prácticos Finales', duration: '45 min', type: 'Evaluación' },
    ];

    const completedCount = session?.completedModules || 0;

    const handleModuleClick = (index: number) => {
        // Solo permitimos completar el siguiente módulo disponible
        if (index <= completedCount) {
            const newCount = index + 1 > completedCount ? index + 1 : completedCount;
            updateSessionProgress(COURSE_ID, newCount, modules.length);
        }
    };

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
                    <span className="text-xs font-bold text-primary ml-auto">{session?.progress || 0}% completado</span>
                </div>
                
                <h1 className="text-3xl font-bold text-[#111318] dark:text-white leading-tight mb-4">Negociación Eficaz y Resolución de Conflictos</h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    Aprende las estrategias clave para negociar acuerdos exitosos y resolver conflictos en el entorno laboral moderno.
                </p>

                <div className="flex items-center gap-6 mb-8 border-y border-gray-100 dark:border-gray-800 py-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Duración</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">2h 15m</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                     <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Módulos</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{modules.length} Lecciones</span>
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
                        {modules.map((mod, index) => {
                            const isCompleted = index < completedCount;
                            const isCurrent = index === completedCount;
                            const isLocked = index > completedCount;

                            return (
                                <div 
                                    key={mod.id} 
                                    onClick={() => handleModuleClick(index)}
                                    className={`
                                        group flex items-center gap-4 rounded-2xl p-3 pr-4 shadow-sm border transition-all cursor-pointer
                                        ${isCompleted ? 'bg-green-50/30 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700'}
                                        ${isCurrent ? 'ring-2 ring-primary/20 border-primary/40' : ''}
                                        ${isLocked ? 'opacity-50 grayscale' : 'hover:border-primary/50'}
                                    `}
                                >
                                    <div className={`
                                        size-10 rounded-full flex items-center justify-center shrink-0 transition-colors
                                        ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}
                                    `}>
                                        <span className={`material-symbols-filled text-[20px] ${isCurrent ? 'animate-pulse' : ''}`}>
                                            {isCompleted ? 'check' : isLocked ? 'lock' : 'play_arrow'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-bold mb-0.5 truncate ${isCompleted ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                            {mod.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">{mod.duration} • {mod.type}</p>
                                    </div>
                                    {isCompleted && (
                                        <span className="material-symbols-filled text-green-500 text-[20px] animate-in zoom-in duration-300">verified</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 pb-8">
                <button 
                    onClick={() => handleModuleClick(completedCount)}
                    disabled={completedCount >= modules.length}
                    className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale"
                >
                    <span className="material-symbols-filled">play_circle</span> 
                    {completedCount === 0 ? 'Empezar Curso' : completedCount === modules.length ? 'Curso Completado' : 'Continuar Siguiente Módulo'}
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;
