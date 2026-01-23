import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoachingChatPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            <div className="sticky top-0 z-20 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-1">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                             <div className="size-10 rounded-full bg-cover bg-center border border-gray-200" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw")'}}></div>
                             <div className="absolute bottom-0 right-0 size-2.5 bg-secondary rounded-full border-2 border-white dark:border-background-dark"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">David Mendoza</h1>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">En línea</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-primary">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-6 px-4 py-6 overflow-y-auto">
                <div className="flex gap-3 max-w-[90%] self-start group">
                    <div className="size-8 rounded-full bg-cover bg-center shrink-0" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGRnLb1LItRXLkgTOx1poVL_HU7gtFspSF6bPtFUkwntQXegq2nLJNyf_g5y8hEK3e2FZhZSIj9y54erG1aH19TI4q4sESVsGgTFcyOYQulqtVH4cQc5-pviGDHHc76kuLe3rfsNREErvdfaOunsFEMX_a-ZpBJNcMlFXRdV20FnU-iLuKZr07esXkcyDZ8SIZOKzZQ-obZlMgA1myBtmvwv4CT8vmDFscmSabNsL6yUJidP8zejUXokIcXUfqnrHUEYNy6umuC6A")'}}></div>
                    <div className="flex flex-col gap-1">
                        <div className="bg-white dark:bg-surface-dark p-3.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">¡Hola Alex! Noté que completaste el micro-curso de <strong>Liderazgo Ágil</strong>.</p>
                        </div>
                        <span className="text-[10px] text-gray-400 ml-1">10:30 AM</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                    <div className="bg-primary p-3.5 rounded-2xl rounded-br-sm shadow-md text-white">
                        <p className="text-sm leading-relaxed">Gracias David. Justo tengo una duda sobre la aplicación del módulo 2 en mi equipo actual.</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mr-1">10:32 AM</span>
                </div>
                 <div className="flex gap-3 max-w-[90%] self-start group">
                    <div className="size-8 rounded-full bg-cover bg-center shrink-0" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGRnLb1LItRXLkgTOx1poVL_HU7gtFspSF6bPtFUkwntQXegq2nLJNyf_g5y8hEK3e2FZhZSIj9y54erG1aH19TI4q4sESVsGgTFcyOYQulqtVH4cQc5-pviGDHHc76kuLe3rfsNREErvdfaOunsFEMX_a-ZpBJNcMlFXRdV20FnU-iLuKZr07esXkcyDZ8SIZOKzZQ-obZlMgA1myBtmvwv4CT8vmDFscmSabNsL6yUJidP8zejUXokIcXUfqnrHUEYNy6umuC6A")'}}></div>
                    <div className="flex flex-col gap-1">
                        <div className="bg-white dark:bg-surface-dark p-3.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 cursor-pointer hover:underline">
                                <span className="material-symbols-outlined text-[16px]">mic</span> Nota de voz (0:45)
                             </div>
                            <div className="h-1 bg-gray-100 dark:bg-gray-600 rounded-full w-32 overflow-hidden">
                                <div className="h-full bg-primary w-1/3"></div>
                            </div>
                        </div>
                         <span className="text-[10px] text-gray-400 ml-1">10:35 AM</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 px-4 py-3 pb-4 shadow-sm backdrop-blur-md">
                <div className="flex items-end gap-3">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2">
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-2 gap-2 min-h-[44px]">
                        <input className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 outline-none" placeholder="Escribe un mensaje..." />
                    </div>
                    <button className="bg-primary text-white size-11 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors shrink-0 mb-px">
                        <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoachingChatPage;