
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        
        if (currentUser) {
          // Sync user data from Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFullData({
              profile: userData.profile || {},
              skills: userData.skills || [],
              badges: userData.badges || DEFAULT_BADGES,
              mySessions: userData.mySessions || [],
              savedContent: userData.savedContent || []
            });
          }
        }
      } catch (error) {
        console.error("Error during auth state sync:", error);
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
          lastLogin: new Date().toISOString()
        };
        await setDoc(userRef, initialData);
        setFullData(initialData);
      } else {
        await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
      }
      
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Reset store on logout if needed or handle via subscription
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
