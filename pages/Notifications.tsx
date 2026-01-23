
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore, Notification } from '../store/useUserStore';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useUserStore();

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
        // Fix: Use new Date() to safely call getTime() on string | Date types
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
        // 2. Perform action/navigation if link exists
        if (notification.link) {
            navigate(notification.link);
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
                                <p className={`text-sm leading-snug ${note.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {note.message}
                                </p>
                                {!note.read && (
                                    <span className="text-[10px] text-primary font-bold mt-1">Pulsa para ver detalles</span>
                                )}
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
            <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
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

            <main className="flex-1 flex flex-col gap-6 px-6 py-2 overflow-y-auto hide-scrollbar">
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
        </div>
    );
};

export default NotificationsPage;
