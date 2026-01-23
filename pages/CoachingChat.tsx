
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
            text: `¡Hola ${profile.name.split(' ')[0]}! Soy David, tu AI Coach. He visto que estás progresando en tus cursos. ¿En qué puedo ayudarte hoy?`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Inicializar Gemini Chat
    const chatRef = useRef<any>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `Eres David Mendoza, un experto Tech Lead Mentor y Leadership Coach en GrowthLab. 
                Tu objetivo es ayudar a los usuarios (como ${profile.name}) a dominar sus habilidades profesionales. 
                Sé conciso, profesional, empático y usa un lenguaje motivador. 
                Si el usuario tiene dudas técnicas o de liderazgo, explícalas de forma sencilla. 
                Fomenta el pensamiento crítico haciendo preguntas ocasionales sobre cómo aplicarán lo aprendido.`,
            },
        });
    }, [profile.name]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const aiMessageId = (Date.now() + 1).toString();
            // Crear el mensaje vacío de la IA para ir rellenándolo
            setMessages(prev => [...prev, {
                id: aiMessageId,
                text: '',
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);

            const responseStream = await chatRef.current.sendMessageStream({ message: inputValue });
            
            let fullText = '';
            for await (const chunk of responseStream) {
                const textChunk = chunk.text;
                fullText += textChunk;
                
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: fullText } : msg
                ));
            }
        } catch (error) {
            console.error("Error calling Gemini:", error);
            setMessages(prev => [...prev, {
                id: 'error',
                text: 'Lo siento, he tenido un problema de conexión. ¿Podrías repetir eso?',
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-1">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                             <div className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw")'}}></div>
                             <div className="absolute bottom-0 right-0 size-2.5 bg-secondary rounded-full border-2 border-white dark:border-background-dark"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">David Mendoza</h1>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{isTyping ? 'Escribiendo...' : 'En línea'}</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-primary">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
            
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 flex flex-col gap-6 px-4 py-6 overflow-y-auto scroll-smooth">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                    >
                        {msg.sender === 'ai' && (
                            <div className="size-8 rounded-full bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-800" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw")'}}></div>
                        )}
                        <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3.5 rounded-2xl shadow-sm border ${
                                msg.sender === 'user' 
                                ? 'bg-primary border-primary text-white rounded-tr-sm' 
                                : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text || (isTyping && msg.id === messages[messages.length-1].id ? '...' : '')}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 px-1">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                {isTyping && messages[messages.length-1].sender === 'user' && (
                    <div className="flex gap-3 max-w-[90%] self-start animate-pulse">
                        <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm">
                            <div className="flex gap-1">
                                <div className="size-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 px-4 py-3 pb-6 shadow-sm">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 transition-colors">
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-2 gap-2 min-h-[44px] transition-all focus-within:ring-2 focus-within:ring-primary/30">
                        <input 
                            className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 outline-none" 
                            placeholder="Haz una pregunta sobre tu carrera..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                    </div>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className={`size-11 rounded-full flex items-center justify-center shadow-lg transition-all shrink-0 mb-px ${
                            inputValue.trim() && !isTyping 
                            ? 'bg-primary text-white scale-100' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 scale-90'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px] font-bold">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoachingChatPage;
