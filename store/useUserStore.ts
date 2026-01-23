
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
    border?: string;
    filled?: boolean;
}

export interface Session {
    id: number;
    title: string;
    progress: number;
    type: 'recorded' | 'live';
    duration: string;
    image: string;
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
    date: Date | string;
    read: boolean;
    link?: string;
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
    mySessions: Session[];
    savedContent: number[];
    reviews: Review[];
    notifications: Notification[];
    recentBadgeEarned: Badge | null;
    theme: 'light' | 'dark';
    
    // Actions
    updateProfile: (data: Partial<UserProfile>) => void;
    setFullData: (data: Partial<UserState> & { triggerCelebration?: Badge | null }) => void;
    addSkill: (skill: string) => void;
    removeSkill: (skill: string) => void;
    unlockBadge: (id: number) => void;
    clearCelebration: () => void;
    toggleSave: (id: number) => void;
    addReview: (review: Omit<Review, 'id' | 'author' | 'avatar' | 'date'>) => void;
    addNotification: (note: Omit<Notification, 'id' | 'date' | 'read'>) => void;
    markNotificationAsRead: (id: number) => void;
    markAllNotificationsAsRead: () => void;
    getUnreadCount: () => number;
    toggleTheme: () => void;
}

export const DEFAULT_BADGES: Badge[] = [
    { id: 0, name: "Pionero", desc: "Te has unido a la comunidad de GrowthLab", icon: 'rocket_launch', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', earned: false, progress: 0, border: 'border-primary/20', filled: true },
    { id: 1, name: "Racha de 7 días", desc: "Aprendizaje continuo por una semana", icon: 'local_fire_department', color: 'text-accent-orange', bg: 'bg-orange-50 dark:bg-orange-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
    { id: 2, name: "Maestro de Negociación", desc: "Completar curso avanzado", icon: 'handshake', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
    { id: 3, name: "Colaborador Estrella", desc: "Top 10% en contribuciones", icon: 'star', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
    { id: 4, name: "Liderazgo Agile", desc: "Finalizar ruta de liderazgo", icon: 'military_tech', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
    { id: 5, name: "Gurú de Datos", desc: "Analítica avanzada nivel 2", icon: 'analytics', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20', earned: false, progress: 0, border: 'border-dashed border-slate-200 dark:border-slate-700 opacity-70', filled: false },
];

export const useUserStore = create<UserState>((set, get) => ({
    profile: {
        name: "Usuario Nuevo",
        role: "Aprendiz",
        email: "",
        phone: "",
        linkedin: "",
        bio: "",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        level: 1,
        levelName: "Pionero",
        xp: 0,
        nextLevelXp: 500
    },
    skills: [],
    badges: DEFAULT_BADGES,
    mySessions: [],
    savedContent: [],
    reviews: [],
    notifications: [],
    recentBadgeEarned: null,
    theme: 'light',

    updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    
    setFullData: (data) => set((state) => ({ 
        ...state, 
        ...data,
        recentBadgeEarned: data.triggerCelebration || state.recentBadgeEarned
    })),

    addSkill: (skill) => set((state) => {
        if (!skill.trim() || state.skills.includes(skill.trim())) return state;
        return { skills: [...state.skills, skill.trim()] };
    }),
    removeSkill: (skill) => set((state) => ({ skills: state.skills.filter(s => s !== skill) })),
    
    unlockBadge: (id) => set((state) => {
        const badge = state.badges.find(b => b.id === id);
        if (badge && !badge.earned) {
            const unlockedBadge = { 
                ...badge, 
                earned: true, 
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) 
            };
            
            const newNote: Notification = {
                id: Date.now(),
                title: "¡Insignia Desbloqueada!",
                message: `Has ganado la insignia "${badge.name}". ¡Sigue así!`,
                type: 'success',
                date: new Date(),
                read: false,
                link: '/badges'
            };

            return {
                badges: state.badges.map(b => b.id === id ? unlockedBadge : b),
                notifications: [newNote, ...state.notifications],
                recentBadgeEarned: unlockedBadge
            };
        }
        return state;
    }),

    clearCelebration: () => set({ recentBadgeEarned: null }),

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
    addNotification: (noteData) => set((state) => {
        const newNote: Notification = {
            ...noteData,
            id: Date.now(),
            date: new Date(),
            read: false
        };
        return { notifications: [newNote, ...state.notifications] };
    }),
    markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
    },
    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
    })),
}));
