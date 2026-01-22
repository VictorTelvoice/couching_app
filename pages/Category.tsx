import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

// Mock Data Configuration
const CATEGORY_DATA: Record<string, any> = {
    'liderazgo': {
        title: 'Liderazgo',
        description: 'Desarrolla las habilidades para guiar equipos de alto rendimiento.',
        accent: 'blue',
        bgGradient: 'from-blue-600 to-indigo-800',
        heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        stats: { courses: 24, mentors: 12, students: '1.2k' },
        courses: [
            { id: 1, title: 'Gestión de Equipos Remotos', author: 'Sarah Jenkins', rating: 4.8, students: 340, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Management' },
            { id: 2, title: 'Inteligencia Emocional', author: 'Dr. Mario Ruiz', rating: 4.9, students: 890, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Soft Skills' },
            { id: 3, title: 'Toma de Decisiones Estratégicas', author: 'Elena Box', rating: 4.7, students: 210, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Estrategia' }
        ]
    },
    'ventas': {
        title: 'Ventas',
        description: 'Domina el arte de la negociación y cierra más tratos.',
        accent: 'green',
        bgGradient: 'from-emerald-600 to-teal-800',
        heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        stats: { courses: 18, mentors: 8, students: '850' },
        courses: [
            { id: 1, title: 'Negociación Avanzada', author: 'Carlos Slim', rating: 5.0, students: 1200, image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Cierre' },
            { id: 2, title: 'Prospección B2B', author: 'Ana López', rating: 4.6, students: 430, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Outbound' },
             { id: 3, title: 'Psicología de Ventas', author: 'Roberto Cialdini', rating: 4.9, students: 2100, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Psicología' }
        ]
    },
    'tech': {
        title: 'Tecnología',
        description: 'Mantente al día con las últimas herramientas y lenguajes.',
        accent: 'purple',
        bgGradient: 'from-purple-600 to-violet-900',
        heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        stats: { courses: 45, mentors: 20, students: '3.5k' },
        courses: [
            { id: 1, title: 'React Avanzado', author: 'Dan Abramov', rating: 4.9, students: 5000, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Frontend' },
            { id: 2, title: 'Python para Data Science', author: 'Guido V.', rating: 4.8, students: 3200, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Data' },
            { id: 3, title: 'AWS Cloud Practitioner', author: 'Jeff B.', rating: 4.7, students: 1500, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Cloud' }
        ]
    },
    'marketing': {
        title: 'Marketing',
        description: 'Estrategias digitales para crecer tu marca.',
        accent: 'orange',
        bgGradient: 'from-orange-500 to-red-600',
        heroImage: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        stats: { courses: 30, mentors: 15, students: '2.1k' },
        courses: [
            { id: 1, title: 'SEO Mastery 2024', author: 'Neil P.', rating: 4.7, students: 1100, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'SEO' },
            { id: 2, title: 'Estrategia en Redes Sociales', author: 'Gary V.', rating: 4.5, students: 900, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Social' },
            { id: 3, title: 'Email Marketing Efectivo', author: 'Seth G.', rating: 4.8, students: 600, image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Email' }
        ]
    },
    'diseno': {
        title: 'Diseño',
        description: 'Crea experiencias visuales impactantes y funcionales.',
        accent: 'pink',
        bgGradient: 'from-pink-500 to-rose-600',
        heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        stats: { courses: 22, mentors: 10, students: '1.8k' },
        courses: [
            { id: 1, title: 'UI/UX Fundamentals', author: 'Don Norman', rating: 4.9, students: 2300, image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'UX' },
            { id: 2, title: 'Diseño Gráfico con IA', author: 'Paula Scher', rating: 4.6, students: 1200, image: 'https://images.unsplash.com/photo-1626785774573-4b7993143d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Graphic' },
            { id: 3, title: 'Figma Masterclass', author: 'Dylan Field', rating: 4.9, students: 3000, image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', tag: 'Tools' }
        ]
    }
};

const CategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('Cursos');
    
    // Fallback if category doesn't exist
    const data = (id && CATEGORY_DATA[id]) ? CATEGORY_DATA[id] : CATEGORY_DATA['liderazgo'];

    const getAccentColor = (opacity: string = '100') => {
        switch(data.accent) {
            case 'blue': return `bg-blue-500/${opacity} text-blue-600`;
            case 'green': return `bg-emerald-500/${opacity} text-emerald-600`;
            case 'purple': return `bg-purple-500/${opacity} text-purple-600`;
            case 'orange': return `bg-orange-500/${opacity} text-orange-600`;
            case 'pink': return `bg-pink-500/${opacity} text-pink-600`;
            default: return `bg-blue-500/${opacity} text-blue-600`;
        }
    };

    const getBadgeColor = (tag: string) => {
         switch(data.accent) {
            case 'blue': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
            case 'green': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300';
            case 'purple': return 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300';
            case 'orange': return 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300';
            case 'pink': return 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300';
            default: return 'bg-gray-100 text-gray-600';
        }
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            {/* Hero Section */}
            <div className={`relative w-full h-64 bg-gradient-to-br ${data.bgGradient} rounded-b-[2.5rem] shadow-lg shrink-0 overflow-hidden`}>
                <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{backgroundImage: `url("${data.heroImage}")`}}></div>
                <div className="absolute inset-0 bg-black/10"></div>
                
                <header className="absolute top-0 w-full flex items-center justify-between px-6 py-5 z-20">
                    <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </header>

                <div className="absolute bottom-0 w-full px-6 pb-8 pt-12 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                         <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white">Categoría</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">{data.title}</h1>
                    <p className="text-white/90 text-sm font-medium line-clamp-2 max-w-[90%]">{data.description}</p>
                    
                    <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-white text-[16px]">school</span>
                            <span className="text-xs font-bold text-white">{data.stats.courses} Cursos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                             <span className="material-symbols-outlined text-white text-[16px]">group</span>
                            <span className="text-xs font-bold text-white">{data.stats.students} Alumnos</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 flex flex-col gap-6 px-4 -mt-4 z-10 overflow-y-auto hide-scrollbar">
                
                {/* Filters */}
                <div className="flex gap-2 p-1.5 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mx-2">
                    {['Cursos', 'Mentores', 'Recursos'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content List */}
                <div className="flex flex-col gap-4 pb-4">
                    {activeTab === 'Cursos' && data.courses.map((course: any) => (
                        <div key={course.id} onClick={() => navigate('/course-detail')} className="bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 group cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                            <div className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0" style={{backgroundImage: `url("${course.image}")`}}></div>
                            <div className="flex flex-col flex-1 py-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getBadgeColor(course.tag)}`}>{course.tag}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-filled text-yellow-400 text-[12px]">star</span>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{course.rating}</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2">{course.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">Por {course.author}</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">person</span> {course.students}
                                    </span>
                                    <button className={`size-7 rounded-full flex items-center justify-center ${activeTab === 'Cursos' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : ''} group-hover:bg-primary group-hover:text-white transition-colors`}>
                                         <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab !== 'Cursos' && (
                         <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                            <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-gray-400 text-[32px]">construction</span>
                            </div>
                            <p className="text-sm font-medium text-gray-500">Próximamente</p>
                            <p className="text-xs text-gray-400">Estamos preparando contenido increíble para esta sección.</p>
                        </div>
                    )}
                </div>
            </main>
            <MainNavigation />
        </div>
    );
};

export default CategoryPage;