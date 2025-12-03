import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, LogOut, Trash2, Smartphone, Bell, Shield, Eye, EyeOff } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onLogout }) => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [activeTab, setActiveTab] = useState('conta');

  const tabs = [
      { id: 'conta', label: 'Conta', icon: User },
      { id: 'preferencias', label: 'Preferências', icon: Smartphone },
      { id: 'notificacoes', label: 'Notificações', icon: Bell },
      { id: 'parental', label: 'Controle Parental', icon: Shield },
      { id: 'privacidade', label: 'Privacidade', icon: Eye },
  ];

  return (
    <div className="h-full w-full bg-black text-white p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-2">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Voltar</span>
            </button>
            <div className="flex items-center gap-1 ml-4">
                 <div className="text-blue-600">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M5 3L19 12L5 21V3Z" />
                   </svg>
                 </div>
                 <div className="font-bold text-xl tracking-tight">
                    <span className="text-white">Stream</span><span className="text-blue-600">ix</span> <span className="text-gray-400 mx-2">/</span> <span className="text-white">Configurações</span>
                 </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-8 bg-[#121212] p-1 rounded-xl w-fit border border-gray-900">
            {tabs.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-[#1a1a1a] text-white border border-gray-800' 
                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {activeTab === 'conta' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-6">Profile Information</h2>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <img src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" className="w-16 h-16 rounded-full" alt="Profile" />
                            <div>
                                <button className="text-sm font-medium hover:text-blue-500 transition-colors">Change Photo</button>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                                <input type="text" defaultValue="João Silva" className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none transition-colors text-gray-200" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                                <input type="email" defaultValue="joao@example.com" className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none transition-colors text-gray-200" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                            <input type="tel" defaultValue="+55 11 99999-9999" className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none transition-colors text-gray-200" />
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-6">Change Password</h2>
                        
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
                            <div className="relative">
                                <input 
                                    type={showCurrentPass ? "text" : "password"} 
                                    className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none transition-colors text-gray-200" 
                                    defaultValue="password123"
                                />
                                <button 
                                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                                <div className="relative">
                                    <input 
                                        type={showNewPass ? "text" : "password"} 
                                        className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none transition-colors text-gray-200" 
                                    />
                                    <button 
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPass ? "text" : "password"} 
                                        className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none transition-colors text-gray-200" 
                                    />
                                    <button 
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="bg-[#1a365d] text-blue-100 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Subscription */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-4">Subscription</h2>
                        
                        <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-500 text-xs font-bold rounded-full mb-4">
                            Premium
                        </span>

                        <p className="text-sm text-gray-300 mb-4">Unlimited streaming in 4K</p>
                        <p className="text-sm text-gray-300 mb-1">Next billing: January 15, 2025</p>
                        <p className="text-lg font-bold text-white mb-6">$12.99/month</p>

                        <button className="w-full border border-gray-700 hover:border-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <CreditCard size={16} /> Manage Billing
                        </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-6 text-red-500">Danger Zone</h2>
                        
                        <button onClick={onLogout} className="w-full flex items-center gap-3 text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg transition-colors mb-2">
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>

                        <button className="w-full flex items-center gap-3 text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg transition-colors">
                            <Trash2 size={18} />
                            <span className="text-sm font-medium">Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-[#0a0a0a] border border-gray-800 rounded-2xl animate-in fade-in zoom-in duration-300">
                <div className="bg-[#121212] p-4 rounded-full mb-4">
                    {tabs.find(t => t.id === activeTab)?.icon({ size: 32, className: 'text-gray-500' }) as React.ReactNode}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                    {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500 max-w-sm text-center">
                    As configurações para esta seção estão sendo desenvolvidas e estarão disponíveis em breve.
                </p>
            </div>
        )}

        {activeTab === 'conta' && (
            <div className="mt-8 flex justify-end pb-10">
                <button className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all">
                    Save Changes
                </button>
            </div>
        )}
      </div>
    </div>
  );
};