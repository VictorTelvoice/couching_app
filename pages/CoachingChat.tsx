
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

const CoachingChatPage: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy David Mendoza, tu mentor de GrowthLab. He visto que estás progresando muy bien. ¿En qué puedo ayudarte hoy con tu liderazgo o crecimiento técnico?',
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);

    // Inicializar el chat de Gemini
    useEffect(() => {
        const initChat = async () => {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `Eres David Mendoza, Tech Lead Mentor en GrowthLab. 
                    Tu objetivo es ayudar a los empleados a crecer profesionalmente. 
                    Eres experto en Liderazgo, Arquitectura de Software, Estrategia Corporativa y Soft Skills.
                    Tu tono es profesional, alentador y conciso. 
                    Si te preguntan sobre cursos, diles que puedes guiarles en temas de Negociación, Seguridad de Datos o Liderazgo Ágil.
                    Responde siempre en español.`,
                },
            });
        };
        initChat();
    }, []);

    // Auto-scroll al final
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!input.trim() || isTyping || !chatRef.current) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await chatRef.current.sendMessage({ message: input });
            const aiText = response.text || "Lo siento, tuve un pequeño problema procesando eso. ¿Podrías repetirlo?";
            
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Ups, parece que perdí la conexión un momento. ¿Podemos intentar de nuevo?",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Header */}
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
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">IA Mentor • Online</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-primary">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 flex flex-col gap-4 px-4 py-6 overflow-y-auto hide-scrollbar bg-slate-50/30 dark:bg-transparent">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                    >
                        {msg.sender === 'ai' && (
                            <div className="size-8 rounded-full bg-cover bg-center shrink-0 border border-white dark:border-gray-800 shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw")'}}></div>
                        )}
                        <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3.5 rounded-2xl shadow-sm ${
                                msg.sender === 'user' 
                                ? 'bg-primary text-white rounded-tr-sm' 
                                : 'bg-white dark:bg-surface-dark text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3 self-start items-center animate-pulse">
                        <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
                        <div className="bg-white dark:bg-surface-dark px-4 py-2.5 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700 flex gap-1">
                            <div className="size-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                            <div className="size-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="size-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 px-4 py-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <button className="text-gray-400 hover:text-primary p-2 transition-colors">
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-[1.5rem] flex items-center px-4 py-1.5 gap-2 min-h-[48px] border border-transparent focus-within:border-primary/20 focus-within:bg-white dark:focus-within:bg-surface-dark transition-all">
                        <textarea 
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 outline-none resize-none py-2" 
                            placeholder="Pregunta algo sobre tu carrera..." 
                        />
                    </div>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isTyping}
                        className={`size-12 rounded-full flex items-center justify-center shadow-lg transition-all shrink-0 mb-px ${
                            input.trim() && !isTyping 
                            ? 'bg-primary text-white scale-100 shadow-primary/30' 
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 scale-95 shadow-none'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-2">IA Coach puede cometer errores. Verifica la información importante.</p>
            </div>
        </div>
    );
};

export default CoachingChatPage;
