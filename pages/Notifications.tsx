
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Notification } from '../store/useUserStore';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useUserStore();
    const [selectedNote, setSelectedNote] = useState<Notification | null>(null);

    // Helper to group notifications
    const groupedNotifications = useMemo(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const groups: { today: Notification[], yesterday: Notification[], older: Notification[] } = {
            today: [],
            yesterday: [],
            older: []
        };

        notifications.forEach(note => {
            const noteDate = new Date(note.date);
            if (noteDate.toDateString() === today.toDateString()) {
                groups.today.push(note);
            } else if (noteDate.toDateString() === yesterday.toDateString()) {
                groups.yesterday.push(note);
            } else {
                groups.older.push(note);
            }
        });

        // Sort each group by date desc
        groups.today.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        groups.yesterday.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        groups.older.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return groups;
    }, [notifications]);

    const handleNotificationClick = (notification: Notification) => {
        // 1. Mark as read in store
        if (!notification.read) {
            markNotificationAsRead(notification.id);
        }
        // 2. Open Detail Modal
        setSelectedNote(notification);
    };

    const getIconStyle = (type: string) => {
        switch (type) {
            case 'alert': return { icon: 'schedule', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' };
            case 'success': return { icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' };
            case 'message': return { icon: 'forum', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' };
            case 'info': return { icon: 'info', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
            default: return { icon: 'notifications', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' };
        }
    };

    const renderNotificationGroup = (title: string, items: Notification[]) => {
        if (items.length === 0) return null;
        return (
            <div className="flex flex-col gap-3 animate-fadeIn mb-6">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">{title}</h3>
                {items.map(note => {
                    const style = getIconStyle(note.type);
                    return (
                        <div 
                            key={note.id} 
                            onClick={() => handleNotificationClick(note)}
                            className={`
                                relative p-4 rounded-2xl border flex gap-4 cursor-pointer transition-all active:scale-[0.98]
                                ${note.read 
                                    ? 'bg-white/60 dark:bg-surface-dark/40 border-gray-100 dark:border-gray-800 shadow-sm' 
                                    : 'bg-white dark:bg-surface-dark border-primary/20 ring-1 ring-primary/5 shadow-md'
                                }
                            `}
                        >
                            <div className={`size-11 rounded-full ${style.bg} flex items-center justify-center ${style.color} shrink-0 shadow-sm`}>
                                <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 pr-4 flex-1">
                                <h4 className={`text-sm leading-tight ${note.read ? 'font-semibold text-gray-700 dark:text-gray-300' : 'font-bold text-gray-900 dark:text-white'}`}>
                                    {note.title}
                                </h4>
                                <p className={`text-xs line-clamp-1 mt-0.5 ${note.read ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {note.message}
                                </p>
                            </div>
                            {!note.read && (
                                <div className="absolute top-4 right-4 size-2 rounded-full bg-primary shadow-sm animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const hasUnread = notifications.some(n => !n.read);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Notificaciones</h1>
                </div>
                {hasUnread && (
                    <button 
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                    >
                        Marcar leídas
                    </button>
                )}
            </header>

            <main className="flex-1 flex flex-col px-6 py-6 overflow-y-auto hide-scrollbar">
                {notifications.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-24 opacity-60">
                        <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[40px] text-gray-300">notifications_off</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-500 dark:text-gray-400">Sin notificaciones</h3>
                        <p className="text-xs text-gray-400 text-center mt-1">Te avisaremos cuando haya novedades importantes.</p>
                    </div>
                ) : (
                    <>
                        {renderNotificationGroup("Hoy", groupedNotifications.today)}
                        {renderNotificationGroup("Ayer", groupedNotifications.yesterday)}
                        {renderNotificationGroup("Anteriores", groupedNotifications.older)}
                    </>
                )}
            </main>
            <MainNavigation />

            {/* Modal de Detalle de Notificación */}
            {selectedNote && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-7 shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col">
                        <button 
                            onClick={() => setSelectedNote(null)} 
                            className="absolute top-5 right-5 size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`size-14 rounded-2xl ${getIconStyle(selectedNote.type).bg} ${getIconStyle(selectedNote.type).color} flex items-center justify-center shadow-sm`}>
                                <span className="material-symbols-outlined text-[32px]">{getIconStyle(selectedNote.type).icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                    {new Date(selectedNote.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedNote.title}</h3>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 mb-6">
                            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                                {selectedNote.message}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {selectedNote.link && (
                                <button 
                                    onClick={() => {
                                        navigate(selectedNote.link!);
                                        setSelectedNote(null);
                                    }}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-dark transition-all"
                                >
                                    <span>Ver más detalles</span>
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            )}
                            <button 
                                onClick={() => setSelectedNote(null)}
                                className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
