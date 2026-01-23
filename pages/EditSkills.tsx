
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const EditSkillsPage: React.FC = () => {
    const navigate = useNavigate();
    const { skills, addSkill, removeSkill } = useUserStore();
    const [newSkill, setNewSkill] = useState("");
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const suggestedSkills = ["Agile", "Scrum", "Python", "Marketing Digital", "Ventas B2B", "Oratoria"];

    const handleAdd = () => {
        if (newSkill.trim()) {
            addSkill(newSkill);
            setNewSkill("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Sincronización con Firestore
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, { skills: skills });
            }
            navigate('/profile');
        } catch (error) {
            console.error("Error al guardar habilidades en Firestore:", error);
            alert("No se pudieron guardar las habilidades. Inténtalo de nuevo.");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = () => {
        if (skillToDelete) {
            removeSkill(skillToDelete);
            setSkillToDelete(null);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                         <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Habilidades</h1>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`text-primary font-bold text-sm hover:opacity-80 transition-opacity ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
            </header>

            <main className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 flex flex-col gap-6">
                
                {/* Add Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Agregar nueva</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ej. Gestión de Proyectos..."
                                className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <button 
                            onClick={handleAdd}
                            disabled={!newSkill.trim()}
                            className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 flex items-center justify-center transition-opacity"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>

                {/* Current Skills */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mis Habilidades ({skills.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full shadow-sm group animate-fadeIn">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{skill}</span>
                                <button 
                                    onClick={() => setSkillToDelete(skill)}
                                    className="size-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                                >
                                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>close</span>
                                </button>
                            </div>
                        ))}
                        {skills.length === 0 && (
                            <p className="text-sm text-gray-400 italic py-2">No has agregado habilidades aún.</p>
                        )}
                    </div>
                </div>

                <div className="h-px w-full bg-gray-100 dark:bg-gray-800 my-2"></div>

                {/* Suggested */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sugerencias</h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestedSkills.filter(s => !skills.includes(s)).map((skill, index) => (
                            <button 
                                key={index} 
                                onClick={() => addSkill(skill)}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-[#1e293b]/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-full text-xs font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors"
                            >
                                + {skill}
                            </button>
                        ))}
                    </div>
                </div>

            </main>

            {/* Delete Confirmation Modal */}
            {skillToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-xs rounded-2xl p-5 shadow-2xl scale-100">
                        <div className="flex flex-col items-center mb-4">
                            <div className="size-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-[28px]">delete</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">¿Eliminar Habilidad?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
                                ¿Estás seguro de que quieres eliminar <span className="font-bold text-slate-700 dark:text-white">"{skillToDelete}"</span> de tu perfil?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setSkillToDelete(null)} 
                                className="flex-1 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditSkillsPage;
