import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
    to: string;
    icon: string;
    label: string;
    isActive: boolean;
    filled?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive, filled }) => {
    const activeColor = "text-primary";
    const inactiveColor = "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";
    
    return (
        <Link to={to} className={`flex flex-col items-center justify-center gap-1 p-2 w-16 h-full transition-colors ${isActive ? activeColor : inactiveColor}`}>
            <span className={`material-symbols-outlined text-[24px] ${filled || isActive ? 'material-symbols-filled' : ''}`}>
                {icon}
            </span>
            <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
        </Link>
    );
};

const MainNavigation: React.FC = () => {
    const location = useLocation();
    
    return (
        <div className="fixed bottom-0 left-0 w-full bg-surface-light/90 dark:bg-surface-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-6 pt-2 z-50">
            <div className="flex justify-around items-center px-2">
                <NavLink to="/" icon="home" label="Inicio" isActive={location.pathname === '/'} />
                <NavLink to="/explore" icon="explore" label="Explorar" isActive={location.pathname === '/explore'} />
                
                <div className="relative -top-5">
                    <Link to="/services" className={`flex items-center justify-center size-14 rounded-full text-white shadow-lg transition-transform hover:scale-105 ${location.pathname === '/services' ? 'bg-[#111318] ring-4 ring-primary/20' : 'bg-primary shadow-blue-500/40'}`}>
                        <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                    </Link>
                </div>
                
                <NavLink to="/coaching" icon="school" label="Coaching" isActive={location.pathname === '/coaching'} />
                <NavLink to="/profile" icon="person" label="Perfil" isActive={location.pathname === '/profile'} />
            </div>
        </div>
    );
};

export default MainNavigation;