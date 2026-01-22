import React from 'react';
import MainNavigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

const RankingPage: React.FC = () => {
     const navigate = useNavigate();

     return (
         <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
             <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <h1 className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight">Ranking Global</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center rounded-full size-10 text-[#111318] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>filter_list</span>
                    </button>
                </div>
            </header>
            
            <main className="flex-1 flex flex-col px-4 gap-6 overflow-y-auto hide-scrollbar">
                <div className="mx-2 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl flex items-center relative">
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Equipos</button>
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm transition-all">Global</button>
                </div>
                
                 <div className="relative mx-2 p-6 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 overflow-hidden group">
                    <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/15 transition-all"></div>
                    <div className="absolute -left-10 -bottom-10 size-32 bg-accent-mint/20 rounded-full blur-2xl"></div>
                    <div className="relative flex flex-col items-center text-center z-10">
                        <div className="mb-3 relative">
                            <div className="size-20 bg-white rounded-full flex items-center justify-center shadow-md">
                                <span className="material-symbols-filled text-primary" style={{fontSize: '40px'}}>trending_up</span>
                            </div>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-primary shadow-sm flex items-center gap-1">
                                <span className="material-symbols-filled" style={{fontSize: '12px'}}>emoji_events</span>
                                #1 Lider
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">Ventas</h2>
                        <p className="text-blue-100 text-sm font-medium mb-4">Líderes indiscutibles esta semana</p>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 flex items-center gap-2">
                            <span className="material-symbols-filled text-accent-mint" style={{fontSize: '20px'}}>bolt</span>
                            <span className="text-lg font-extrabold text-white">15,400 pts</span>
                        </div>
                    </div>
                </div>
                
                 <div className="flex flex-col gap-3 px-2">
                    <div className="flex items-center justify-between px-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departamento</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Puntuación</span>
                    </div>
                     {[
                        {rank: '02', icon: 'campaign', bgIcon: 'bg-purple-50 dark:bg-purple-900/20', textIcon: 'text-purple-600 dark:text-purple-400', name: 'Marketing', desc: 'Creatividad al máximo', pts: '14,200', active: false},
                        {rank: '03', icon: 'terminal', bgIcon: 'bg-indigo-50 dark:bg-indigo-900/20', textIcon: 'text-indigo-600 dark:text-indigo-400', name: 'Tecnología', desc: 'Innovación continua', pts: '13,850', active: false},
                        {rank: '04', icon: 'groups', bgIcon: 'bg-blue-100 dark:bg-blue-800', textIcon: 'text-primary dark:text-blue-200', name: 'RRHH', desc: 'Cultura y gente', pts: '12,400', active: true},
                        {rank: '05', icon: 'attach_money', bgIcon: 'bg-emerald-50 dark:bg-emerald-900/20', textIcon: 'text-emerald-600 dark:text-emerald-400', name: 'Finanzas', desc: 'Precisión y datos', pts: '11,200', active: false},
                        {rank: '06', icon: 'support_agent', bgIcon: 'bg-orange-50 dark:bg-orange-900/20', textIcon: 'text-orange-600 dark:text-orange-400', name: 'Soporte', desc: 'Atención al cliente', pts: '9,850', active: false},
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm ${item.active ? 'bg-blue-50/60 dark:bg-primary/10 border-2 border-primary relative overflow-hidden' : 'bg-white dark:bg-[#1e293b] border border-transparent'}`}>
                            {item.active && <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-white text-[9px] font-bold rounded-bl-lg">TU EQUIPO</div>}
                            <span className={`text-lg font-bold w-6 text-center ${item.active ? 'text-primary' : 'text-slate-400'}`}>{item.rank}</span>
                            <div className={`size-10 rounded-full ${item.bgIcon} flex items-center justify-center ${item.textIcon} shrink-0`}>
                                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>{item.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{item.name}</h3>
                                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                            </div>
                            <span className={`font-bold ${item.active ? 'text-primary dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>{item.pts}</span>
                        </div>
                    ))}
                </div>
            </main>
            <MainNavigation />
         </div>
     );
}

export default RankingPage;