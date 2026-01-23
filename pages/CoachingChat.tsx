
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { useUserStore } from '../store/useUserStore';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

const CoachingChatPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useUserStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `¡Hola ${profile.name.split(' ')[0]}! Soy David, tu AI Coach en GrowthLab. He estado siguiendo tu progreso y estoy aquí para ayudarte a escalar tus habilidades. ¿Qué tienes en mente hoy?`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<any>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                // Fix: Access process.env.API_KEY directly as per Gemini API guidelines
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                chatSessionRef.current = ai.chats.create({
                    model: 'gemini-3-flash-preview',
                    config: {
                        systemInstruction: `Eres David Mendoza, Coach de Liderazgo y Mentor Técnico Senior en GrowthLab. 
                        Tu estilo es directo, inspirador y basado en datos. Ayudas al usuario (${profile.name}) a mejorar en áreas como gestión de equipos, arquitectura de software y desarrollo de carrera.
                        Responde siempre en español. Sé conciso pero profundo. Usa formato Markdown para listas o puntos clave si es necesario.`,
                    },
                });
            } catch (error) {
                console.error("Failed to init AI:", error);
            }
        };

        if (!chatSessionRef.current) {
            initChat();
        }
    }, [profile.name]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        const text = inputValue.trim();
        if (!text || isTyping) return;

        if (!chatSessionRef.current) {
             setMessages(prev => [...prev, {
                id: 'err-init',
                text: "El servicio de IA no está disponible en este momento. Por favor verifica tu clave de API.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const aiMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai', timestamp: '' }]);

            // Fix: Use the correct response text property for streaming content
            const responseStream = await chatSessionRef.current.sendMessageStream({ message: text });
            
            let fullText = '';
            for await (const chunk of responseStream) {
                fullText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: fullText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : msg
                ));
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: 'err-' + Date.now(),
                text: "Lo siento, tuve un problema al procesar esa solicitud. ¿Podrías intentar de nuevo?",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display">
            <div className="sticky top-0 z-20 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                             <div className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw")'}}></div>
                             <div className="absolute bottom-0 right-0 size-2.5 bg-secondary rounded-full border-2 border-white dark:border-background-dark"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">David Mendoza</h1>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{isTyping ? 'Escribiendo...' : 'AI Coach activo'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 flex flex-col gap-6 px-4 py-6 overflow-y-auto bg-slate-50/30 dark:bg-transparent hide-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="size-8 rounded-full bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-800" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw")'}}></div>
                        )}
                        <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3.5 rounded-2xl shadow-sm border ${msg.sender === 'user' ? 'bg-primary border-primary text-white rounded-tr-sm' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text || '...'}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium px-1">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 px-4 py-3 pb-8">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-1.5 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                        <textarea 
                            rows={1}
                            className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 outline-none resize-none py-2" 
                            placeholder="Pregunta sobre liderazgo o tech..." 
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className={`size-11 rounded-full flex items-center justify-center shadow-lg transition-all ${inputValue.trim() && !isTyping ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoachingChatPage;
