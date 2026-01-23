
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
  const { setFullData } = useUserStore();
  
  // Flag para evitar race conditions en la creación de perfil
  const isProcessingAuth = useRef(false);

  // Helper para detectar móvil
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  };

  useEffect(() => {
    // Procesar resultado de redirección (específicamente para PWA en móviles)
    const handleRedirectResult = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result?.user && !isProcessingAuth.current) {
                await syncUserProfile(result.user);
            }
        } catch (error) {
            console.error("Error procesando redirect:", error);
        }
    };
    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser && !isProcessingAuth.current) {
          await syncUserProfile(currentUser);
        }
      } catch (error) {
        console.error("Error en onAuthStateChanged:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setFullData]);

  const syncUserProfile = async (currentUser: User) => {
    if (isProcessingAuth.current) return;
    isProcessingAuth.current = true;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        
        let currentBadges = userData.badges || DEFAULT_BADGES;
        let currentNotifications = userData.notifications || [];
        let needsUpdate = false;

        const pioneroBadge = currentBadges.find((b: Badge) => b.id === 0);
        if (pioneroBadge && !pioneroBadge.earned) {
          currentBadges = currentBadges.map((b: Badge) => b.id === 0 ? { ...b, earned: true, date: todayStr } : b);
          needsUpdate = true;
        }

        if (currentNotifications.length === 0) {
          currentNotifications = [{
            id: Date.now(),
            title: "¡Bienvenido a GrowthLab! 🚀",
            message: "Estamos felices de tenerte. Aquí podrás conectar con mentores y seguir tu crecimiento profesional.",
            type: 'info',
            date: new Date(),
            read: false,
            link: '/explore'
          }];
          needsUpdate = true;
        }

        if (needsUpdate) {
          await updateDoc(userRef, { badges: currentBadges, notifications: currentNotifications });
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
      } else {
        // Crear perfil inicial si no existe
        const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        const initialBadges = DEFAULT_BADGES.map(b => b.id === 0 ? { ...b, earned: true, date: todayStr } : b);
        const welcomeNote = {
            id: Date.now(),
            title: "¡Bienvenido a GrowthLab! 🚀",
            message: "Estamos felices de tenerte.",
            type: 'info',
            date: new Date(),
            read: false,
            link: '/explore'
        };

        const initialData = {
          uid: currentUser.uid,
          profile: {
            name: currentUser.displayName || "Usuario Nuevo",
            role: "Miembro",
            email: currentUser.email || "",
            phone: "",
            linkedin: "",
            bio: "",
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
          notifications: [welcomeNote],
          lastLogin: new Date().toISOString()
        };
        
        await setDoc(userRef, initialData);
        setFullData({ ...initialData, triggerCelebration: initialBadges[0] });
      }
    } catch (err) {
      console.error("Error sincronizando perfil:", err);
    } finally {
      isProcessingAuth.current = false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (isMobile()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) await syncUserProfile(result.user);
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
