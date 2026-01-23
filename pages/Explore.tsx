
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

// --- MOCK DATA: Full Course Catalog ---
const COURSES_CATALOG = [
    {
        id: 101,
        title: "Negociación Eficaz",
        author: "Carlos Slim",
        category: "Negocios",
        rating: 4.9,
        duration: "2h 15m",
        modules: 5,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3o3mGPf1c15aSUXZH3CAadspVPFP_yTlwBo8qQ7E7Ipq6U6-gpj62nOSuRn-0IKDgwhXx0Zt3CA0xzLFCaar-Hfj6jzLQ6BLhmRpFSgAnjB7nCCBIRTrrsuey5A8xi0WhC9ZlZw6flhqVmVM-ytbLVyIbo2aQwIjW3p_ygyQstnyQwaoIanPS7XNgXB0L23u3ciyXRyHrzOFsxHGutf-SExGrZZvnVVDaMGe5eZ0ELMx3-gbUeviWCCeB7jUuTW5SCf5BHSRiZQg",
        tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    },
    {
        id: 102,
        title: "Seguridad de Datos Corporativos",
        author: "IT Security Team",
        category: "Tecnología",
        rating: 4.7,
        duration: "1h 45m",
        modules: 4,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd9p4cXzVJCQpA9eY6IJTzfov9vsmuSbQOcD5LPluMBuBBCJNRy4NZ_l7RmPTwHMVpAiUInjpvLYD5dl30th-tBl8AEEe6yBydT7xEBoA4ijA4o91OuIvhUqof21zGhkMOUgTgubBGvH9gqv-9zmqY3aNRhsSzAgGJlX7FLovjYGXgSY-y2QK_IW0KRZ8bxEx3aivHfxi9TLF6GzmiGWvS22RDiRkNNV-n8fCJhK_bgjZyOnfs78na-2ssOocQhovybRfOJc8LrqU",
        tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    },
    {
        id: 103,
        title: "Liderazgo Ágil y Scrum",
        author: "Sarah Jenkins",
        category: "Liderazgo",
        rating: 4.8,
        duration: "3h 10m",
        modules: 8,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
        id: 104,
        title: "Storytelling para Ventas",
        author: "Ana Silva",
        category: "Ventas",
        rating: 4.6,
        duration: "1h 20m",
        modules: 3,
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    },
    {
        id: 105,
        title: "Diseño UX/UI: Fundamentos",
        author: "Don Norman",
        category: "Diseño",
        rating: 5.0,
        duration: "4h 00m",
        modules: 10,
        image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tagColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
    },
    {
        id: 106,
        title: "Python para Data Science",
        author: "Guido V.",
        category: "Tecnología",
        rating: 4.9,
        duration: "6h 30m",
        modules: 12,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    }
];

// --- MOCK DATA: Learning Paths Catalog ---
const LEARNING_PATHS_CATALOG = [
    {
        id: 201,
        title: "MBA de Bolsillo",
        courses: 12,
        duration: "30h",
        category: "Negocios",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Fundamentos esenciales de administración, finanzas y estrategia corporativa.",
        color: "from-blue-600 to-indigo-900"
    },
    {
        id: 202,
        title: "Experto en Ciencia de Datos",
        courses: 8,
        duration: "45h",
        category: "Tecnología",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Desde Python básico hasta Machine Learning avanzado aplicado a negocios.",
        color: "from-purple-600 to-fuchsia-900"
    },
    {
        id: 203,
        title: "Líder de Innovación",
        courses: 5,
        duration: "15h",
        category: "Liderazgo",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Metodologías ágiles y Design Thinking para transformar equipos.",
        color: "from-orange-500 to-red-900"
    },
    {
        id: 204,
        title: "Full Stack Developer",
        courses: 10,
        duration: "60h",
        category: "Tecnología",
        image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Domina el frontend y backend con tecnologías modernas.",
        color: "from-emerald-600 to-teal-900"
    },
    {
        id: 205,
        title: "Comunicación de Alto Impacto",
        courses: 4,
        duration: "8h",
        category: "Soft Skills",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Oratoria, storytelling y persuasión para líderes.",
        color: "from-pink-500 to-rose-900"
    }
];

const MENTORS_LIST = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Coach Senior • Google",
        category: "Liderazgo",
        tagClass: "text-primary bg-blue-50 dark:bg-blue-900/30",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0",
        online: true
    },
    {
        id: 2,
        name: "David Mendoza",
        role: "Tech Lead • Amazon",
        category: "Técnico",
        tagClass: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw",
        online: false
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        role: "HR Director • Spotify",
        category: "Carrera",
        tagClass: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfL4b0NpEn-87yRPSzPP3ZoYLJkh07-KWn-FcNVw5C5d8GXmbtwkc1AxfHzzF0BPxciiM7nGupmh9VOXeivOaH1cm0mJwbZgK0mYARZuo0TrbnxDds5FEwFqTMkfkv2-GGxx3JKMV6vHXuMnoIINjpNmqqzhT4QTxnDy82pj5gI-4kiy8jWLLFO3QIpCTAIuZ66FPSVu4XUMQEXSJ-ni9S1gDwEV2Co5Zu_Qek7SLYhHCW1poQGv85YfU90MNwQ23OtBzSM79zKAs",
        online: true
    }
];

const TRENDING_ITEMS = [
    { id: 301, title: "Inteligencia Artificial en RRHH", author: "Maria González", views: "1.2k", time: "45m", image: "https://i.pravatar.cc/150?img=20" },
    { id: 302, title: "Liderazgo en Tiempos de Crisis", author: "Carlos Ruiz", views: "950", time: "1h 10m", image: "https://i.pravatar.cc/150?img=21" },
    { id: 303, title: "Estrategias de Venta Remota", author: "Ana Silva", views: "820", time: "30m", image: "https://i.pravatar.cc/150?img=22" }
];

const ExplorePage: React.FC = () => {
     const navigate = useNavigate();
     const location = useLocation();
     const [activeFilter, setActiveFilter] = useState('Todos');
     const [mentorSubFilter, setMentorSubFilter] = useState('Todos');
     const [courseSubFilter, setCourseSubFilter] = useState('Todos');
     const [pathSubFilter, setPathSubFilter] = useState('Todos'); 
     const [searchQuery, setSearchQuery] = useState('');
     const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
     const { savedContent, toggleSave, showToast } = useUserStore();
     
     useEffect(() => {
        if (location.state && (location.state as any).filter) {
            setActiveFilter((location.state as any).filter);
        }
     }, [location]);

     const handleToggleSave = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const wasSaved = savedContent.includes(id);
        toggleSave(id);
        
        showToast(wasSaved ? "Eliminado de guardados" : "Guardado para más tarde", 'success');
     };

     const filters = ['Todos', 'Mentorías', 'Mentores', 'Rutas', 'Guardados'];
     const mentorFilters = ['Todos', 'Liderazgo', 'Técnico', 'Carrera'];
     const courseFilters = ['Todos', 'Tecnología', 'Negocios', 'Liderazgo', 'Diseño', 'Ventas'];
     const pathFilters = ['Todos', 'Negocios', 'Tecnología', 'Liderazgo', 'Soft Skills']; 
     
     const categories = [
        { id: 'liderazgo', name: 'Liderazgo', icon: 'diversity_3', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
        { id: 'ventas', name: 'Ventas', icon: 'trending_up', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' },
        { id: 'tech', name: 'Tech', icon: 'terminal', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' },
        { id: 'marketing', name: 'Marketing', icon: 'campaign', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' },
        { id: 'diseno', name: 'Diseño', icon: 'palette', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300' },
     ];

     const filteredMentors = useMemo(() => MENTORS_LIST.filter(mentor => {
        const matchesSub = mentorSubFilter === 'Todos' || mentor.category === mentorSubFilter;
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             mentor.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSub && matchesSearch;
     }), [mentorSubFilter, searchQuery]);

     const filteredCourses = useMemo(() => COURSES_CATALOG.filter(course => {
        const matchesSub = courseSubFilter === 'Todos' || course.category === courseSubFilter;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             course.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSub && matchesSearch;
     }), [courseSubFilter, searchQuery]);

     const filteredPaths = useMemo(() => LEARNING_PATHS_CATALOG.filter(path => {
        const matchesSub = pathSubFilter === 'Todos' || path.category === pathSubFilter;
        const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             path.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSub && matchesSearch;
     }), [pathSubFilter, searchQuery]);

     const filteredTrending = useMemo(() => TRENDING_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
     ), [searchQuery]);

     const allItems = useMemo(() => [...COURSES_CATALOG, ...TRENDING_ITEMS, ...MENTORS_LIST], []);

     const faqs = [
        {
            id: 1,
            question: "¿Cómo obtengo mis certificados?",
            answer: "Al completar el 100% de un curso y aprobar la evaluación final, el certificado aparecerá automáticamente en tu Perfil bajo la sección de Logros. Puedes descargarlo en PDF o compartirlo en LinkedIn."
        },
        {
            id: 2,
            question: "¿Puedo cancelar una sesión de coaching?",
            answer: "Sí, puedes cancelar o reagendar hasta 24 horas antes de la sesión desde la sección de 'Mis Eventos' en la página de Coaching sin penalización alguna."
        },
        {
            id: 3,
            question: "¿El contenido es accesible offline?",
            answer: "Actualmente solo puedes descargar los recursos adjuntos (PDFs, plantillas). Los videos y cuestionarios requieren conexión a internet activa para registrar tu progreso en tiempo real."
        },
        {
            id: 4,
            question: "¿Cómo contacto a soporte técnico?",
            answer: "Si tienes problemas técnicos, ve a Ajustes > Ayuda y Soporte para enviar un ticket directo a nuestro equipo de ingeniería. Respondemos en menos de 24 horas."
        }
    ];

     const toggleFaq = (id: number) => {
        setExpandedFaqId(expandedFaqId === id ? null : id);
    };

     return (
         <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <div className="px-6 pt-8 pb-2 bg-surface-light dark:bg-background-dark sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explorar</h1>
                     <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full group mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                    <input 
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary placeholder-gray-500 transition-all" 
                        placeholder="¿Qué quieres aprender hoy?" 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 -mx-6 px-6">
                    {filters.map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                                activeFilter === filter 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 flex flex-col gap-8 pt-6 overflow-y-auto hide-scrollbar">
                
                {/* --- FILTER VIEW: MENTORÍAS --- */}
                {activeFilter === 'Mentorías' ? (
                    <div className="px-6 pb-6 min-h-[50vh] animate-fadeIn">
                        
                        {/* 1. Featured Course (Hero) - Only show if not searching */}
                        {!searchQuery && (
                            <div className="mb-6 relative w-full h-64 rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-indigo-500/20 group" onClick={() => navigate('/course-detail')}>
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'}}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-black/40 to-transparent"></div>
                                
                                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                        <span className="material-symbols-filled text-yellow-400 text-[12px]">star</span> Mentoría Destacada
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h2 className="text-2xl font-bold text-white leading-tight mb-2">Máster en Liderazgo Estratégico</h2>
                                    <p className="text-sm text-indigo-100 line-clamp-2 mb-3">Descubre cómo guiar a tu organización a través del cambio y la incertidumbre con estrategias probadas.</p>
                                    <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 4h 30m</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> Elena Box</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Course Sub-filters */}
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 -mx-2 px-2">
                            {courseFilters.map((subFilter) => (
                                <button 
                                    key={subFilter}
                                    onClick={() => setCourseSubFilter(subFilter)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
                                        courseSubFilter === subFilter 
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' 
                                        : 'bg-white dark:bg-surface-dark text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {subFilter}
                                </button>
                            ))}
                        </div>

                        {/* 3. Course List */}
                        <div className="flex flex-col gap-4">
                            {filteredCourses.map((course) => {
                                const isSaved = savedContent.includes(course.id);
                                return (
                                    <div key={course.id} onClick={() => navigate('/course-detail')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 group cursor-pointer hover:border-primary/30 transition-all relative">
                                        <div className="size-24 rounded-[2rem] bg-cover bg-center shrink-0" style={{backgroundImage: `url("${course.image}")`}}></div>
                                        <div className="flex flex-col flex-1 py-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${course.tagColor}`}>{course.category}</span>
                                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded">
                                                    <span className="material-symbols-filled text-yellow-400 text-[10px]">star</span>
                                                    <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500">{course.rating}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                                            <p className="text-xs text-gray-500 mb-2">Por {course.author}</p>
                                            
                                            <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-2">
                                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">library_books</span> {course.modules} Sesiones
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">schedule</span> {course.duration}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Save Button */}
                                        <button 
                                            onClick={(e) => handleToggleSave(course.id, e)}
                                            className="absolute bottom-3 right-3 size-7 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary dark:hover:text-primary flex items-center justify-center transition-colors z-10"
                                        >
                                            <span className={`material-symbols-outlined text-[16px] ${isSaved ? 'material-symbols-filled text-primary' : ''}`}>
                                                {isSaved ? 'bookmark' : 'bookmark_border'}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                            
                            {filteredCourses.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                                    <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">search_off</span>
                                    <p className="text-sm font-medium text-gray-500">No se encontraron mentorías para tu búsqueda.</p>
                                </div>
                            )}
                        </div>
                    </div>

                ) : activeFilter === 'Guardados' ? (
                     <div className="px-6 pb-6 min-h-[50vh] animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-lg font-bold text-[#111318] dark:text-white">Tus Guardados ({savedContent.length})</h3>
                        </div>
                        
                        {savedContent.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 opacity-60">
                                <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">bookmark_border</span>
                                <p className="text-sm font-medium text-gray-500">No tienes elementos guardados aún.</p>
                                <button onClick={() => setActiveFilter('Todos')} className="mt-4 text-primary font-bold text-sm hover:underline">Explorar contenido</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {savedContent.map(id => {
                                    const item = allItems.find(i => i.id === id);
                                    if (!item) return null;
                                    
                                    // Apply search query filter even in bookmarks
                                    const title = (item as any).title || (item as any).name || "";
                                    const author = (item as any).author || (item as any).role || "";
                                    if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase()) && !author.toLowerCase().includes(searchQuery.toLowerCase())) return null;

                                    const isCourse = 'rating' in item && 'duration' in item;
                                    const isMentor = 'role' in item && 'category' in item;
                                    
                                    const typeLabel = isMentor ? 'Mentor' : isCourse ? 'Mentoría' : 'Tendencia';
                                    const typeColor = isMentor 
                                        ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' 
                                        : isCourse 
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                                            : 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300';
                                    
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => isMentor ? navigate(`/mentor-profile/${item.id}`) : isCourse ? navigate('/course-detail') : null} 
                                            className="flex gap-3 items-center bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                        >
                                            <div className="size-20 rounded-lg bg-gray-200 bg-cover bg-center shrink-0" style={{backgroundImage: `url("${item.image}")`}}></div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded w-fit ${typeColor}`}>
                                                        {typeLabel}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{title}</h4>
                                                
                                                {isCourse ? (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1"><span className="material-symbols-filled text-yellow-400 text-[12px]">star</span> {(item as any).rating}</span>
                                                        <span>•</span>
                                                        <span>{(item as any).duration}</span>
                                                    </div>
                                                ) : isMentor ? (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{(item as any).category}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>Por {(item as any).author}</span>
                                                        <span>•</span>
                                                        <span>{(item as any).time}</span>
                                                    </div>
                                                )}
                                                {!isCourse && !isMentor && (
                                                     <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{author}</p>
                                                )}
                                                {isMentor && (
                                                     <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{author}</p>
                                                )}
                                            </div>
                                            <button 
                                                onClick={(e) => handleToggleSave(item.id, e)}
                                                className="size-9 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 flex items-center justify-center transition-colors shrink-0"
                                                title="Quitar de guardados"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : activeFilter === 'Rutas' ? (
                    <div className="px-6 pb-6 min-h-[50vh] animate-fadeIn">
                        
                        {/* 1. Featured Path (Hero) - Only if not searching */}
                        {!searchQuery && (
                            <div className="mb-6 relative w-full h-64 rounded-[2rem] overflow-hidden cursor-pointer shadow-xl shadow-purple-500/20 group" onClick={() => navigate('/course-detail')}>
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'}}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-black/40 to-transparent"></div>
                                
                                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                        <span className="material-symbols-filled text-yellow-400 text-[12px]">star</span> Ruta del Mes
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h2 className="text-2xl font-bold text-white leading-tight mb-2">MBA de Bolsillo para Líderes</h2>
                                    <p className="text-sm text-purple-100 line-clamp-2 mb-3">Domina los fundamentos de administración, estrategia y finanzas sin años de estudio.</p>
                                    <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">school</span> 12 Cursos</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 30 Horas</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. My Paths (In Progress) - Filtered by search */}
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex items-center justify-between">
                                 <h3 className="text-lg font-bold text-[#111318] dark:text-white">En Progreso</h3>
                            </div>
                            {[
                                {
                                    id: 1,
                                    title: "Onboarding para Nuevos Managers",
                                    progress: 35,
                                    completedCourses: 1,
                                    totalCourses: 4,
                                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                    nextCourse: "Delegación Efectiva"
                                }
                            ].filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((path) => (
                                <div key={path.id} onClick={() => navigate('/course-detail')} className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">Ruta Oficial</span>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{path.title}</h4>
                                        </div>
                                        <div className="radial-progress text-primary text-[9px] font-bold" style={{"--value":path.progress, "--size": "2.5rem"} as any}>
                                            {path.progress}%
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mb-3 overflow-hidden">
                                        <div className="bg-primary h-1.5 rounded-full" style={{width: `${path.progress}%`}}></div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">school</span> {path.completedCourses}/{path.totalCourses} Cursos</span>
                                        <span className="text-primary font-bold hover:underline">Continuar</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 3. Explore Paths (Catalog) */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                 <h3 className="text-lg font-bold text-[#111318] dark:text-white">Explorar Rutas</h3>
                            </div>

                            {/* Sub-Filters */}
                            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-2 px-2 pb-1">
                                {pathFilters.map((subFilter) => (
                                    <button 
                                        key={subFilter}
                                        onClick={() => setPathSubFilter(subFilter)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border ${
                                            pathSubFilter === subFilter 
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' 
                                            : 'bg-white dark:bg-surface-dark text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {subFilter}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {filteredPaths.map((path) => (
                                    <div key={path.id} onClick={() => navigate('/course-detail')} className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer group hover:-translate-y-1 transition-transform">
                                        <div className={`h-24 w-full bg-gradient-to-r ${path.color} relative`}>
                                            <div className="absolute inset-0 bg-black/10"></div>
                                            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wide border border-white/10">
                                                {path.category}
                                            </div>
                                            <div className="absolute -bottom-6 left-4 size-12 rounded-xl bg-white dark:bg-surface-dark p-1 shadow-md">
                                                <div className="w-full h-full rounded-lg bg-cover bg-center" style={{backgroundImage: `url("${path.image}")`}}></div>
                                            </div>
                                        </div>
                                        <div className="pt-8 px-4 pb-4">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-1">{path.title}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{path.description}</p>
                                            
                                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                                                <div className="flex gap-3 text-[10px] font-bold text-gray-400">
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">library_books</span> {path.courses} Cursos</span>
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {path.duration}</span>
                                                </div>
                                                <button className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {filteredPaths.length === 0 && (
                                <div className="text-center py-10 opacity-50">No se encontraron rutas con ese nombre.</div>
                            )}
                        </div>
                    </div>
                ) : activeFilter === 'Mentores' ? (
                     <div className="px-6 pb-6 min-h-[50vh] animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-lg font-bold text-[#111318] dark:text-white">Mentores Destacados</h3>
                        </div>
                        
                         {/* Mentor Filters */}
                        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
                            {mentorFilters.map((filter) => (
                                <button 
                                    key={filter}
                                    onClick={() => setMentorSubFilter(filter)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                                        mentorSubFilter === filter 
                                        ? 'bg-primary text-white border-primary' 
                                        : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Mentor List */}
                         <div className="flex flex-col gap-4">
                            {filteredMentors.map((mentor) => (
                                <div key={mentor.id} onClick={() => navigate(`/mentor-profile/${mentor.id}`)} className="group bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all relative">
                                    <div className="relative">
                                        <div className="size-16 rounded-full bg-cover bg-center" style={{backgroundImage: `url("${mentor.image}")`}}></div>
                                        <div className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white dark:border-surface-dark ${mentor.online ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[#111318] dark:text-white font-bold text-base leading-tight">{mentor.name}</h3>
                                        <p className="text-gray-500 text-xs mb-1">{mentor.role}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-wide w-fit px-1.5 py-0.5 rounded ${mentor.tagClass}`}>{mentor.category}</p>
                                    </div>
                                    
                                     <button 
                                        onClick={(e) => handleToggleSave(mentor.id, e)}
                                        className="absolute top-4 right-4 size-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary dark:hover:text-primary flex items-center justify-center transition-colors z-10"
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${savedContent.includes(mentor.id) ? 'material-symbols-filled text-primary' : ''}`}>
                                            {savedContent.includes(mentor.id) ? 'bookmark' : 'bookmark_border'}
                                        </span>
                                    </button>

                                    <button className="shrink-0 flex flex-col items-center justify-center w-[72px] h-[36px] bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-xl">
                                        <span className="text-[10px] font-bold leading-none">Ver Perfil</span>
                                    </button>
                                </div>
                            ))}
                             {filteredMentors.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                                    <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">person_search</span>
                                    <p className="text-sm font-medium text-gray-500">No se encontraron mentores.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Categories Rail - Only if not searching */}
                        {!searchQuery && (
                            <div className="flex flex-col gap-3">
                                <div className="px-6 flex justify-between items-end">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Categorías</h3>
                                </div>
                                <div className="flex gap-4 overflow-x-auto px-6 pb-2 hide-scrollbar">
                                    {categories.map((cat, i) => (
                                        <div key={i} onClick={() => navigate(`/category/${cat.id}`)} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
                                            <div className={`size-16 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                                                <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Events - Only if not searching */}
                        {!searchQuery && (
                            <div>
                                <div className="flex items-center justify-between px-6 mb-4 mt-2">
                                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">Próximos Eventos</h3>
                                    <button className="text-sm font-semibold text-primary">Ver calendario</button>
                                </div>
                                <div className="flex gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar snap-x">
                                    {[
                                        { id: 401, title: "Masterclass: Liderazgo Remoto", date: "25", month: "OCT", time: "10:00 AM", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Webinar", color: "bg-indigo-600" },
                                        { id: 402, title: "Taller: Feedback Constructivo", date: "28", month: "OCT", time: "02:00 PM", image: "https://images.unsplash.com/photo-1515168816144-b856ca00225d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Taller En Vivo", color: "bg-emerald-600" }
                                    ].map((event) => (
                                        <div key={event.id} onClick={() => navigate('/coaching')} className="group relative flex flex-col w-[260px] shrink-0 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden snap-center hover:-translate-y-1 transition-transform">
                                            <div className="h-28 w-full bg-cover bg-center relative" style={{backgroundImage: `url("${event.image}")`}}>
                                                <div className="absolute inset-0 bg-black/40"></div>
                                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg p-1.5 text-center min-w-[48px] shadow-sm">
                                                    <div className="text-[10px] font-bold text-primary uppercase leading-none mb-0.5">{event.month}</div>
                                                    <div className="text-lg font-extrabold text-gray-900 dark:text-white leading-none">{event.date}</div>
                                                </div>
                                                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${event.color}`}>{event.tag}</div>
                                            </div>
                                            <div className="p-3">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-1">{event.title}</h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                        <span className="text-xs font-medium">{event.time}</span>
                                                    </div>
                                                    <button className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                                        Inscribirse
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results / General Content */}
                        <div className="flex flex-col gap-8">
                            
                            {/* Filtered Courses Section */}
                            {(searchQuery || activeFilter === 'Todos') && filteredCourses.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between px-6">
                                        <h3 className="text-lg font-bold text-[#111318] dark:text-white">Mentorías sugeridas</h3>
                                        <button onClick={() => setActiveFilter('Mentorías')} className="text-sm font-semibold text-primary">Ver todos</button>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar snap-x">
                                        {filteredCourses.map((course) => {
                                            const isSaved = savedContent.includes(course.id);
                                            return (
                                                <div key={course.id} onClick={() => navigate('/course-detail')} className="group relative flex flex-col w-[260px] shrink-0 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:-translate-y-1 transition-transform snap-center">
                                                    <div className="h-36 w-full bg-cover bg-center relative rounded-t-2xl" style={{backgroundImage: `url("${course.image}")`}}>
                                                        <button 
                                                            onClick={(e) => handleToggleSave(course.id, e)}
                                                            className="absolute top-2 right-2 size-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                                                        >
                                                            <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'material-symbols-filled text-primary' : ''}`}>
                                                                {isSaved ? 'bookmark' : 'bookmark_border'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className="p-4 flex flex-col gap-2">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <span className="material-symbols-filled text-yellow-400 text-[14px]">star</span>
                                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{course.rating}</span>
                                                            <span className="text-xs text-gray-400">• {course.duration}</span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{course.title}</h4>
                                                        <p className="text-xs text-gray-500 line-clamp-1">Por {course.author}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Filtered Mentors Section */}
                            {(searchQuery || activeFilter === 'Todos') && filteredMentors.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between px-6 mb-4 mt-2">
                                        <h3 className="text-lg font-bold text-[#111318] dark:text-white">Mentores destacados</h3>
                                        <button onClick={() => setActiveFilter('Mentores')} className="text-sm font-semibold text-primary">Ver todos</button>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar snap-x">
                                        {filteredMentors.map((mentor) => {
                                            const isSaved = savedContent.includes(mentor.id);
                                            return (
                                                <div key={mentor.id} onClick={() => navigate(`/mentor-profile/${mentor.id}`)} className="group relative flex flex-col w-[160px] shrink-0 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-colors snap-center">
                                                    <button 
                                                        onClick={(e) => handleToggleSave(mentor.id, e)}
                                                        className="absolute top-2 right-2 size-7 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary dark:hover:text-primary flex items-center justify-center transition-colors z-10"
                                                    >
                                                        <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'material-symbols-filled text-primary' : ''}`}>
                                                            {isSaved ? 'bookmark' : 'bookmark_border'}
                                                        </span>
                                                    </button>
                                                    <div className="p-4 flex flex-col items-center text-center">
                                                        <div className="relative mb-2">
                                                            <div className="size-16 rounded-full bg-cover bg-center" style={{backgroundImage: `url("${mentor.image}")`}}></div>
                                                            <div className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white dark:border-surface-dark ${mentor.online ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-1">{mentor.name}</h4>
                                                        <p className="text-[10px] text-gray-500 mb-2 line-clamp-1 w-full">{mentor.role}</p>
                                                        <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${mentor.tagClass}`}>{mentor.category}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Trending Section */}
                            {(searchQuery || activeFilter === 'Todos') && filteredTrending.length > 0 && (
                                <div className="px-6 pb-8">
                                    <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4">Tendencias esta semana</h3>
                                    <div className="flex flex-col gap-3">
                                        {filteredTrending.map((item, index) => {
                                            const isSaved = savedContent.includes(item.id);
                                            return (
                                                <div key={item.id} className="flex gap-3 items-center bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <div className="size-16 rounded-lg bg-gray-200 bg-cover bg-center shrink-0" style={{backgroundImage: `url("${item.image}")`}}></div>
                                                    <div className="flex flex-col flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                                                            <span className="text-[10px] font-bold text-primary bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">#{index + 1}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-1">Por {item.author} • {item.time}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[12px]">visibility</span> {item.views} vistas
                                                            </span>
                                                            <button 
                                                                onClick={(e) => handleToggleSave(item.id, e)}
                                                                className={`text-gray-400 hover:text-primary transition-colors ${isSaved ? 'text-primary' : ''}`}
                                                            >
                                                                <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'material-symbols-filled' : ''}`}>
                                                                    {isSaved ? 'bookmark' : 'bookmark_border'}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {searchQuery && filteredCourses.length === 0 && filteredMentors.length === 0 && filteredTrending.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                    <span className="material-symbols-outlined text-4xl mb-2">sentiment_dissatisfied</span>
                                    <p>No se encontraron resultados para "{searchQuery}"</p>
                                </div>
                            )}

                             {/* FAQ Section - Only if not searching */}
                            {!searchQuery && activeFilter === 'Todos' && (
                                <div className="px-6 pb-12">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-primary">help</span>
                                        <h3 className="text-lg font-bold text-[#111318] dark:text-white">Preguntas Frecuentes</h3>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {faqs.map((faq) => {
                                            const isOpen = expandedFaqId === faq.id;
                                            return (
                                                <div 
                                                    key={faq.id} 
                                                    onClick={() => toggleFaq(faq.id)}
                                                    className={`bg-white dark:bg-surface-dark rounded-xl border ${isOpen ? 'border-primary/30 ring-1 ring-primary/20' : 'border-gray-100 dark:border-gray-700'} shadow-sm overflow-hidden transition-all duration-300 cursor-pointer`}
                                                >
                                                    <div className="p-4 flex items-center justify-between gap-3">
                                                        <h4 className={`text-sm font-bold ${isOpen ? 'text-primary' : 'text-gray-800 dark:text-white'} transition-colors leading-tight`}>{faq.question}</h4>
                                                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                                    </div>
                                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                        <div className="overflow-hidden">
                                                            <div className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                                {faq.answer}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

            </main>
            <MainNavigation />
         </div>
     );
};

export default ExplorePage;
