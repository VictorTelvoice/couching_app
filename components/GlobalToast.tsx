
import React, { useEffect, useRef } from 'react';
import { useUserStore } from '../store/useUserStore';

const GlobalToast: React.FC = () => {
    const { toast, hideToast } = useUserStore();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (toast.visible) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                hideToast();
            }, 3000);
        }
    }, [toast.visible, hideToast]);

    if (!toast.visible && !toast.message) return null;

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'info': return 'info';
            default: return 'check_circle';
        }
    };

    const getIconColor = () => {
        switch (toast.type) {
            case 'success': return 'text-green-400 dark:text-green-500';
            case 'error': return 'text-red-400 dark:text-red-500';
            case 'info': return 'text-primary';
            default: return 'text-green-400';
        }
    };

    return (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${toast.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 dark:border-gray-200">
                <span className={`material-symbols-filled ${getIconColor()}`}>{getIcon()}</span>
                <span className="text-sm font-bold whitespace-nowrap">{toast.message}</span>
            </div>
        </div>
    );
};

export default GlobalToast;
