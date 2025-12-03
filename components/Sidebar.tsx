import React from 'react';
import { Tv, Film, MonitorPlay, Settings, Home } from 'lucide-react';
import { ContentType } from '../types';

interface SidebarProps {
  activeTab: ContentType;
  setActiveTab: (tab: ContentType) => void;
  isSettingsOpen: boolean;
  onOpenSettings: () => void;
  onLogout: () => void;
  user?: { name: string; avatar: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSettingsOpen, onOpenSettings, onLogout, user }) => {
  const menuItems = [
    { id: ContentType.HOME, icon: Home, label: 'Home' },
    { id: ContentType.MOVIE, icon: Film, label: 'Filmes' },
    { id: ContentType.SERIES, icon: MonitorPlay, label: 'Séries' },
    { id: ContentType.LIVE, icon: Tv, label: 'TV ao Vivo' },
  ];

  return (
    <div className="w-16 lg:w-64 h-screen bg-black border-r border-gray-900 flex flex-col justify-between transition-all duration-300 z-50">
      <div>
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 mb-6">
          <div className="flex items-center gap-1">
             <div className="text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M5 3L19 12L5 21V3Z" />
               </svg>
             </div>
             <div className="hidden lg:flex font-bold text-2xl tracking-tight">
                <span className="text-white">Stream</span><span className="text-blue-600">ix</span>
             </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                  setActiveTab(item.id);
                  if(isSettingsOpen) {
                      // Optionally close settings if navigation occurs, though handled by overlay usually
                  }
              }}
              className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === item.id && !isSettingsOpen
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden lg:block ml-4 font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-3 mb-4">
        {user && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-4 mb-4 border-t border-gray-900">
                <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                <div className="text-left overflow-hidden">
                    <p className="text-white text-xs font-bold truncate">{user.name}</p>
                    <p className="text-gray-500 text-[10px]">Premium</p>
                </div>
            </div>
        )}

        <button
            onClick={onOpenSettings}
            className={`flex items-center w-full px-3 py-3 rounded-lg mb-2 transition-all ${
                isSettingsOpen 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
        >
          <Settings size={20} />
          <span className="hidden lg:block ml-4 font-medium text-sm">Configurações</span>
        </button>
      </div>
    </div>
  );
};