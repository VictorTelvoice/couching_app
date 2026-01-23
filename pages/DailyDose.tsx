
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DailyDosePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark font-display">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-5 flex items-center border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="ml-4 text-lg font-extrabold text-slate-900 dark:text-white">Dosis Diaria</h1>
            </header>

            {/* Content */}
            <main className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-800 shadow-sm">
                            <span className="material-symbols-filled text-[28px] text-yellow-500">lightbulb</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none block mb-1">Bienestar Laboral</span>
                            <span className="text-xs font-bold text-slate-400">Lectura de 1 min</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-6">Micro-Descansos Visuales: La Regla 20-20-20</h2>
                    
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl">
                        <img 
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" 
                            className="w-full h-full object-cover" 
                            alt="Wellness"
                        />
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">
                        <p className="text-lg font-medium">
                            En la era digital, pasamos gran parte del día mirando pantallas, lo que genera una fatiga visual conocida como "Síndrome Visual Informático".
                        </p>
                        
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                            <h3 className="text-indigo-900 dark:text-indigo-200 font-extrabold text-xl mb-3 flex items-center gap-2">
                                <span className="material-symbols-filled">task_alt</span>
                                ¿Cómo aplicarlo?
                            </h3>
                            <p className="font-bold text-indigo-800 dark:text-indigo-300 mb-4">La regla 20-20-20 es el hábito más simple:</p>
                            <ul className="space-y-3 font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">1</span>
                                    Cada <span className="font-bold">20 minutos</span> de trabajo...
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">2</span>
                                    Mira un objeto a <span className="font-bold">20 pies</span> (6 metros)...
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">3</span>
                                    Durante al menos <span className="font-bold">20 segundos</span>.
                                </li>
                            </ul>
                        </div>

                        <p>
                            Este ejercicio permite que los músculos ciliares dentro de tus ojos se relajen, reduciendo dolores de cabeza y la sequedad ocular. Es una inversión mínima de tiempo para un beneficio máximo en tu productividad y salud a largo plazo.
                        </p>
                        
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Tip Pro:</h4>
                            <p className="text-sm italic opacity-80">Configura un recordatorio en tu móvil o usa extensiones de navegador para que te avisen cada 20 minutos hasta que se convierta en un reflejo natural.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Action Footer */}
            <footer className="p-6 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-filled">check_circle</span>
                    Marcar como leído
                </button>
            </footer>
        </div>
    );
};

export default DailyDosePage;
