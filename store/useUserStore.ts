import { create } from 'zustand';

export interface Badge {
    id: number;
    name: string;
    desc: string;
    icon: string;
    color: string;
    bg: string;
    earned: boolean;
    date?: string;
    progress?: number;
    border?: string; // For UI styling in grid
    filled?: boolean; // For icon style
}

export interface Review {
    id: number;
    mentorId: number;
    author: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'alert' | 'success' | 'info' | 'message';
    date: Date; // Object date for sorting
    read: boolean;
    link?: string; // Where to navigate on click
}

interface UserProfile {
    name: string;
    role: string;
    email: string;
    phone: string;
    linkedin: string;
    bio: string;
    avatar: string;
    level: number;
    levelName: string;
    xp: number;
    nextLevelXp: number;
}

interface UserState {
    profile: UserProfile;
    skills: string[];
    badges: Badge[];
    savedContent: number[]; // IDs of saved courses/articles
    reviews: Review[];
    notifications: Notification[];
    
    // Actions
    updateProfile: (data: Partial<UserProfile>) => void;
    addSkill: (skill: string) => void;
    removeSkill: (skill: string) => void;
    unlockBadge: (id: number) => void;
    toggleSave: (id: number) => void;
    addReview: (review: Omit<Review, 'id' | 'author' | 'avatar' | 'date'>) => void;
    markNotificationAsRead: (id: number) => void;
    markAllNotificationsAsRead: () => void;
    getUnreadCount: () => number;
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: {
        name: "Ana García",
        role: "Gerente de Talento & Cultura",
        email: "ana.garcia@company.com",
        phone: "+52 55 1234 5678",
        linkedin: "linkedin.com/in/ana-garcia",
        bio: "Apasionada por el desarrollo de talento y la cultura organizacional. Enfocada en crear equipos de alto rendimiento.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0wApMRKVGIxZCNl-3SUdQfe-Uktb80q-CCZ5FuOFJkeiMrMEJnDgtrIA02DgVTvEMwVWDm_DHnEr6R62UyDlDMYiHgktIx7x5QPyE3wBnt7Qxqd_mXEnSsS3x744bf9ZjFKX-lvNvQbFwUa19NMJ5G_4G2Hps00haZ4i_y72eo07xbhMIiqcfKVE7Zvm84r5VzNV6BXls9GVPiP-kitxpNECCS5yqvHxu59rLwa-hP7aLN-I5jkZyjQEK3mFac-nuKtRYoZANi6M",
        level: 12,
        levelName: "Mentor en Potencia",
        xp: 1250,
        nextLevelXp: 2000
    },
    skills: [
        "Liderazgo", "Gestión de Equipos", "Comunicación", "Estrategia", "Mentoring", "Resolución de Conflictos"
    ],
    badges: [
        { id: 1, name: "Racha de 7 días", desc: "Aprendizaje continuo por una semana", icon: 'local_fire_department', color: 'text-accent-orange', bg: 'bg-orange-50 dark:bg-orange-900/20', earned: true, date: "12 Oct 2023", border: 'hover:border-accent-orange/30', filled: true },
        { id: 2, name: "Maestro de Negociación", desc: "Completar curso avanzado", icon: 'handshake', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', earned: true, date: "05 Sep 2023", border: 'hover:border-accent-mint/30', filled: true },
        { id: 3, name: "Colaborador Estrella", desc: "Top 10% en contribuciones", icon: 'star', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20', earned: true, date: "20 Ago 2023", border: 'hover:border-primary/30', filled: true },
        { id: 4, name: "Liderazgo Agile", desc: "Finalizar ruta de liderazgo", icon: 'military_tech', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', earned: false, progress: 85, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
        { id: 5, name: "Gurú de Datos", desc: "Analítica avanzada nivel 2", icon: 'analytics', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', earned: false, progress: 40, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
        { id: 6, name: "Comunicador", desc: "5 presentaciones exitosas", icon: 'record_voice_over', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20', earned: false, progress: 10, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
        { id: 7, name: "Mentor Senior", desc: "50 horas de coaching", icon: 'school', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
        { id: 8, name: "Innovador", desc: "Proponer 3 ideas implementadas", icon: 'lightbulb', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
    ],
    savedContent: [],
    reviews: [
        { id: 101, mentorId: 1, author: "Carlos Ruiz", avatar: "https://i.pravatar.cc/150?img=11", rating: 5, comment: "Excelente sesión, muy clara y práctica.", date: "Hace 2 días" },
        { id: 102, mentorId: 1, author: "Maria González", avatar: "https://i.pravatar.cc/150?img=5", rating: 4, comment: "Buenos consejos sobre liderazgo remoto.", date: "Hace 1 semana" },
        { id: 103, mentorId: 2, author: "Juan Perez", avatar: "https://i.pravatar.cc/150?img=3", rating: 5, comment: "David es un experto en arquitectura cloud.", date: "Hace 3 días" }
    ],
    notifications: [
        { 
            id: 1, 
            title: "Próxima Sesión", 
            message: "Tu sesión de coaching 1:1 comienza en 15 minutos.", 
            type: "alert", 
            date: new Date(), 
            read: false,
            link: '/coaching'
        },
        { 
            id: 2, 
            title: "Curso Completado", 
            message: "¡Felicidades! Has completado 'Fundamentos de Gestión'.", 
            type: "success", 
            date: new Date(), 
            read: false,
            link: '/certificate'
        },
        { 
            id: 3, 
            title: "Nueva Respuesta", 
            message: "Elena comentó en tu publicación del foro.", 
            type: "message", 
            date: new Date(Date.now() - 86400000), // Yesterday
            read: true,
            link: '/community'
        },
        { 
            id: 4, 
            title: "Bienvenido", 
            message: "Explora las nuevas rutas de aprendizaje disponibles.", 
            type: "info", 
            date: new Date(Date.now() - 172800000), // 2 days ago
            read: true,
            link: '/explore'
        }
    ],

    updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    addSkill: (skill) => set((state) => {
        if (!skill.trim() || state.skills.includes(skill.trim())) return state;
        return { skills: [...state.skills, skill.trim()] };
    }),
    removeSkill: (skill) => set((state) => ({ skills: state.skills.filter(s => s !== skill) })),
    unlockBadge: (id) => set((state) => ({
        badges: state.badges.map(b => b.id === id ? { ...b, earned: true, date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) } : b)
    })),
    toggleSave: (id) => set((state) => {
        const isSaved = state.savedContent.includes(id);
        return {
            savedContent: isSaved 
                ? state.savedContent.filter(itemId => itemId !== id)
                : [...state.savedContent, id]
        };
    }),
    addReview: (reviewData) => set((state) => {
        const newReview: Review = {
            id: Date.now(),
            mentorId: reviewData.mentorId,
            rating: reviewData.rating,
            comment: reviewData.comment,
            author: state.profile.name,
            avatar: state.profile.avatar,
            date: "Justo ahora"
        };
        return { reviews: [newReview, ...state.reviews] };
    }),
    markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
    }
}));