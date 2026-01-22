import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

const ServicesHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, badges } = useUserStore();
    const [activeTab, setActiveTab] = useState<'mentorships' | 'certificates'>('certificates');
    const [showDetails, setShowDetails] = useState(false);

    // Subscription Data
    const subscription = {
        plan: "Plan Profesional",
        status: "Activo",
        renewal: "Renueva el 12 Nov, 2024",
        price: "$29.99/mes",
        cardLast4: "4242",
        cardBrand: "Visa",
        memberSince: "20 Ene, 2023",
        nextBilling: "$29.99"
    };

    // Stats Logic
    const stats = {
        sessionsCompleted: 3,
        sessionsTotal: 12,
        certsEarned: 1,
        certsTotal: 4,
        badgesEarned: badges.filter(b => b.earned).length
    };

    // Updated Data Concept: Mentorships instead of Courses
    const mySessions = [
        // Completed
        {
            id: 1,
            title: "Masterclass: Liderazgo Ágil",
            progress: 100,
            type: "recorded",
            duration: "1h 20m",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Taller: Seguridad de Datos",
            progress: 100,
            type: "live",
            duration: "2h 00m",
            image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        // In Progress / To Start
        { 
            id: 4, 
            title: "Inteligencia Emocional Q&A", 
            progress: 75, 
            type: "recorded",
            duration: "45m",
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        },
        { 
            id: 5, 
            title: "Estrategias de Negociación", 
            progress: 45, 
            type: "live", // Recorded replay of a live session
            duration: "1h 30m",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        },
        { 
            id: 6, 
            title: "Gestión del Tiempo para Managers", 
            progress: 10, 
            type: "recorded",
            duration: "55m",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        },
    ];

    const certificates = [
        {
            id: 101,
            title: "Liderazgo Ágil y Gestión",
            date: "10 Oct, 2023",
            id_code: "GL-8842-XJ",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    const billingOptions = [
        { icon: 'credit_card', title: 'Métodos de Pago', subtitle: `Visa terminada en ${subscription.cardLast4}` },
        { icon: 'receipt_long', title: 'Historial de Facturación', subtitle: 'Ver facturas y recibos' },
        { icon: 'description', title: 'Datos de Facturación', subtitle: 'RFC y Dirección Fiscal' }
    ];

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <h1 className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight">Suscripción</h1>
                <div className="size-9 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-gray-500">settings</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col gap-6 px-6 overflow-y-auto hide-scrollbar pt-2">
                
                {/* 1. New Premium Membership Card */}
                <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/20 group transition-transform hover:scale-[1.01] bg-[#0f172a] text-white">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/30 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="relative z-10 p-7 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan Actual</span>
                                <h2 className="text-2xl font-display font-bold text-white tracking-wide">{subscription.plan}</h2>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-white uppercase tracking-wide">{subscription.status}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <div className="flex -space-x-3">
                                <div className="size-8 rounded-full border-2 border-[#0f172a] bg-gray-200 bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=11")'}}></div>
                                <div className="size-8 rounded-full border-2 border-[#0f172a] bg-gray-200 bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=33")'}}></div>
                                <div className="size-8 rounded-full border-2 border-[#0f172a] bg-gray-200 bg-cover" style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=12")'}}></div>
                            </div>
                            <span className="text-xs text-slate-300 font-medium">Acceso ilimitado a +50 mentores</span>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Próxima Facturación</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-white">{subscription.nextBilling}</span>
                                    <span className="text-xs text-slate-400">/mes</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">{subscription.renewal}</p>
                            </div>
                            <button className="px-4 py-2 bg-white text-[#0f172a] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                                Gestionar
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Expandable Account Details */}
                <div className="flex flex-col -mt-2">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`flex items-center justify-between w-full px-5 py-3.5 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-sm transition-all ${showDetails ? 'rounded-t-2xl border-b-transparent' : 'rounded-2xl'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">info</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Detalles de la cuenta</span>
                        </div>
                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>

                    {showDetails && (
                        <div className="bg-white dark:bg-surface-dark rounded-b-2xl p-5 border border-t-0 border-gray-100 dark:border-gray-700 shadow-sm animate-in slide-in-from-top-2 z-0">
                             <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800 border-dashed">
                                    <span className="text-xs text-gray-500">Miembro desde</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{subscription.memberSince}</span>
                                </div>
                                 <div className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-800 border-dashed">
                                    <span className="text-xs text-gray-500">Método de pago</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">{subscription.cardBrand}</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">•••• {subscription.cardLast4}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs text-gray-500">Estado de cuenta</span>
                                     <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Al día</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Stats Grid (Updated for Mentorships) */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Mentorías */}
                    <div onClick={() => setActiveTab('mentorships')} className={`flex flex-col items-center p-3 rounded-2xl border cursor-pointer transition-all ${activeTab === 'mentorships' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700'}`}>
                        <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200 flex items-center justify-center mb-2">
                            <span className="material-symbols-filled text-[18px]">play_circle</span>
                        </div>
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mb-0.5">{stats.sessionsCompleted} <span className="text-sm text-gray-400 font-medium">/ {stats.sessionsTotal}</span></span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Mentorías</span>
                    </div>

                    {/* Certificados */}
                    <div onClick={() => setActiveTab('certificates')} className={`flex flex-col items-center p-3 rounded-2xl border cursor-pointer transition-all ${activeTab === 'certificates' ? 'bg-blue-50 dark:bg-blue-900/20 border-primary' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700'}`}>
                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-primary dark:text-blue-400 flex items-center justify-center mb-2">
                            <span className="material-symbols-filled text-[18px]">workspace_premium</span>
                        </div>
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mb-0.5">{stats.certsEarned} <span className="text-sm text-gray-400 font-medium">/ {stats.certsTotal}</span></span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Certificados</span>
                    </div>

                    {/* Insignias */}
                    <div onClick={() => navigate('/badges')} className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                            <span className="material-symbols-filled text-[18px]">military_tech</span>
                        </div>
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mb-0.5">{stats.badgesEarned}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Insignias</span>
                    </div>
                </div>

                {/* 4. Content List (Tabs) */}
                <div className="flex flex-col gap-4 pb-4">
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">
                            {activeTab === 'mentorships' ? 'Mis Mentorías (Grabadas y En Vivo)' : 'Certificados Obtenidos'}
                        </h3>
                        {activeTab === 'mentorships' && <span className="text-xs font-bold text-primary cursor-pointer hover:underline">Ver catálogo</span>}
                    </div>

                    {activeTab === 'mentorships' && (
                        <div className="flex flex-col gap-3">
                            {mySessions.map(session => {
                                const isCompleted = session.progress === 100;
                                const isLive = session.type === 'live';
                                return (
                                    <div 
                                        key={session.id} 
                                        onClick={() => navigate('/course-detail')} 
                                        className={`
                                            group flex gap-3 p-3 rounded-2xl border shadow-sm cursor-pointer transition-all
                                            ${isCompleted 
                                                ? 'bg-white dark:bg-surface-dark border-green-100 dark:border-green-900/30' 
                                                : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-900'
                                            }
                                        `}
                                    >
                                        <div 
                                            className={`w-20 h-20 rounded-xl bg-cover bg-center shrink-0 relative overflow-hidden transition-all ${!isCompleted ? 'grayscale-[0.3]' : ''}`} 
                                            style={{backgroundImage: `url("${session.image}")`}}
                                        >
                                            {/* Type Badge */}
                                            <div className={`absolute top-0 left-0 px-1.5 py-0.5 rounded-br-lg text-[8px] font-bold text-white uppercase tracking-wide ${isLive ? 'bg-red-500' : 'bg-indigo-500'}`}>
                                                {isLive ? 'En Vivo' : 'Grabada'}
                                            </div>

                                            {isCompleted && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-[1px]">
                                                    <span className="material-symbols-filled text-white drop-shadow-md text-[24px]">check_circle</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center min-w-0">
                                            <h3 className={`text-sm font-bold leading-tight mb-1 truncate ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {session.title}
                                            </h3>
                                            
                                            <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-500">
                                                <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">schedule</span> {session.duration}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`} 
                                                        style={{width: `${session.progress}%`}}
                                                    ></div>
                                                </div>
                                                <span className={`text-[9px] font-bold ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-indigo-500'}`}>
                                                    {session.progress}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'certificates' && (
                         <div className="flex flex-col gap-3">
                            {certificates.map(cert => (
                                <div key={cert.id} onClick={() => navigate('/certificate')} className="flex gap-3 p-3 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-[2rem]"></div>
                                    
                                    <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-primary border border-blue-100 dark:border-blue-800">
                                        <span className="material-symbols-filled">verified</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">{cert.title}</h3>
                                        <p className="text-[10px] text-gray-400 mb-1">Completado: {cert.date}</p>
                                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-mono text-gray-500">
                                            <span>ID: {cert.id_code}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-300 group-hover:text-primary transition-colors">
                                         <span className="material-symbols-outlined">chevron_right</span>
                                    </div>
                                </div>
                            ))}
                            {/* Placeholder for 1 of 4 logic */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-surface-dark/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 opacity-60">
                                    <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-gray-400">
                                        <span className="material-symbols-outlined">lock</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-xs font-bold text-gray-400 leading-tight mb-1">Certificado Bloqueado</h3>
                                        <p className="text-[10px] text-gray-400">Completa la ruta para desbloquear</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    )}
                </div>

                {/* 5. Billing & Admin Actions */}
                <div className="mt-2 mb-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {billingOptions.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                                <span className="material-symbols-outlined">{option.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{option.title}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">{option.subtitle}</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
                        </div>
                    ))}
                </div>

            </main>
            <MainNavigation />
        </div>
    );
};

export default ServicesHubPage;