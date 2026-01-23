
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserStore, DEFAULT_BADGES, Notification } from '../store/useUserStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
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

  const createInitialUserDoc = async (user: User, displayName?: string) => {
    const userRef = doc(db, "users", user.uid);
    const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const initialBadges = DEFAULT_BADGES.map(b => b.id === 0 ? {
        ...b,
        earned: true,
        date: todayStr
    } : b);

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
        name: displayName || user.displayName || "Usuario Nuevo",
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
    setFullData({
        ...initialData,
        triggerCelebration: initialBadges[0]
    });
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await createInitialUserDoc(user);
      } else {
        await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Error al iniciar sesión con email", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });
      await createInitialUserDoc(result.user, name);
    } catch (error) {
      console.error("Error al registrarse con email", error);
      throw error;
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
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
