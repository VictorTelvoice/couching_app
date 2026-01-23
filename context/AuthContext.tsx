
import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  onAuthStateChanged, 
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useUserStore, DEFAULT_BADGES, Badge } from '../store/useUserStore';

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
  const { setFullData } = useUserStore();
  
  const isSyncing = useRef(false);

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Solo sincronizamos si no hay un proceso en marcha
        if (!isSyncing.current) {
          await syncUserProfile(currentUser);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const syncUserProfile = async (currentUser: User) => {
    isSyncing.current = true;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFullData({
          profile: {
            ...userData.profile,
            name: userData.profile?.name || currentUser.displayName || "Usuario",
            avatar: userData.profile?.avatar || currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
            email: userData.profile?.email || currentUser.email || ""
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
      } else {
        const initialBadges = DEFAULT_BADGES.map(b => b.id === 0 ? { ...b, earned: true, date: todayStr } : b);
        const initialData = {
          uid: currentUser.uid,
          profile: {
            name: currentUser.displayName || "Usuario Nuevo",
            role: "Miembro",
            email: currentUser.email || "",
            avatar: currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
            level: 1,
            levelName: "Pionero",
            xp: 0,
            nextLevelXp: 500
          },
          skills: [],
          badges: initialBadges,
          mySessions: [],
          savedContent: [],
          notifications: [{
            id: Date.now(),
            title: "¡Bienvenido a GrowthLab! 🚀",
            message: "Tu cuenta ha sido creada exitosamente.",
            type: 'info',
            date: new Date(),
            read: false,
            link: '/explore'
          }]
        };
        await setDoc(userRef, initialData);
        setFullData(initialData);
      }
    } catch (err) {
      console.error("Error en syncUserProfile:", err);
    } finally {
      isSyncing.current = false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (isMobile()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
          await syncUserProfile(result.user);
        }
      }
    } catch (error: any) {
      console.error("Error Google Sign-In:", error);
      alert("Error al iniciar sesión: " + (error.message || "Verifica tu conexión."));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error Logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
