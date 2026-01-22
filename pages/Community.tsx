import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

interface Comment {
    id: number;
    author: string;
    avatar: string;
    text: string;
    time: string;
}

interface Post {
    id: number;
    author: string;
    role: string;
    avatar: string;
    time: string;
    content: React.ReactNode; // Allow strings or JSX (for highlighted tags)
    tags: { text: string; color: string }[];
    likes: number;
    commentsCount: number;
    isLiked: boolean;
    comments: Comment[];
    showComments: boolean;
}

const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useUserStore();

    // State for the main input
    const [newPostContent, setNewPostContent] = useState('');

    // State for filtering
    const [activeFilter, setActiveFilter] = useState('Todos');

    // State for replying
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const discussionFilters = ['Todos', 'Liderazgo', 'Productividad', 'Comunicación', 'Bienestar', 'Tech'];

    // Mock Data for Trending Section
    const trendingThreads = [
        {
            id: 101,
            topic: "#LiderazgoRemoto",
            title: "¿Cómo mantener la cultura en equipos 100% remotos?",
            posts: "125 posts",
            participants: [
                "https://i.pravatar.cc/150?img=1",
                "https://i.pravatar.cc/150?img=5",
                "https://i.pravatar.cc/150?img=8"
            ]
        },
        {
            id: 102,
            topic: "#InteligenciaArtificial",
            title: "Herramientas de AI que están usando hoy",
            posts: "89 posts",
            participants: [
                "https://i.pravatar.cc/150?img=12",
                "https://i.pravatar.cc/150?img=3"
            ]
        },
        {
            id: 103,
            topic: "#Bienestar",
            title: "Tips para desconectar después del trabajo",
            posts: "56 posts",
            participants: [
                "https://i.pravatar.cc/150?img=9",
                "https://i.pravatar.cc/150?img=20",
                "https://i.pravatar.cc/150?img=32",
                "https://i.pravatar.cc/150?img=11"
            ]
        }
    ];

    // Initial Mock Data wrapped in State
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            author: "Elena Rodriguez",
            role: "Directora de Operaciones",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfL4b0NpEn-87yRPSzPP3ZoYLJkh07-KWn-FcNVw5C5d8GXmbtwkc1AxfHzzF0BPxciiM7nGupmh9VOXeivOaH1cm0mJwbZgK0mYARZuo0TrbnxDds5FEwFqTMkfkv2-GGxx3JKMV6vHXuMnoIINjpNmqqzhT4QTxnDy82pj5gI-4kiy8jWLLFO3QIpCTAIuZ66FPSVu4XUMQEXSJ-ni9S1gDwEV2Co5Zu_Qek7SLYhHCW1poQGv85YfU90MNwQ23OtBzSM79zKAs",
            time: "2h",
            content: (
                <span>
                    Acabo de terminar el módulo de <span className="text-primary font-medium">#ComunicaciónAsertiva</span>. La técnica del "Sandwich de Feedback" me parece muy útil para las revisiones trimestrales que se acercan. ¿Alguien ya la ha puesto en práctica con sus equipos remotos?
                </span>
            ),
            tags: [
                { text: "Comunicación", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300" },
                { text: "Liderazgo", color: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" }
            ],
            likes: 12,
            commentsCount: 1,
            isLiked: false,
            showComments: false,
            comments: [
                {
                    id: 101,
                    author: "Sarah Jenkins",
                    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0",
                    text: "¡Sí! La usé la semana pasada y la recepción fue mucho mejor que antes.",
                    time: "1h"
                }
            ]
        },
        {
            id: 2,
            author: "Carlos Méndez",
            role: "Tech Lead",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBGKz-pGXCZOZ2Mpi2XDoYlZwg5OeamVRVMc6OvH8etIM2tUhA018wuqttV9V1tYNBEDt3cDH5tZN4jXsujn1nXA_fGQNfC_V83PoGa76of8ALK9PWKhA_ACMgYG5yzgBOgiHshhne0amAX8Frm0XPWW3KGVV0s-BKUviX2FsSKEL3xy3YcEGP_TO350X6IUN-c77bDTLswIXCX5gg4orv6Dn3NTO-aEqb5IYQDLpVDRF_yS-QZYYb7clsaJCzBl4QfflYS2gbB1E",
            time: "5h",
            content: (
                <span>
                    Totalmente de acuerdo con el video sobre <span className="text-primary font-medium">#GestiónDelTiempo</span>. Bloquear tiempo en el calendario para "Trabajo Profundo" ha cambiado mi productividad esta semana.
                </span>
            ),
            tags: [
                { text: "Productividad", color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300" }
            ],
            likes: 24,
            commentsCount: 0,
            isLiked: true,
            showComments: false,
            comments: []
        }
    ]);

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        const newPost: Post = {
            id: Date.now(),
            author: profile.name,
            role: profile.role,
            avatar: profile.avatar,
            time: "Justo ahora",
            content: newPostContent,
            tags: [],
            likes: 0,
            commentsCount: 0,
            isLiked: false,
            comments: [],
            showComments: false
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };

    const handleLike = (postId: number) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const toggleComments = (postId: number) => {
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, showComments: !post.showComments } : post
        ));
    };

    const initiateReply = (postId: number) => {
        if (activeReplyId === postId) {
            setActiveReplyId(null);
        } else {
            setActiveReplyId(postId);
            // Ensure comments are visible when replying
            setPosts(posts.map(post => 
                post.id === postId ? { ...post, showComments: true } : post
            ));
        }
    };

    const submitReply = (postId: number) => {
        if (!replyContent.trim()) return;

        const newComment: Comment = {
            id: Date.now(),
            author: profile.name,
            avatar: profile.avatar,
            text: replyContent,
            time: "Ahora"
        };

        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, newComment],
                    commentsCount: post.commentsCount + 1
                };
            }
            return post;
        }));

        setReplyContent('');
        setActiveReplyId(null);
    };

    // Filter Logic
    const filteredPosts = activeFilter === 'Todos'
        ? posts
        : posts.filter(post => post.tags.some(tag => tag.text === activeFilter));

     return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-28 bg-background-light dark:bg-background-dark">
            <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex size-10 shrink-0 items-center">
                     <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20" style={{backgroundImage: `url("${profile.avatar}")`}}></div>
                </div>
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Comunidad de Cohorte</h2>
                <div className="flex w-10 items-center justify-end">
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-5 p-4">
                {/* Cohort Card */}
                <div className="relative overflow-hidden rounded-2xl bg-primary shadow-lg text-white p-5">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-accent-mint/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/20 text-accent-mint">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
                                En curso
                            </span>
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full border-2 border-primary bg-gray-300 bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmKndQwxut1iHq_KfkwI1wo9Wd3M_cVzA0_rdcs2JUSJTRr2WU748t2fBypdiWO5ejfAOsOA1QyVjga6a7fxJqsWA8sz0UWO184vtSSamAA0zMnmQviQl1EUz-q44r8FCedI0Smet6E4ax28gbGFRGxtl8BI--w-8vEN4SPKReuqnNmXuKhHAYziPinqyS8I6EQ6rbajz9IwXQjZWVH7xYdBDHFm6iSOmbMYwhatgnW3TSyDL5iVaepywKOEkqrDNkY6lj99UL0xY")'}}></div>
                                <div className="w-7 h-7 rounded-full border-2 border-primary bg-gray-400 bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAn4WNR9gXNBUzInfHx5qKMyd-rHZeYWeRAe7HveaJ83Q-8NSgPk7R2cdhSRozhd0CwYc7AuI8RsQUsIN-aQKIgn4sKazCl1JYtNjKNqeHRq1_3w01fuQr_tZkdD_gu5w3EVhza_KAB0aImlMLGpedLMHno-kWBFA_LxX1gNAG7uSqZLx9lYJuD8nyPvJ2Vvr9L7AzMg8-2_wWWV_8ZSzaWfbTp3av6SSrbS330hG5Z7Aqh284D7-4M36y811Un9OZhXXPRn80lzg0")'}}></div>
                                <div className="w-7 h-7 rounded-full border-2 border-primary bg-gray-500 bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDirDeGC4Qnp4ds0joHbpCmR8nv7cSz4urQpZi1Lop5YzneZ7PchABitz9ScnNf42smuQCBifhq578etqMVmpjdty46q-NNgGscpdBUFecSsGj1othRh1oHCdmtPbN57ZCziB3nsbIxQma5tz5u-F3-qYWtWqVP2PvMxHPH0jveUmkyAdggnr-3zyoz9CIfGgATbw9EPNSk2oxPTcE7W5qerYvTrjwtk6PdGZPPv36etI1hiTJdl2DMtpiCQjAnjElcnACuW5mSoFQ")'}}></div>
                                <div className="flex w-7 h-7 items-center justify-center rounded-full border-2 border-primary bg-white/20 text-[9px] font-bold">+35</div>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-1 leading-tight">Cohorte: Liderazgo Estratégico Q4</h1>
                        <p className="text-white/80 text-sm font-medium">38 miembros activos • Grupo A</p>
                    </div>
                </div>

                {/* Challenges & Leaderboard */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary dark:text-blue-400">trophy</span>
                            <h3 className="font-bold text-[#111318] dark:text-white">Desafío Grupal</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Completar 50 reflexiones sobre Micro-Cursos</p>
                        <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="absolute left-0 top-0 h-full bg-accent-mint w-[72%] rounded-full"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-bold text-[#111318] dark:text-white">72% Completado</span>
                            <span className="text-[10px] font-medium text-gray-400">Quedan 3 días</span>
                        </div>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-[#111318] dark:text-white uppercase tracking-wide">Top Contribuidores</h3>
                            <Link to="/ranking" className="text-xs text-primary font-bold cursor-pointer hover:underline">Ver ranking</Link>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-cover ring-2 ring-yellow-400" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0")'}}></div>
                                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</div>
                                </div>
                                <span className="text-[10px] font-bold text-[#111318] dark:text-white">Sarah J.</span>
                                <span className="text-[9px] text-accent-mint font-bold">1250 pts</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-cover ring-2 ring-gray-300" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDBGKz-pGXCZOZ2Mpi2XDoYlZwg5OeamVRVMc6OvH8etIM2tUhA018wuqttV9V1tYNBEDt3cDH5tZN4jXsujn1nXA_fGQNfC_V83PoGa76of8ALK9PWKhA_ACMgYG5yzgBOgiHshhne0amAX8Frm0XPWW3KGVV0s-BKUviX2FsSKEL3xy3YcEGP_TO350X6IUN-c77bDTLswIXCX5gg4orv6Dn3NTO-aEqb5IYQDLpVDRF_yS-QZYYb7clsaJCzBl4QfflYS2gbB1E")'}}></div>
                                    <div className="absolute -top-1 -right-1 bg-gray-300 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</div>
                                </div>
                                <span className="text-[10px] font-bold text-[#111318] dark:text-white">Mark D.</span>
                                <span className="text-[9px] text-accent-mint font-bold">980 pts</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-cover ring-2 ring-orange-400" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfL4b0NpEn-87yRPSzPP3ZoYLJkh07-KWn-FcNVw5C5d8GXmbtwkc1AxfHzzF0BPxciiM7nGupmh9VOXeivOaH1cm0mJwbZgK0mYARZuo0TrbnxDds5FEwFqTMkfkv2-GGxx3JKMV6vHXuMnoIINjpNmqqzhT4QTxnDy82pj5gI-4kiy8jWLLFO3QIpCTAIuZ66FPSVu4XUMQEXSJ-ni9S1gDwEV2Co5Zu_Qek7SLYhHCW1poQGv85YfU90MNwQ23OtBzSM79zKAs")'}}></div>
                                    <div className="absolute -top-1 -right-1 bg-orange-400 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</div>
                                </div>
                                <span className="text-[10px] font-bold text-[#111318] dark:text-white">Emily R.</span>
                                <span className="text-[9px] text-accent-mint font-bold">850 pts</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined">add</span>
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">Tú</span>
                                <span className="text-[9px] text-gray-500">420 pts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trending Section */}
                <div className="flex flex-col gap-3 mt-2">
                     <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-[#111318] dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-accent-orange">trending_up</span>
                            Tendencias
                        </h3>
                        <span className="text-xs font-bold text-primary cursor-pointer">Ver todo</span>
                    </div>
                    
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x">
                        {trendingThreads.map((thread) => (
                            <div key={thread.id} className="min-w-[240px] bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 snap-center cursor-pointer hover:border-primary/30 transition-colors">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded w-fit">{thread.topic}</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{thread.title}</h4>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex -space-x-2">
                                        {thread.participants.slice(0,3).map((img, i) => (
                                            <div key={i} className="size-6 rounded-full border-2 border-white dark:border-surface-dark bg-cover bg-center" style={{backgroundImage: `url('${img}')`}}></div>
                                        ))}
                                        {thread.participants.length > 3 && (
                                            <div className="size-6 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-500">+{thread.participants.length - 3}</div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{thread.posts}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Discussion Section */}
                 <div className="flex flex-col gap-4 mt-2">
                    <h2 className="text-lg font-bold text-[#111318] dark:text-white px-1">Discusión Reciente</h2>
                    
                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2">
                        {discussionFilters.map((filter) => (
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

                    {/* Share Input */}
                    <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-cover shrink-0" style={{backgroundImage: `url("${profile.avatar}")`}}></div>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-10 rounded-full flex items-center px-4 transition-colors focus-within:ring-2 focus-within:ring-primary/50">
                            <input 
                                type="text"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                                placeholder="Comparte una reflexión..."
                                className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0"
                            />
                        </div>
                        <button 
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                    </div>

                    {/* Posts Feed */}
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 animate-fadeIn">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cover" style={{backgroundImage: `url("${post.avatar}")`}}></div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111318] dark:text-white">{post.author}</h4>
                                        <p className="text-xs text-gray-500">{post.role} • {post.time}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-primary">
                                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                </button>
                            </div>
                            <div className="text-sm text-[#111318] dark:text-gray-200 leading-relaxed">
                                <p>{post.content}</p>
                            </div>
                            
                            {post.tags.length > 0 && (
                                <div className="flex gap-2 mt-1">
                                    {post.tags.map((tag, idx) => (
                                        <span key={idx} className={`px-2 py-1 ${tag.color} text-[10px] rounded font-bold uppercase tracking-wide`}>
                                            {tag.text}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-1.5 transition-colors group ${post.isLiked ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform ${post.isLiked ? 'fill-current material-symbols-filled' : ''}`}>thumb_up</span>
                                        <span className="text-xs font-medium">{post.likes}</span>
                                    </button>
                                    <button 
                                        onClick={() => toggleComments(post.id)}
                                        className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">chat_bubble</span>
                                        <span className="text-xs font-medium">{post.commentsCount}</span>
                                    </button>
                                </div>
                                <button 
                                    onClick={() => initiateReply(post.id)}
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    Responder
                                </button>
                            </div>

                            {/* Reply Input */}
                            {activeReplyId === post.id && (
                                <div className="flex gap-2 mt-2 items-center animate-in slide-in-from-top-2">
                                    <div className="size-8 rounded-full bg-cover shrink-0" style={{backgroundImage: `url("${profile.avatar}")`}}></div>
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 flex items-center">
                                        <input 
                                            autoFocus
                                            type="text"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && submitReply(post.id)}
                                            placeholder="Escribe una respuesta..."
                                            className="w-full bg-transparent border-none text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 p-0"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => submitReply(post.id)}
                                        disabled={!replyContent.trim()}
                                        className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                    </button>
                                </div>
                            )}

                            {/* Comments Section */}
                            {post.showComments && post.comments.length > 0 && (
                                <div className="flex flex-col gap-3 mt-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-2.5 items-start">
                                            <div className="size-7 rounded-full bg-cover shrink-0 mt-0.5" style={{backgroundImage: `url("${comment.avatar}")`}}></div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-white">{comment.author}</span>
                                                    <span className="text-[10px] text-gray-400">{comment.time}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="text-center py-4">
                        {filteredPosts.length === 0 ? (
                            <p className="text-sm text-gray-400 font-medium italic">No se encontraron discusiones en esta categoría.</p>
                        ) : (
                            <button className="text-sm text-gray-400 font-medium hover:text-primary transition-colors">Cargar más reflexiones...</button>
                        )}
                    </div>
                 </div>
            </div>
            <MainNavigation />
        </div>
     );
}

export default CommunityPage;