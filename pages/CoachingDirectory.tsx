
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

const CoachingDirectoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const filters = ['Todos', 'Liderazgo', 'Técnico', 'Carrera'];

    const mentors = useMemo(() => [
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
    ], []);

    const filteredMentors = useMemo(() => mentors.filter((mentor) => {
        const matchesFilter = activeFilter === 'Todos' || mentor.category === activeFilter;
        const query = searchQuery.toLowerCase();
        const matchesSearch = mentor.name.toLowerCase().includes(query) || 
                             mentor.role.toLowerCase().includes(query) || 
                             mentor.category.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    }), [mentors, activeFilter, searchQuery]);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
             <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Directorio de Mentores</h1>
                </div>
            </header>

            <div className="px-6 pt-2 pb-4">
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">search</span>
                    <input 
                        className="w-full bg-white dark:bg-surface-dark border-none shadow-sm rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-shadow" 
                        placeholder="Buscar por nombre, cargo o área..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
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

            <main className="flex-1 flex flex-col gap-4 px-6 overflow-y-auto hide-scrollbar animate-fadeIn">
                {filteredMentors.map((mentor) => (
                    <div key={mentor.id} onClick={() => navigate(`/mentor-profile/${mentor.id}`)} className="group bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all">
                        <div className="relative">
                            <div className="size-16 rounded-full bg-cover bg-center" style={{backgroundImage: `url("${mentor.image}")`}}></div>
                            <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-surface-dark ${mentor.online ? 'bg-emerald-50' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[#111318] dark:text-white font-bold text-base leading-tight">{mentor.name}</h3>
                            <p className="text-gray-500 text-xs mb-1">{mentor.role}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wide w-fit px-1.5 py-0.5 rounded ${mentor.tagClass}`}>{mentor.category}</p>
                        </div>
                        <button className="shrink-0 flex flex-col items-center justify-center w-[72px] h-[36px] bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-xl">
                            <span className="text-[10px] font-bold leading-none">Ver Perfil</span>
                        </button>
                    </div>
                ))}
                
                {filteredMentors.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-60">
                         <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">person_search</span>
                         <p className="text-sm font-medium text-gray-500">No se encontraron mentores que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </main>
            <MainNavigation />
        </div>
    );
};

export default CoachingDirectoryPage;
