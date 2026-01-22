import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';

const CertificatePage: React.FC = () => {
     const navigate = useNavigate();
     return (
         <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
             <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 -ml-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
                </button>
                <h1 className="text-slate-900 dark:text-white text-lg font-extrabold leading-tight">Certificado</h1>
                <button className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:text-primary transition-colors">
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>share</span>
                </button>
            </header>
            
            <main className="flex-1 flex flex-col px-6 gap-6 overflow-y-auto hide-scrollbar">
                <div className="text-center mt-2">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                        <span className="material-symbols-filled text-green-600 dark:text-green-400" style={{fontSize: '32px'}}>check_circle</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">¡Felicitaciones, Ana!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">Has completado con éxito el programa. Aquí tienes tu certificado oficial.</p>
                </div>

                 <div className="relative w-full aspect-[4/3] bg-white dark:bg-[#1e293b] rounded-xl certificate-border p-6 flex flex-col items-center justify-between text-center overflow-hidden">
                    <div className="absolute inset-0 bg-certificate-pattern opacity-50 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-primary/20 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-primary/20 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-primary/20 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-primary/20 rounded-br-xl"></div>
                    
                    <div className="flex items-center gap-2 mb-2 z-10">
                        <div className="size-8 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">GL</div>
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">GrowthLab</span>
                    </div>
                    <div className="flex flex-col gap-1 z-10 w-full">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Certificado de Finalización</span>
                        <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-1">Ana García</h3>
                        <div className="w-full h-px bg-slate-200 dark:bg-slate-700 max-w-[120px] mx-auto my-1"></div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">ha completado satisfactoriamente el curso</p>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2 mx-auto max-w-[200px] leading-tight">Tácticas Avanzadas de Negociación</h4>
                    </div>
                     <div className="flex justify-between w-full items-end mt-2 z-10 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="text-left">
                            <p className="text-[8px] text-slate-400 uppercase tracking-wide">Fecha</p>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300">24 Oct, 2023</p>
                        </div>
                        <div className="size-10 relative">
                            <span className="material-symbols-filled text-accent-gold/80 absolute inset-0 m-auto" style={{fontSize: '32px'}}>verified</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] text-slate-400 uppercase tracking-wide">ID Credencial</p>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300">GL-8842-XJ</p>
                        </div>
                    </div>
                </div>
                
                 <button className="w-full bg-linkedin hover:bg-linkedin-dark active:scale-[0.98] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-linkedin/20 flex items-center justify-center gap-3 transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                    Compartir en LinkedIn
                </button>
                
                 <div className="flex flex-col gap-3">
                    <button className="w-full bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>download</span>
                        Descargar PDF
                    </button>
                    <button className="w-full text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white font-semibold py-2 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                        Ver detalles del programa
                    </button>
                </div>
            </main>
            <MainNavigation />
         </div>
     );
}

export default CertificatePage;