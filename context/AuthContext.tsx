
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserStore, DEFAULT_BADGES, Notification } from '../store/useUserStore';

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
  const setFullData = useUserStore((state) => state.setFullData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFullData({
              profile: {
                ...userData.profile,
                name: userData.profile?.name || currentUser.displayName || "Usuario",
                avatar: userData.profile?.avatar || currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
                email: userData.profile?.email || currentUser.email || "",
              },
              skills: userData.skills || [],
              badges: userData.badges || DEFAULT_BADGES,
              mySessions: userData.mySessions || [],
              savedContent: userData.savedContent || [],
              notifications: (userData.notifications || []).map((n: any) => ({
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
        // --- PREPARAR DATOS INICIALES ATÓMICOS ---
        const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        
        // 1. Marcar insignia Pionero (ID 0) como ganada
        const initialBadges = DEFAULT_BADGES.map(b => b.id === 0 ? {
            ...b,
            earned: true,
            date: todayStr
        } : b);

        // 2. Crear notificación de bienvenida
        const welcomeNote: Notification = {
            id: Date.now(),
            title: "¡Bienvenido a GrowthLab! 🚀",
            message: "Estamos felices de tenerte. Aquí podrás conectar con mentores, realizar micro-cursos y seguir tu crecimiento profesional.",
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
        
        // Guardar todo de una vez en Firestore
        await setDoc(userRef, initialData);
        
        // Actualizar store local y disparar celebración
        setFullData({
            ...initialData,
            triggerCelebration: initialBadges[0]
        });

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
