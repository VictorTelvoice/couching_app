
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useUserStore, DEFAULT_BADGES } from '../store/useUserStore';

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
  const unlockBadge = useUserStore((state) => state.unlockBadge);
  const addNotification = useUserStore((state) => state.addNotification);

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
              notifications: userData.notifications || []
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
        // Documento inicial para nuevos usuarios
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
            levelName: "Novato",
            xp: 0,
            nextLevelXp: 500
          },
          skills: [],
          badges: DEFAULT_BADGES,
          mySessions: [],
          savedContent: [],
          notifications: [],
          lastLogin: new Date().toISOString()
        };
        
        await setDoc(userRef, initialData);
        setFullData(initialData);

        // --- ACCIONES DE BIENVENIDA ---
        // 1. Desbloquear insignia Pionero (ID 0)
        unlockBadge(0);
        
        // 2. Notificación de Bienvenida
        addNotification({
          title: "¡Bienvenido a GrowthLab! 🚀",
          message: "Estamos felices de tenerte. Aquí podrás conectar con mentores, realizar micro-cursos y seguir tu crecimiento profesional.",
          type: 'info',
          link: '/explore'
        });

        // 3. Persistir estos cambios iniciales de bienvenida en Firestore
        const state = useUserStore.getState();
        await updateDoc(userRef, {
            badges: state.badges,
            notifications: state.notifications
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
