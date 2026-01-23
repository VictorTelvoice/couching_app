
import { create } from 'zustand';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

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
    lastLessonId?: number;
    completedLessons?: number[];
    updatedAt?: number;
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
    
    // Actions
    updateProfile: (data: Partial<UserProfile>) => void;
    setFullData: (data: Partial<UserState> & { triggerCelebration?: Badge | null }) => void;
    addSkill: (skill: string) => Promise<void>;
    removeSkill: (skill: string) => Promise<void>;
    unlockBadge: (id: number) => Promise<void>;
    clearCelebration: () => void;
    toggleSave: (id: number) => Promise<void>;
    addReview: (review: Omit<Review, 'id' | 'author' | 'avatar' | 'date'>) => Promise<void>;
    addNotification: (note: Omit<Notification, 'id' | 'date' | 'read'>) => Promise<void>;
    markNotificationAsRead: (id: number) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
    getUnreadCount: () => number;
    
    // New Progress Actions
    updateSessionProgress: (courseId: number, lessonId: number, totalLessons: number, courseTitle: string, courseImage: string) => Promise<void>;
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

    updateProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
    
    setFullData: (data) => set((state) => ({ 
        ...state, 
        ...data,
        recentBadgeEarned: data.triggerCelebration || state.recentBadgeEarned
    })),

    addSkill: async (skill) => {
        const currentSkills = get().skills;
        const skillTrimmed = skill.trim();
        if (!skillTrimmed || currentSkills.includes(skillTrimmed)) return;

        const newSkills = [...currentSkills, skillTrimmed];
        set({ skills: newSkills });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { skills: newSkills });
        } catch (err) {
            set({ skills: currentSkills });
            alert("Error al guardar la habilidad. Inténtalo de nuevo.");
        }
    },

    removeSkill: async (skill) => {
        const currentSkills = get().skills;
        const newSkills = currentSkills.filter(s => s !== skill);
        set({ skills: newSkills });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { skills: newSkills });
        } catch (err) {
            set({ skills: currentSkills });
            alert("Error al eliminar la habilidad.");
        }
    },
    
    unlockBadge: async (id) => {
        const currentBadges = get().badges;
        const currentNotes = get().notifications;
        const badge = currentBadges.find(b => b.id === id);

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

            const updatedBadges = currentBadges.map(b => b.id === id ? unlockedBadge : b);
            const updatedNotes = [newNote, ...currentNotes];

            set({ badges: updatedBadges, notifications: updatedNotes, recentBadgeEarned: unlockedBadge });

            try {
                const userId = auth.currentUser?.uid;
                if (userId) {
                    await updateDoc(doc(db, "users", userId), { 
                        badges: updatedBadges,
                        notifications: updatedNotes 
                    });
                }
            } catch (err) {
                set({ badges: currentBadges, notifications: currentNotes, recentBadgeEarned: null });
                alert("Error al procesar el logro.");
            }
        }
    },

    clearCelebration: () => set({ recentBadgeEarned: null }),

    toggleSave: async (id) => {
        const oldSaved = get().savedContent;
        const isSaved = oldSaved.includes(id);
        const newSaved = isSaved ? oldSaved.filter(itemId => itemId !== id) : [...oldSaved, id];
        
        set({ savedContent: newSaved });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { savedContent: newSaved });
        } catch (err) {
            set({ savedContent: oldSaved });
            alert("No se pudo actualizar tu lista de guardados.");
        }
    },

    addReview: async (reviewData) => {
        const oldReviews = get().reviews;
        const newReview: Review = {
            id: Date.now(),
            mentorId: reviewData.mentorId,
            rating: reviewData.rating,
            comment: reviewData.comment,
            author: get().profile.name,
            avatar: get().profile.avatar,
            date: "Justo ahora"
        };
        
        const updatedReviews = [newReview, ...oldReviews];
        set({ reviews: updatedReviews });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { reviews: updatedReviews });
        } catch (err) {
            set({ reviews: oldReviews });
            alert("No se pudo publicar tu reseña.");
        }
    },

    addNotification: async (noteData) => {
        const oldNotes = get().notifications;
        const newNote: Notification = {
            ...noteData,
            id: Date.now(),
            date: new Date(),
            read: false
        };
        const updatedNotes = [newNote, ...oldNotes];
        set({ notifications: updatedNotes });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { notifications: updatedNotes });
        } catch (err) {
            set({ notifications: oldNotes });
        }
    },

    markNotificationAsRead: async (id) => {
        const oldNotes = get().notifications;
        const updatedNotes = oldNotes.map(n => n.id === id ? { ...n, read: true } : n);
        set({ notifications: updatedNotes });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { notifications: updatedNotes });
        } catch (err) {
            set({ notifications: oldNotes });
        }
    },

    markAllNotificationsAsRead: async () => {
        const oldNotes = get().notifications;
        const updatedNotes = oldNotes.map(n => ({ ...n, read: true }));
        set({ notifications: updatedNotes });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { notifications: updatedNotes });
        } catch (err) {
            set({ notifications: oldNotes });
            alert("Error al marcar notificaciones.");
        }
    },

    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
    },

    updateSessionProgress: async (courseId, lessonId, totalLessons, courseTitle, courseImage) => {
        const oldSessions = get().mySessions;
        const existingSession = oldSessions.find(s => s.id === courseId);
        
        let completed = existingSession?.completedLessons || [];
        if (!completed.includes(lessonId)) {
            completed = [...completed, lessonId];
        }

        const newProgress = Math.round((completed.length / totalLessons) * 100);
        let updatedSessions: Session[];

        if (existingSession) {
            updatedSessions = oldSessions.map(s => s.id === courseId ? {
                ...s,
                progress: newProgress,
                lastLessonId: lessonId,
                completedLessons: completed,
                updatedAt: Date.now()
            } : s);
        } else {
            updatedSessions = [...oldSessions, {
                id: courseId,
                title: courseTitle,
                progress: newProgress,
                type: 'recorded',
                duration: "2h",
                image: courseImage,
                lastLessonId: lessonId,
                completedLessons: completed,
                updatedAt: Date.now()
            }];
        }

        set({ mySessions: updatedSessions });

        try {
            const userId = auth.currentUser?.uid;
            if (userId) await updateDoc(doc(db, "users", userId), { mySessions: updatedSessions });
        } catch (error) {
            set({ mySessions: oldSessions });
            console.error("Error updating progress:", error);
        }
    }
}));
