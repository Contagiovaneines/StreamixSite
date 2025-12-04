
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { NotificationItem } from '../types';

interface NotificationsOverlayProps {
  onClose: () => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setNotifications(mockApi.getNotifications());
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 pt-8 md:pt-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Notificações</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
           <div className="space-y-1">
             {notifications.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer group relative">
                    {/* Unread Indicator */}
                    {!item.read && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    )}
                    
                    <div className="w-24 h-16 shrink-0 rounded overflow-hidden relative border border-gray-800">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        {/* Type Icon overlay could go here */}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-gray-200 mb-0.5 group-hover:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{item.subtitle}</p>
                    </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
