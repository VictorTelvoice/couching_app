
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Notification } from '../store/useUserStore';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useUserStore();
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

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
        // 1. Mark as read
        if (!notification.read) {
            markNotificationAsRead(notification.id);
        }
        // 2. Open details modal
        setSelectedNotification(notification);
    };

    const handleActionClick = () => {
        if (selectedNotification?.link) {
            const link = selectedNotification.link;
            setSelectedNotification(null);
            navigate(link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return { icon: 'schedule', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/30' };
            case 'success': return { icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30' };
            case 'message': return { icon: 'forum', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' };
            default: return { icon: 'info', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' };
        }
    };

    const renderNotificationGroup = (title: string, items: Notification[]) => {
        if (items.length === 0) return null;
        return (
            <div className="flex flex-col gap-3 animate-fadeIn">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{title}</h3>
                {items.map(note => {
                    const style = getIcon(note.type);
                    return (
                        <div 
                            key={note.id} 
                            onClick={() => handleNotificationClick(note)}
                            className={`
                                relative p-4 rounded-xl shadow-sm border flex gap-4 cursor-pointer transition-all active:scale-[0.98]
                                ${note.read 
                                    ? 'bg-white/60 dark:bg-surface-dark/60 border-gray-100 dark:border-gray-800' 
                                    : 'bg-white dark:bg-surface-dark border-primary/20 ring-1 ring-primary/5 shadow-md'
                                }
                            `}
                        >
                            <div className={`size-12 rounded-full ${style.bg} flex items-center justify-center ${style.color} shrink-0`}>
                                <span className="material-symbols-outlined">{style.icon}</span>
                            </div>
                            <div className="flex flex-col gap-1 pr-6 flex-1">
                                <h4 className={`text-sm ${note.read ? 'font-semibold text-gray-700 dark:text-gray-300' : 'font-bold text-gray-900 dark:text-white'}`}>
                                    {note.title}
                                </h4>
                                <p className={`text-xs leading-snug line-clamp-2 ${note.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {note.message}
                                </p>
                            </div>
                            {!note.read && (
                                <div className="absolute top-4 right-4 size-2.5 rounded-full bg-red-500 shadow-sm animate-pulse"></div>
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
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
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

            <main className="flex-1 flex flex-col gap-6 px-6 py-4 overflow-y-auto hide-scrollbar">
                {notifications.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 opacity-60">
                        <span className="material-symbols-outlined text-[64px] text-gray-300 mb-4">notifications_off</span>
                        <h3 className="text-lg font-bold text-gray-500">Sin notificaciones</h3>
                        <p className="text-sm text-gray-400 text-center">Te avisaremos cuando haya novedades importantes.</p>
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
            {selectedNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col border border-white/20">
                        <button 
                            onClick={() => setSelectedNotification(null)} 
                            className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>close</span>
                        </button>
                        
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className={`size-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${getIcon(selectedNotification.type).bg} ${getIcon(selectedNotification.type).color}`}>
                                <span className="material-symbols-outlined" style={{fontSize: '40px'}}>{getIcon(selectedNotification.type).icon}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                                {new Date(selectedNotification.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                                {selectedNotification.title}
                            </h2>
                            <div className="w-full bg-gray-50 dark:bg-black/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed text-left font-medium">
                                    {selectedNotification.message}
                                </p>
                            </div>
                        </div>

                        {selectedNotification.link ? (
                            <button 
                                onClick={handleActionClick}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                Ver detalle
                            </button>
                        ) : (
                            <button 
                                onClick={() => setSelectedNotification(null)}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all active:scale-95"
                            >
                                Entendido
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
