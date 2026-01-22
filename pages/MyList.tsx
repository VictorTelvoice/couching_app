import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

// Mock data
const MY_COURSES = [
    {
        id: 1,
        title: "Básicos de Seguridad de Datos",
        author: "IT Security Team",
        progress: 10,
        total: "4 Módulos",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd9p4cXzVJCQpA9eY6IJTzfov9vsmuSbQOcD5LPluMBuBBCJNRy4NZ_l7RmPTwHMVpAiUInjpvLYD5dl30th-tBl8AEEe6yBydT7xEBoA4ijA4o91OuIvhUqof21zGhkMOUgTgubBGvH9gqv-9zmqY3aNRhsSzAgGJlX7FLovjYGXgSY-y2QK_IW0KRZ8bxEx3aivHfxi9TLF6GzmiGWvS22RDiRkNNV-n8fCJhK_bgjZyOnfs78na-2ssOocQhovybRfOJc8LrqU",
        status: "En Curso",
        lastAccess: "Hace 2 horas"
    },
    {
        id: 2,
        title: "Inteligencia Emocional 101",
        author: "Sarah Jenkins",
        progress: 60,
        total: "2h 30m",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3o3mGPf1c15aSUXZH3CAadspVPFP_yTlwBo8qQ7E7Ipq6U6-gpj62nOSuRn-0IKDgwhXx0Zt3CA0xzLFCaar-Hfj6jzLQ6BLhmRpFSgAnjB7nCCBIRTrrsuey5A8xi0WhC9ZlZw6flhqVmVM-ytbLVyIbo2aQwIjW3p_ygyQstnyQwaoIanPS7XNgXB0L23u3ciyXRyHrzOFsxHGutf-SExGrZZvnVVDaMGe5eZ0ELMx3-gbUeviWCCeB7jUuTW5SCf5BHSRiZQg",
        status: "En Curso",
        lastAccess: "Ayer"
    },
    {
        id: 3,
        title: "Liderazgo Ágil",
        author: "David Mendoza",
        progress: 0,
        total: "5 Módulos",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        status: "Por Empezar",
        lastAccess: ""
    }
];

const COMPLETED_COURSES = [
    {
        id: 10,
        title: "Onboarding Corporativo",
        author: "HR Team",
        grade: "100%",
        date: "12 Oct 2023",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const MyListPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'En Curso' | 'Por Empezar' | 'Completado'>('En Curso');

    const filteredCourses = activeTab === 'Completado' 
        ? COMPLETED_COURSES 
        : MY_COURSES.filter(c => c.status === activeTab);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Mi Aprendizaje</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button onClick={() => navigate('/explore')} className="flex items-center justify-center size-9 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
            </header>

            <div className="px-6 mb-4">
                <div className="flex p-1 bg-gray-100 dark:bg-surface-dark rounded-xl">
                    {(['En Curso', 'Por Empezar', 'Completado'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 flex flex-col gap-4 px-6 overflow-y-auto hide-scrollbar animate-fadeIn">
                {activeTab !== 'Completado' ? (
                    <>
                        {filteredCourses.map((course: any) => (
                            <div key={course.id} onClick={() => navigate('/course-detail')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer hover:border-primary/30 transition-all group">
                                <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 relative overflow-hidden" style={{backgroundImage: `url("${course.image}")`}}>
                                    {course.progress > 0 && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                                            <div className="h-full bg-secondary" style={{width: `${course.progress}%`}}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 py-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-primary bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">{course.total}</span>
                                        {course.lastAccess && <span className="text-[10px] text-gray-400">{course.lastAccess}</span>}
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2">{course.title}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{course.author}</p>
                                    
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {course.progress > 0 ? `${course.progress}% Completado` : 'Sin empezar'}
                                        </span>
                                        {course.progress > 0 ? (
                                            <button className="size-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-filled text-[16px]">play_arrow</span>
                                            </button>
                                        ) : (
                                            <button className="text-xs font-bold text-primary hover:underline">Comenzar</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {filteredCourses.map((course: any) => (
                             <div key={course.id} onClick={() => navigate('/certificate')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer hover:border-green-500/30 transition-all group">
                                <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0 relative overflow-hidden grayscale" style={{backgroundImage: `url("${course.image}")`}}>
                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                        <span className="material-symbols-filled text-white text-[32px]">check_circle</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 py-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">Completado</span>
                                        <span className="text-[10px] text-gray-400">{course.date}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2">{course.title}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{course.author} • Nota: {course.grade}</p>
                                    
                                    <div className="mt-auto flex items-center gap-2">
                                        <button className="flex-1 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Ver Certificado</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {filteredCourses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-60">
                        <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">school</span>
                        <p className="text-sm font-medium text-gray-500">No hay cursos en esta sección.</p>
                        <button onClick={() => navigate('/explore')} className="mt-4 text-primary font-bold text-sm hover:underline">Explorar Catálogo</button>
                    </div>
                )}
            </main>
            <MainNavigation />
        </div>
    );
};

export default MyListPage;