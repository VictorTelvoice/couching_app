import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useUserStore, DEFAULT_BADGES, Notification, Badge } from '../store/useUserStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setFullData, badges } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            
            // --- SISTEMA DE REPARACIÓN DE CUENTA (MIGRACIÓN) ---
            let currentBadges = userData.badges || DEFAULT_BADGES;
            let currentNotifications = userData.notifications || [];
            let needsUpdate = false;

            // 1. Asegurar insignia Pionero (ID 0)
            const pioneroBadge = currentBadges.find((b: Badge) => b.id === 0);
            if (pioneroBadge && !pioneroBadge.earned) {
              currentBadges = currentBadges.map((b: Badge) => b.id === 0 ? {
                  ...b,
                  earned: true,
                  date: todayStr
              } : b);
              needsUpdate = true;
            }

            // 2. Asegurar notificación de bienvenida si no hay ninguna
            if (currentNotifications.length === 0) {
              const welcomeNote: Notification = {
                id: Date.now(),
                title: "¡Bienvenido a GrowthLab! 🚀",
                message: "Estamos felices de tenerte. Aquí podrás conectar con mentores y seguir tu crecimiento profesional.",
                type: 'info',
                date: new Date(),
                read: false,
                link: '/explore'
              };
              currentNotifications = [welcomeNote];
              needsUpdate = true;
            }

            // Aplicar cambios en Firestore si hubo reparaciones
            if (needsUpdate) {
              await updateDoc(userRef, {
                badges: currentBadges,
                notifications: currentNotifications
              });
            }

            setFullData({
              profile: {
                ...userData.profile,
                name: userData.profile?.name || currentUser.displayName || "Usuario",
                avatar: userData.profile?.avatar || currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
                email: userData.profile?.email || currentUser.email || "",
                level: userData.profile?.level ?? 1,
                levelName: userData.profile?.levelName || "Pionero",
                xp: userData.profile?.xp ?? 0,
                nextLevelXp: userData.profile?.nextLevelXp ?? 500
              },
              skills: userData.skills || [],
              badges: currentBadges,
              mySessions: userData.mySessions || [],
              savedContent: userData.savedContent || [],
              notifications: currentNotifications.map((n: any) => ({
                  ...n,
                  date: n.date?.toDate ? n.date.toDate() : new Date(n.date)
              }))
            });
          }
        }
      } catch (error) {
        console.error("Error durante la sincronización de datos de Firestore:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setFullData]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        const initialBadges = DEFAULT_BADGES.map(b => b.id === 0 ? {
            ...b,
            earned: true,
            date: todayStr
        } : b);

        const welcomeNote: Notification = {
            id: Date.now(),
            title: "¡Bienvenido a GrowthLab! 🚀",
            message: "Estamos felices de tenerte. Aquí podrás conectar con mentores y seguir tu crecimiento profesional.",
            type: 'info',
            date: new Date(),
            read: false,
            link: '/explore'
        };

        const initialData = {
          uid: user.uid,
          profile: {
            name: user.displayName || "Usuario Nuevo",
            role: "Miembro",
            email: user.email || "",
            phone: "",
            linkedin: "",
            bio: "",
            avatar: user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
            level: 1,
            levelName: "Pionero",
            xp: 0,
            nextLevelXp: 500
          },
          skills: [],
          badges: initialBadges,
          mySessions: [],
          savedContent: [],
          notifications: [welcomeNote],
          lastLogin: new Date().toISOString()
        };
        
        await setDoc(userRef, initialData);
        setFullData({ ...initialData, triggerCelebration: initialBadges[0] });

      } else {
        await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
      }
      
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
