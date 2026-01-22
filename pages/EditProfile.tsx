import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, updateProfile } = useUserStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form with store data
    const [formData, setFormData] = useState({
        name: profile.name,
        role: profile.role,
        email: profile.email,
        phone: profile.phone,
        linkedin: profile.linkedin,
        bio: profile.bio,
        avatar: profile.avatar
    });

    // Ensure state updates if store changes externally (optional safeguard)
    useEffect(() => {
        setFormData({
            name: profile.name,
            role: profile.role,
            email: profile.email,
            phone: profile.phone,
            linkedin: profile.linkedin,
            bio: profile.bio,
            avatar: profile.avatar
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

    const handleSave = () => {
        updateProfile(formData);
        navigate('/profile');
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
                <button onClick={handleSave} className="text-primary font-bold text-sm hover:opacity-80 transition-opacity">Guardar</button>
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
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">URL de Foto de Perfil</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formData.avatar}
                                onChange={(e) => handleChange('avatar', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">image</span>
                        </div>
                    </div>

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
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Correo Electrónico</label>
                         <div className="relative">
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">mail</span>
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