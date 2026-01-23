
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const ServicesHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { badges, mySessions } = useUserStore();
    const [activeTab, setActiveTab] = useState<'mentorships' | 'certificates'>('certificates');

    const subscription = {
        plan: "Plan Profesional",
        status: "Activo",
        renewal: "Renueva el 12 Nov, 2024",
        nextBilling: "$29.99",
        cardLast4: "4242"
    };

    const stats = {
        sessionsTotal: mySessions.length,
        certsEarned: mySessions.filter(s => s.progress === 100).length,
        badgesEarned: badges.filter(b => b.earned).length
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <h1 className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight">Suscripción</h1>
            </header>

            <main className="flex-1 flex flex-col gap-6 px-6 overflow-y-auto hide-scrollbar pt-2">
                <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/20 bg-[#0f172a] text-white">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/30 rounded-full blur-[80px]"></div>
                    <div className="relative z-10 p-7 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan Actual</span>
                                <h2 className="text-2xl font-display font-bold text-white tracking-wide">{subscription.plan}</h2>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wide">{subscription.status}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Próxima Facturación</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-white">{subscription.nextBilling}</span>
                                    <span className="text-xs text-slate-400">/mes</span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white text-[#0f172a] rounded-xl text-xs font-bold shadow-lg">Gestionar</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div onClick={() => setActiveTab('mentorships')} className={`flex flex-col items-center p-3 rounded-2xl border cursor-pointer transition-colors ${activeTab === 'mentorships' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800'}`}>
                        <span className="material-symbols-filled text-indigo-600 mb-1">play_circle</span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">{stats.sessionsTotal}</span>
                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Mentorías</span>
                    </div>
                    <div onClick={() => setActiveTab('certificates')} className={`flex flex-col items-center p-3 rounded-2xl border cursor-pointer transition-colors ${activeTab === 'certificates' ? 'bg-blue-50 dark:bg-blue-900/20 border-primary' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800'}`}>
                        <span className="material-symbols-filled text-primary mb-1">workspace_premium</span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">{stats.certsEarned}</span>
                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Certificados</span>
                    </div>
                    <div onClick={() => navigate('/badges')} className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
                        <span className="material-symbols-filled text-purple-600 mb-1">military_tech</span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">{stats.badgesEarned}</span>
                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Insignias</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">
                        {activeTab === 'mentorships' ? 'Mis Mentorías' : 'Mis Certificados'}
                    </h3>

                    <div className="flex flex-col gap-3">
                        {activeTab === 'mentorships' ? (
                             mySessions.map(session => (
                                <div key={session.id} className="flex gap-3 p-3 rounded-2xl border bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0 bg-cover bg-center" style={{backgroundImage: `url("${session.image}")`}}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">{session.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{width: `${session.progress}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-primary">{session.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            mySessions.filter(s => s.progress === 100).map(cert => (
                                <div key={cert.id} className="flex gap-3 p-3 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm items-center">
                                    <span className="material-symbols-filled text-primary">verified</span>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{cert.title}</h4>
                                </div>
                            ))
                        )}
                        {(activeTab === 'mentorships' ? mySessions : mySessions.filter(s => s.progress === 100)).length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-6">No hay datos disponibles en esta sección.</p>
                        )}
                    </div>
                </div>
            </main>
            <MainNavigation />
        </div>
    );
};

export default ServicesHubPage;
