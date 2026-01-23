
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, updateProfile } = useUserStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form with store data
    const [formData, setFormData] = useState({
        name: profile.name || "",
        role: profile.role || "",
        email: profile.email || "",
        phone: profile.phone || "",
        linkedin: profile.linkedin || "",
        bio: profile.bio || "",
        avatar: profile.avatar || ""
    });

    useEffect(() => {
        setFormData({
            name: profile.name || "",
            role: profile.role || "",
            email: profile.email || "",
            phone: profile.phone || "",
            linkedin: profile.linkedin || "",
            bio: profile.bio || "",
            avatar: profile.avatar || ""
        });
    }, [profile]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    handleChange('avatar', reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        if (!auth.currentUser) {
            alert("No hay una sesión activa.");
            return;
        }

        setIsSaving(true);
        
        try {
            let finalAvatarUrl = formData.avatar;

            // 1. Subida a Storage si es una imagen nueva (base64)
            if (formData.avatar.startsWith('data:image')) {
                console.log('Subiendo nueva imagen a Firebase Storage...');
                const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
                
                // Subimos la cadena data_url directamente
                await uploadString(storageRef, formData.avatar, 'data_url');
                
                // Obtenemos la URL pública
                finalAvatarUrl = await getDownloadURL(storageRef);
                console.log('Imagen subida con éxito:', finalAvatarUrl);

                // 2. Actualizar Firebase Auth (native user profile)
                // Esto hace que la foto cambie en todos los componentes que usen auth.currentUser
                await updateAuthProfile(auth.currentUser, {
                    photoURL: finalAvatarUrl
                });
            }

            // También actualizamos el nombre en Auth si ha cambiado
            if (formData.name !== auth.currentUser.displayName) {
                await updateAuthProfile(auth.currentUser, {
                    displayName: formData.name
                });
            }

            // 3. Limpieza de Datos para Firestore
            // Convertimos cualquier valor undefined o nulo a cadena vacía para evitar errores de Firestore
            const cleanedFormData = { 
                ...formData,
                avatar: finalAvatarUrl // Usamos la URL (ya sea la vieja o la nueva de Storage)
            };

            const fullProfileToSave = {
                ...profile,
                ...cleanedFormData
            };

            // Aseguramos que ningún campo sea undefined antes de enviar
            Object.keys(fullProfileToSave).forEach(key => {
                const k = key as keyof typeof fullProfileToSave;
                if (fullProfileToSave[k] === undefined || fullProfileToSave[k] === null) {
                    (fullProfileToSave as any)[k] = "";
                }
            });

            console.log('Datos a enviar a Firestore:', fullProfileToSave);

            // 4. Sincronización con Firestore (Persistencia Real)
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, { 
                profile: fullProfileToSave
            }, { merge: true });
            
            // 5. Actualización local (Zustand) para feedback inmediato
            updateProfile(cleanedFormData);
            
            navigate('/profile');
        } catch (error: any) {
            console.error("Error completo al persistir cambios:", error);
            alert(`Error al guardar: ${error.message || "Por favor, inténtalo de nuevo."}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Editar Perfil</h1>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`text-primary font-bold text-sm hover:opacity-80 transition-opacity ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
            </header>

            <main className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4 group cursor-pointer" onClick={triggerFileInput}>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-28 border-4 border-slate-50 dark:border-slate-700 shadow-md group-hover:opacity-90 transition-opacity" style={{backgroundImage: `url("${formData.avatar}")`}}></div>
                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white dark:border-[#1e293b] shadow-sm hover:bg-primary-dark transition-colors">
                             <span className="material-symbols-outlined text-[18px]">camera_alt</span>
                        </button>
                    </div>
                    <button onClick={triggerFileInput} className="text-sm font-bold text-primary hover:underline">Cambiar foto de perfil</button>
                </div>

                <div className="flex flex-col gap-5">
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Nombre Completo</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">person</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Cargo / Título</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">work</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Teléfono</label>
                         <div className="relative">
                            <input 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">call</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">LinkedIn</label>
                         <div className="relative">
                            <input 
                                type="text" 
                                value={formData.linkedin}
                                onChange={(e) => handleChange('linkedin', e.target.value)}
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">link</span>
                        </div>
                    </div>
                     
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Bio</label>
                        <textarea 
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProfilePage;
