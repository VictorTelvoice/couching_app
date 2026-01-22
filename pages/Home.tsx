import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

interface ProfileBadgeProps {
    icon: string;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor?: string;
}

const ProfileBadge: React.FC<ProfileBadgeProps> = ({ icon, label, bgColor, textColor, borderColor }) => (
    <div className="flex flex-col items-center gap-1">
        <div className={`size-10 rounded-full flex items-center justify-center ${bgColor} ${textColor} ${borderColor ? `border ${borderColor}` : ''}`}>
            <span className="material-symbols-filled text-[20px]">{icon}</span>
        </div>
        <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">{label}</span>
    </div>
);

const CircularProgress = ({ percentage }: { percentage: number }) => {
    const [progress, setProgress] = useState(0);
    const [count, setCount] = useState(0);
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(percentage);
        }, 100);

        let startTimestamp: number | null = null;
        const duration = 1500;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progressTime = timestamp - startTimestamp;
            const progressRatio = Math.min(progressTime / duration, 1);
            const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
            const currentCount = Math.floor(easeOutCubic(progressRatio) * percentage);
            setCount(currentCount);

            if (progressTime < duration) {
                window.requestAnimationFrame(step);
            }
        };

        const rafId = window.requestAnimationFrame(step);

        return () => {
            clearTimeout(timer);
            window.cancelAnimationFrame(rafId);
        };
    }, [percentage]);

    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative size-12 flex items-center justify-center">
            <svg className="transform -rotate-90 size-12">
                <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200 dark:text-gray-700 opacity-50" />
                <circle 
                    cx="24" cy="24" r={radius} 
                    stroke="currentColor" strokeWidth="3" fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    className="text-primary transition-all duration-[1500ms] ease-out" 
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-primary dark:text-blue-400 tabular-nums">{count}%</span>
        </div>
    );
};

// --- DATA: Daily Tips Database ---
const DAILY_TIPS = [
    {
        id: 1,
        title: "La Técnica Pomodoro",
        category: "Productividad",
        readTime: "2 min",
        preview: "La técnica Pomodoro sugiere pausas de 5 minutos cada 25 minutos de trabajo intenso para mantener la mente fresca.",
        fullContent: {
            intro: "La fatiga mental es el enemigo número uno de la productividad. Francesco Cirillo desarrolló esta técnica a fines de los 80 para mejorar su enfoque.",
            steps: [
                "Elige una tarea a completar.",
                "Pon un temporizador de 25 minutos (un 'Pomodoro').",
                "Trabaja en la tarea hasta que suene el temporizador.",
                "Haz una pausa breve de 5 minutos (estírate, bebe agua).",
                "Cada 4 Pomodoros, toma una pausa más larga de 15-30 minutos."
            ],
            cta: "Pruébalo hoy en tu próxima sesión de deep work."
        }
    },
    {
        id: 2,
        title: "Escucha Activa en Reuniones",
        category: "Comunicación",
        readTime: "3 min",
        preview: "Escuchar no es solo oír. Descubre cómo la escucha activa puede reducir conflictos y mejorar la claridad en tu equipo.",
        fullContent: {
            intro: "La mayoría de las personas no escuchan con la intención de entender; escuchan con la intención de responder. La escucha activa requiere presencia total.",
            steps: [
                "Mantén contacto visual (o mira a la cámara en remoto).",
                "No interrumpas. Deja que la otra persona termine su idea.",
                "Parafrasea lo que escuchaste: 'Entonces, lo que dices es...'",
                "Haz preguntas abiertas para profundizar.",
                "Observa el lenguaje no verbal."
            ],
            cta: "En tu próxima reunión, intenta parafrasear al menos una vez."
        }
    },
    {
        id: 3,
        title: "La Matriz de Eisenhower",
        category: "Gestión del Tiempo",
        readTime: "2 min",
        preview: "¿Urgente o Importante? Aprende a priorizar tus tareas diarias para enfocarte en lo que realmente mueve la aguja.",
        fullContent: {
            intro: "Dwight D. Eisenhower decía: 'Tengo dos tipos de problemas, los urgentes y los importantes. Los urgentes no son importantes, y los importantes nunca son urgentes'.",
            steps: [
                "Cuadrante 1 (Hacer): Importante y Urgente. Hazlo ya.",
                "Cuadrante 2 (Planificar): Importante pero No Urgente. Ponle fecha.",
                "Cuadrante 3 (Delegar): No Importante pero Urgente. Dáselo a otro.",
                "Cuadrante 4 (Eliminar): Ni Importante ni Urgente. Bórralo de tu lista."
            ],
            cta: "Clasifica tus 3 tareas principales de hoy en estos cuadrantes."
        }
    },
    {
        id: 4,
        title: "Micro-Descansos Visuales",
        category: "Bienestar",
        readTime: "1 min",
        preview: "Tus ojos sufren con las pantallas. La regla 20-20-20 es el hábito más simple para cuidar tu salud visual.",
        fullContent: {
            intro: "El síndrome visual informático afecta al 90% de las personas que pasan más de 3 horas al día frente a una pantalla. La regla 20-20-20 ayuda a relajar los músculos oculares.",
            steps: [
                "Cada 20 minutos de trabajo en pantalla...",
                "Mira algo que esté a 20 pies de distancia (6 metros)...",
                "Durante al menos 20 segundos.",
                "Tip extra: Parpadea frecuentemente para lubricar los ojos."
            ],
            cta: "Configura una alarma silenciosa cada 20 minutos hoy."
        }
    },
    {
        id: 5,
        title: "Feedback: El Modelo SBI",
        category: "Liderazgo",
        readTime: "4 min",
        preview: "Dar feedback constructivo es difícil. Usa el modelo Situación-Comportamiento-Impacto para ser claro y objetivo.",
        fullContent: {
            intro: "El feedback vago genera defensividad. El modelo SBI (Situation-Behavior-Impact) desarrollado por el Center for Creative Leadership elimina la subjetividad.",
            steps: [
                "Situación: Describe el cuándo y el dónde. Se específico.",
                "Comportamiento: Describe la acción observable (no lo que crees que pensaban).",
                "Impacto: Describe cómo esa acción afectó a ti o al equipo.",
                "Ejemplo: 'En la reunión de ayer (S), interrumpiste a Juan tres veces (B), lo que hizo que él dejara de compartir sus ideas (I)'."
            ],
            cta: "Prepara tu próximo feedback usando este guion."
        }
    }
];

// --- DATA: Categories and Courses (Mirrors Category Page Data) ---
const HOME_CATEGORIES = [
    { id: 'liderazgo', name: 'Liderazgo', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'ventas', name: 'Ventas', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' },
    { id: 'tech', name: 'Tech', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' },
    { id: 'marketing', name: 'Marketing', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' },
    { id: 'diseno', name: 'Diseño', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300' },
];

const HOME_CATEGORY_COURSES: Record<string, any[]> = {
    'liderazgo': [
        { id: 1, title: 'Gestión de Equipos Remotos', author: 'Sarah Jenkins', rating: 4.8, students: 340, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Management' },
        { id: 2, title: 'Inteligencia Emocional', author: 'Dr. Mario Ruiz', rating: 4.9, students: 890, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Soft Skills' },
        { id: 3, title: 'Toma de Decisiones', author: 'Elena Box', rating: 4.7, students: 210, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Estrategia' }
    ],
    'ventas': [
        { id: 1, title: 'Negociación Avanzada', author: 'Carlos Slim', rating: 5.0, students: 1200, image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Cierre' },
        { id: 2, title: 'Prospección B2B', author: 'Ana López', rating: 4.6, students: 430, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Outbound' },
        { id: 3, title: 'Psicología de Ventas', author: 'Roberto Cialdini', rating: 4.9, students: 2100, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Psicología' }
    ],
    'tech': [
        { id: 1, title: 'React Avanzado', author: 'Dan Abramov', rating: 4.9, students: 5000, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Frontend' },
        { id: 2, title: 'Python para Data Science', author: 'Guido V.', rating: 4.8, students: 3200, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Data' },
        { id: 3, title: 'AWS Cloud Practitioner', author: 'Jeff B.', rating: 4.7, students: 1500, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Cloud' }
    ],
    'marketing': [
        { id: 1, title: 'SEO Mastery 2024', author: 'Neil P.', rating: 4.7, students: 1100, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'SEO' },
        { id: 2, title: 'Estrategia en Redes Sociales', author: 'Gary V.', rating: 4.5, students: 900, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Social' },
        { id: 3, title: 'Email Marketing Efectivo', author: 'Seth G.', rating: 4.8, students: 600, image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Email' }
    ],
    'diseno': [
        { id: 1, title: 'UI/UX Fundamentals', author: 'Don Norman', rating: 4.9, students: 2300, image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'UX' },
        { id: 2, title: 'Diseño Gráfico con IA', author: 'Paula Scher', rating: 4.6, students: 1200, image: 'https://images.unsplash.com/photo-1626785774573-4b7993143d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Graphic' },
        { id: 3, title: 'Figma Masterclass', author: 'Dylan Field', rating: 4.9, students: 3000, image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Tools' }
    ]
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useUserStore();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [showTipModal, setShowTipModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState('liderazgo');

    // Logic to select a daily tip based on the current date
    const dailyTip = useMemo(() => {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 0);
        const diff = today.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        // Use modulus to rotate through tips array
        return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
    }, []);

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-28 bg-background-light dark:bg-background-dark">
            
            {/* Header with Daily Goal */}
            <div className="flex items-center px-6 pt-8 pb-4 justify-between bg-surface-light dark:bg-background-dark sticky top-0 z-30 shadow-sm border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="size-11 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" style={{backgroundImage: `url("${profile.avatar}")`}}></div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-background-dark rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Hola, {profile.name.split(' ')[0]}</p>
                        <h2 className="text-sm font-bold leading-tight flex items-center gap-1">
                            ¡A aprender! <span className="text-lg">🚀</span>
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Meta Diaria</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white">15/30 min</span>
                    </div>
                    <CircularProgress percentage={50} />
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full pt-6">
                
                {/* 1. Quick Actions Grid */}
                <div className="px-6 animate-fadeIn">
                    <h3 className="text-sm font-bold text-[#111318] dark:text-white mb-3 px-1">Acciones Rápidas</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {/* Resume Course */}
                        <div onClick={() => navigate('/course-detail')} className="flex flex-col items-center gap-2 cursor-pointer group">
                             <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-indigo-100 dark:border-indigo-800">
                                <span className="material-symbols-outlined text-[26px]">play_circle</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Retomar</span>
                        </div>

                        {/* Community (Replaces Saved) */}
                        <div onClick={() => navigate('/community')} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="size-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-orange-100 dark:border-orange-800">
                                <span className="material-symbols-outlined text-[26px]">groups</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Comunidad</span>
                        </div>

                        {/* Mentors */}
                        <div onClick={() => navigate('/coaching-directory')} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="size-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-purple-100 dark:border-purple-800">
                                <span className="material-symbols-outlined text-[26px]">supervisor_account</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Mentores</span>
                        </div>

                        {/* AI Coach */}
                        <div onClick={() => navigate('/coaching-chat')} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-blue-100 dark:border-blue-800">
                                <span className="material-symbols-outlined text-[26px]">smart_toy</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">AI Coach</span>
                        </div>
                    </div>
                </div>

                {/* Welcome Video Section */}
                <div className="px-6 flex flex-col gap-2 animate-fadeIn">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold text-[#111318] dark:text-white">Bienvenida</h3>
                    </div>
                    
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 bg-black group cursor-pointer" onClick={() => !isVideoPlaying && setIsVideoPlaying(true)}>
                        {!isVideoPlaying ? (
                            <>
                                {/* Welcome Man background */}
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'}}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                                
                                {/* Overlay Content */}
                                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-1">
                                    <h4 className="text-white font-bold text-base leading-tight">Tu viaje comienza aquí</h4>
                                    <p className="text-gray-300 text-xs line-clamp-1">Una introducción personal a tu plataforma de crecimiento.</p>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-filled text-[32px] ml-1">play_arrow</span>
                                    </div>
                                </div>
                                
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">videocam</span>
                                    2:15
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center relative">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(false); }}
                                    className="absolute top-3 right-3 z-10 size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                                <video 
                                    src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4" 
                                    className="w-full h-full object-cover" 
                                    controls 
                                    autoPlay
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Continue Learning (Redesigned Button) - MOVED HERE */}
                <div className="px-6 w-full animate-fadeIn">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h3 className="text-sm font-bold text-[#111318] dark:text-white">Tu Aprendizaje</h3>
                        <Link to="/my-list" className="text-xs font-bold text-primary">Ver todo</Link>
                    </div>

                    <button
                        onClick={() => navigate('/course-detail')}
                        className="w-full bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 group relative overflow-hidden text-left hover:border-primary/30 transition-all"
                    >
                        {/* Progress Background (Subtle) */}
                        <div className="absolute bottom-0 left-0 h-1 bg-primary/10 w-full">
                            <div className="h-full bg-primary w-[65%]"></div>
                        </div>

                        {/* Icon/Thumbnail */}
                        <div className="size-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                            <span className="material-symbols-filled text-[24px]">play_circle</span>
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-0.5">Reanudar Mentoría</p>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">Tácticas Avanzadas de Negociación</h4>
                            <p className="text-[10px] text-gray-500">Módulo 3 • 5 min restantes</p>
                        </div>

                        {/* Arrow Action */}
                        <div className="size-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </div>
                    </button>
                </div>

                {/* 3. Daily Insight / Tip Card (Dynamic) */}
                <div className="px-6">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-1/2 -ml-12 -mb-8 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 flex gap-4 items-start">
                            <div className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                <span className="material-symbols-filled text-yellow-300 text-[20px]">lightbulb</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold">Dosis Diaria: {dailyTip.category}</h3>
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">{dailyTip.readTime}</span>
                                </div>
                                <h4 className="text-sm font-extrabold text-white mb-1">{dailyTip.title}</h4>
                                <p className="text-xs text-indigo-100 leading-relaxed mb-3 line-clamp-2">
                                    {dailyTip.preview}
                                </p>
                                <button 
                                    onClick={() => setShowTipModal(true)}
                                    className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-1"
                                >
                                    Leer tip completo
                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Explora por Categoría (New Section) */}
                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center justify-between px-7">
                        <h3 className="text-sm font-bold text-[#111318] dark:text-white">Explorar por Categoría</h3>
                        <Link to="/explore" className="text-xs font-bold text-primary">Ver todo</Link>
                    </div>

                    <div className="px-7">
                        {/* Tabs */}
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
                            {HOME_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                                        activeCategory === cat.id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Course Cards */}
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4">
                            {HOME_CATEGORY_COURSES[activeCategory]?.map((course: any) => (
                                <div key={course.id} onClick={() => navigate('/course-detail')} className="group flex flex-col w-[200px] shrink-0 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow snap-start">
                                    <div className="h-28 w-full bg-cover bg-center relative" style={{backgroundImage: `url("${course.image}")`}}>
                                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-wider">
                                            {course.tag}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="material-symbols-filled text-yellow-400 text-[12px]">star</span>
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{course.rating}</span>
                                        </div>
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1">{course.title}</h4>
                                        <p className="text-[10px] text-gray-500 line-clamp-1">{course.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress/Gamification Section */}
                <div className="px-6 mt-2 pb-4">
                    <h3 className="text-sm font-bold text-[#111318] dark:text-white mb-3">Tu Progreso</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/ranking" className="bg-gradient-to-br from-slate-800 to-black dark:from-slate-700 dark:to-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg group hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="absolute right-0 bottom-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-[64px]">local_fire_department</span>
                            </div>
                            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-wider mb-1">Racha Actual</p>
                            <div className="flex items-end gap-1 mb-2">
                                <span className="text-3xl font-extrabold text-orange-400">7</span>
                                <span className="text-xs font-bold text-white mb-1">días</span>
                            </div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/10 px-2 py-1 rounded-lg border border-white/5">
                                <span className="material-symbols-filled text-orange-400 text-[12px]">local_fire_department</span>
                                <span>¡En llamas!</span>
                            </div>
                        </Link>

                        <Link to="/badges" className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors group">
                             <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">Insignias</p>
                                <span className="material-symbols-outlined text-gray-300 text-[16px] group-hover:text-primary transition-colors">chevron_right</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex -space-x-2">
                                    <div className="size-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center ring-2 ring-white dark:ring-surface-dark"><span className="material-symbols-filled text-[14px]">military_tech</span></div>
                                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center ring-2 ring-white dark:ring-surface-dark"><span className="material-symbols-filled text-[14px]">verified</span></div>
                                    <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center ring-2 ring-white dark:ring-surface-dark text-[10px] font-bold">+5</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            
            <MainNavigation />

            {/* FULL TIP MODAL */}
            {showTipModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full sm:max-w-md bg-white dark:bg-[#1e293b] rounded-[2rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto">
                        <button 
                            onClick={() => setShowTipModal(false)}
                            className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                    <span className="material-symbols-filled text-[24px]">lightbulb</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">Dosis Diaria • {dailyTip.category}</span>
                                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{dailyTip.title}</h2>
                                </div>
                            </div>

                            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 italic">
                                    "{dailyTip.fullContent.intro}"
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-gray-100 dark:border-gray-800 pb-2">Pasos Clave</h3>
                                <ul className="space-y-3">
                                    {dailyTip.fullContent.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-gray-300">
                                            <span className="flex-shrink-0 size-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center mt-0.5">{idx + 1}</span>
                                            <span className="leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Desafío de hoy</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">{dailyTip.fullContent.cta}</p>
                            </div>

                            <button 
                                onClick={() => setShowTipModal(false)}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all mt-2"
                            >
                                ¡Entendido! Marcar como leído
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;