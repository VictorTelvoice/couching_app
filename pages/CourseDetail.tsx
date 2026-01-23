
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const COURSE_ID = 101; // ID de Negociación Eficaz
const COURSE_TITLE = "Negociación Eficaz y Resolución de Conflictos";
const COURSE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3o3mGPf1c15aSUXZH3CAadspVPFP_yTlwBo8qQ7E7Ipq6U6-gpj62nOSuRn-0IKDgwhXx0Zt3CA0xzLFCaar-Hfj6jzLQ6BLhmRpFSgAnjB7nCCBIRTrrsuey5A8xi0WhC9ZlZw6flhqVmVM-ytbLVyIbo2aQwIjW3p_ygyQstnyQwaoIanPS7XNgXB0L23u3ciyXRyHrzOFsxHGutf-SExGrZZvnVVDaMGe5eZ0ELMx3-gbUeviWCCeB7jUuTW5SCf5BHSRiZQg";

const CourseDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { mySessions, updateSessionProgress } = useUserStore();
    
    const currentSession = mySessions.find(s => s.id === COURSE_ID);
    const completedLessons = currentSession?.completedLessons || [];

    const handleLessonClick = async (lessonId: number) => {
        // En una app real, aquí abriríamos el video. Para este demo, marcamos como visto.
        await updateSessionProgress(COURSE_ID, lessonId, 5, COURSE_TITLE, COURSE_IMAGE);
    };

    const lessons = [
        { id: 1, title: "1. Introducción a la Negociación", type: "Video", duration: "15 min" },
        { id: 2, title: "2. Estilos de Comunicación", type: "Interactivo", duration: "25 min" },
        { id: 3, title: "3. Tácticas de Cierre", type: "Quiz", duration: "30 min" },
        { id: 4, title: "4. Resolución de Conflictos", type: "Video", duration: "20 min" },
        { id: 5, title: "5. Caso Práctico Final", type: "Interactivo", duration: "45 min" },
    ];

    return (
        <div className="flex-1 flex flex-col bg-surface-light dark:bg-background-dark min-h-screen pb-24">
            <div className="relative h-[340px] w-full shrink-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${COURSE_IMAGE}")`}}></div>
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
                
                <h1 className="text-3xl font-bold text-[#111318] dark:text-white leading-tight mb-4">{COURSE_TITLE}</h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    Aprende las estrategias clave para negociar acuerdos exitosos y resolver conflictos en el entorno laboral moderno, manteniendo relaciones positivas a largo plazo.
                </p>

                <div className="flex items-center gap-6 mb-8 border-y border-gray-100 dark:border-gray-700 py-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Duración</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">2h 15m</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                     <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Módulos</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{lessons.length} Lecciones</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                     <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400 font-medium uppercase">Tu Progreso</span>
                        <span className="text-sm font-bold text-primary">{currentSession?.progress || 0}%</span>
                    </div>
                </div>

                <div className="mb-24">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4">Temario</h3>
                     <div className="flex flex-col gap-3">
                        {lessons.map((lesson) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            return (
                                <div 
                                    key={lesson.id} 
                                    onClick={() => handleLessonClick(lesson.id)}
                                    className={`group flex items-center gap-4 rounded-2xl p-3 pr-4 shadow-sm border transition-all cursor-pointer ${
                                        isCompleted 
                                        ? 'bg-green-50/30 dark:bg-green-900/10 border-green-100 dark:border-green-800' 
                                        : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:border-primary/50'
                                    }`}
                                >
                                    <div className={`size-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                                        isCompleted ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-primary/20'
                                    }`}>
                                        <span className="material-symbols-filled text-[20px]">{isCompleted ? 'check' : 'play_arrow'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold mb-0.5 ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>{lesson.title}</h4>
                                        <p className="text-xs text-gray-500">{lesson.duration} • {lesson.type}</p>
                                    </div>
                                    {isCompleted && <span className="material-symbols-outlined text-green-500">verified</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 pb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform"
                >
                    <span className="material-symbols-filled">play_circle</span> Continuar Aprendizaje
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;
