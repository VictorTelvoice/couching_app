
import { create } from 'zustand';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

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
    progress: number; // 0 to 100
    type: 'recorded' | 'live';
    duration: string;
    image: string;
    author?: string;
    lastAccessed?: string;
    totalModules?: number;
    completedModules?: number;
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

export interface ToastState {
    message: string;
    type: 'success' | 'info' | 'error';
    visible: boolean;
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
    toast: ToastState;
    
    // Actions
    updateProfile: (data: Partial<UserProfile>) => void;
    setFullData: (data: Partial<UserState> & { triggerCelebration?: Badge | null }) => void;
    addSkill: (skill: string) => void;
    removeSkill: (skill: string) => void;
    unlockBadge: (id: number) => void;
    clearCelebration: () => void;
    toggleSave: (id: number) => void;
    updateSessionProgress: (sessionId: number, completedModules: number, totalModules: number) => Promise<void>;
    addReview: (review: Omit<Review, 'id' | 'author' | 'avatar' | 'date'>) => void;
    addNotification: (note: Omit<Notification, 'id' | 'date' | 'read'>) => void;
    markNotificationAsRead: (id: number) => void;
    markAllNotificationsAsRead: () => void;
    getUnreadCount: () => number;
    showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
    hideToast: () => void;
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
    toast: { message: '', type: 'success', visible: false },

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

    updateSessionProgress: async (sessionId, completedModules, totalModules) => {
        const progress = Math.round((completedModules / totalModules) * 100);
        const lastAccessed = new Date().toISOString();
        
        set((state) => {
            const sessionExists = state.mySessions.find(s => s.id === sessionId);
            let updatedSessions;

            if (sessionExists) {
                updatedSessions = state.mySessions.map(s => 
                    s.id === sessionId ? { ...s, progress, completedModules, totalModules, lastAccessed } : s
                );
            } else {
                const newSession: Session = {
                    id: sessionId,
                    title: "Negociación Eficaz", 
                    progress,
                    type: 'recorded',
                    duration: "2h 15m",
                    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3o3mGPf1c15aSUXZH3CAadspVPFP_yTlwBo8qQ7E7Ipq6U6-gpj62nOSuRn-0IKDgwhXx0Zt3CA0xzLFCaar-Hfj6jzLQ6BLhmRpFSgAnjB7nCCBIRTrrsuey5A8xi0WhC9ZlZw6flhqVmVM-ytbLVyIbo2aQwIjW3p_ygyQstnyQwaoIanPS7XNgXB0L23u3ciyXRyHrzOFsxHGutf-SExGrZZvnVVDaMGe5eZ0ELMx3-gbUeviWCCeB7jUuTW5SCf5BHSRiZQg",
                    lastAccessed,
                    completedModules,
                    totalModules
                };
                updatedSessions = [newSession, ...state.mySessions];
            }

            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                updateDoc(userRef, { mySessions: updatedSessions });
            }

            if (progress === 100 && sessionId === 101) {
                setTimeout(() => get().unlockBadge(2), 500); 
            }

            return { mySessions: updatedSessions };
        });
    },

    clearCelebration: () => set({ recentBadgeEarned: null }),

    toggleSave: (id) => set((state) => {
        const isSaved = state.savedContent.includes(id);
        const updatedSaved = isSaved 
            ? state.savedContent.filter(itemId => itemId !== id)
            : [...state.savedContent, id];

        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            updateDoc(userRef, { savedContent: updatedSaved });
        }

        return { savedContent: updatedSaved };
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

    markNotificationAsRead: (id) => set((state) => {
        const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            updateDoc(userRef, { notifications: updated });
        }
        return { notifications: updated };
    }),

    markAllNotificationsAsRead: () => set((state) => {
        const updated = state.notifications.map(n => ({ ...n, read: true }));
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            updateDoc(userRef, { notifications: updated });
        }
        return { notifications: updated };
    }),

    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
    },

    showToast: (message, type = 'success') => set({ toast: { message, type, visible: true } }),
    hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } }))
}));
