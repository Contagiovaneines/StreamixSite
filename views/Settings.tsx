
import React, { useState } from 'react';
import { ArrowLeft, User, CreditCard, LogOut, Trash2, Smartphone, Bell, Shield, Eye, EyeOff, Globe, Monitor, Volume2, History, Database, Check } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onLogout }) => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [activeTab, setActiveTab] = useState('conta');

  // Mock States for other tabs
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [autoplayPreview, setAutoplayPreview] = useState(true);
  const [videoQuality, setVideoQuality] = useState('auto');
  const [notifications, setNotifications] = useState({
      releases: true,
      recommendations: true,
      security: true,
      offers: false
  });
  const [parentalPin, setParentalPin] = useState('');
  const [ageRating, setAgeRating] = useState('16');

  const tabs = [
      { id: 'conta', label: 'Conta', icon: User },
      { id: 'preferencias', label: 'Preferências', icon: Smartphone },
      { id: 'notificacoes', label: 'Notificações', icon: Bell },
      { id: 'parental', label: 'Controle Parental', icon: Shield },
      { id: 'privacidade', label: 'Privacidade', icon: Eye },
  ];

  const renderConta = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300 pb-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
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
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
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

                <button className="bg-[#1a365d] text-blue-100 px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors w-full md:w-auto">
                    Update Password
                </button>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
            {/* Subscription */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
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
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
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
  );

  const renderPreferencias = () => (
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Globe size={20} className="text-blue-500" /> Interface</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Idioma do App</label>
                        <select className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:border-blue-600 focus:outline-none">
                            <option value="pt">Português (Brasil)</option>
                            <option value="en">English (US)</option>
                            <option value="es">Español</option>
                        </select>
                   </div>
                   <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Idioma de Áudio Padrão</label>
                        <select className="w-full bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:border-blue-600 focus:outline-none">
                            <option value="orig">Áudio Original</option>
                            <option value="pt">Português</option>
                        </select>
                   </div>
              </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Monitor size={20} className="text-blue-500" /> Reprodução</h2>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                  <div>
                      <h4 className="font-medium text-gray-200">Reprodução Automática</h4>
                      <p className="text-xs text-gray-500 mt-1">Iniciar o próximo episódio automaticamente</p>
                  </div>
                  <button 
                    onClick={() => setAutoplayNext(!autoplayNext)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${autoplayNext ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoplayNext ? 'left-7' : 'left-1'}`}></div>
                  </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-800">
                  <div>
                      <h4 className="font-medium text-gray-200">Reproduzir Prévias</h4>
                      <p className="text-xs text-gray-500 mt-1">Reproduzir trailers automaticamente ao navegar</p>
                  </div>
                  <button 
                    onClick={() => setAutoplayPreview(!autoplayPreview)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${autoplayPreview ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoplayPreview ? 'left-7' : 'left-1'}`}></div>
                  </button>
              </div>

              <div className="pt-4">
                  <h4 className="font-medium text-gray-200 mb-3">Qualidade de Vídeo</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {['auto', 'low', 'medium', 'high'].map((q) => (
                          <button 
                            key={q}
                            onClick={() => setVideoQuality(q)}
                            className={`border rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                videoQuality === q 
                                ? 'bg-blue-600/20 border-blue-600 text-blue-500' 
                                : 'bg-[#151515] border-gray-800 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                              {q === 'auto' && 'Automático'}
                              {q === 'low' && 'Economia'}
                              {q === 'medium' && 'SD'}
                              {q === 'high' && 'HD'}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderNotificacoes = () => (
      <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-bold mb-6">Configurações de Push</h2>
              <div className="space-y-6">
                  {[
                      { key: 'releases', title: 'Novidades e Lançamentos', desc: 'Seja notificado sobre novos filmes e episódios' },
                      { key: 'recommendations', title: 'Sugestões para você', desc: 'Recomendações baseadas no que você assiste' },
                      { key: 'security', title: 'Segurança da Conta', desc: 'Alertas sobre novos logins e alterações de senha' },
                      { key: 'offers', title: 'Ofertas e Promoções', desc: 'Receba ofertas especiais e descontos' },
                  ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                          <div className="pr-4">
                              <h4 className="font-medium text-gray-200 text-sm md:text-base">{item.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                          <button 
                            // @ts-ignore
                            onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
                            // @ts-ignore
                            className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${notifications[item.key] ? 'bg-blue-600' : 'bg-gray-700'}`}
                          >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                  // @ts-ignore
                                  notifications[item.key] ? 'left-7' : 'left-1'
                              }`}></div>
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderParental = () => (
      <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                      <Shield size={24} className="text-gray-400" />
                  </div>
                  <div>
                      <h2 className="text-lg font-bold">Controle Parental</h2>
                      <p className="text-sm text-gray-500">Gerencie quem pode assistir o quê nesta conta</p>
                  </div>
              </div>

              <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-3">PIN do Perfil</label>
                  <p className="text-xs text-gray-500 mb-4">Este PIN é necessário para acessar perfis bloqueados e alterar configurações parentais.</p>
                  <div className="flex gap-4">
                      <input 
                        type="password" 
                        maxLength={4}
                        value={parentalPin}
                        onChange={(e) => setParentalPin(e.target.value)}
                        placeholder="••••"
                        className="w-32 bg-[#151515] border border-gray-800 rounded-lg px-4 py-2.5 text-center text-lg tracking-widest focus:border-blue-600 focus:outline-none transition-colors text-white" 
                      />
                      <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                          Alterar PIN
                      </button>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Restrição de Idade</label>
                  <div className="flex flex-wrap gap-3">
                      {['L', '10', '12', '14', '16', '18'].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setAgeRating(rating)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold flex items-center justify-center border-2 transition-all ${
                                ageRating === rating 
                                ? 'bg-white text-black border-white scale-110' 
                                : 'bg-[#151515] text-gray-500 border-gray-800 hover:border-gray-600'
                            }`}
                          >
                              {rating}
                          </button>
                      ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                      Conteúdo com classificação superior a {ageRating} exigirá o PIN para ser reproduzido neste perfil.
                  </p>
              </div>
          </div>
      </div>
  );

  const renderPrivacidade = () => (
      <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Database size={20} className="text-blue-500" /> Dados e Histórico</h2>
              
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#151515] rounded-xl">
                      <div className="flex items-center gap-3">
                          <History size={20} className="text-gray-400 shrink-0" />
                          <div>
                              <h4 className="text-sm font-medium text-gray-200">Histórico de Visualização</h4>
                              <p className="text-xs text-gray-500">Limpar lista de "Continuar Assistindo"</p>
                          </div>
                      </div>
                      <button className="text-xs font-medium text-red-500 hover:text-red-400 px-3 py-1.5 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors shrink-0">
                          Limpar
                      </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#151515] rounded-xl">
                      <div className="flex items-center gap-3">
                          <Monitor size={20} className="text-gray-400 shrink-0" />
                          <div>
                              <h4 className="text-sm font-medium text-gray-200">Dispositivos Conectados</h4>
                              <p className="text-xs text-gray-500">Gerencie onde sua conta está logada</p>
                          </div>
                      </div>
                      <button className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors shrink-0">
                          Ver todos
                      </button>
                  </div>
              </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-bold mb-4">Cookies e Publicidade</h2>
              <div className="flex items-start gap-3 mb-6">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded bg-gray-800 border-gray-700" defaultChecked />
                  <div>
                      <h4 className="text-sm font-medium text-gray-200">Permitir personalização</h4>
                      <p className="text-xs text-gray-500 mt-1">
                          Usamos seus dados de visualização para recomendar conteúdo mais relevante.
                      </p>
                  </div>
              </div>
              <button className="text-sm text-gray-400 hover:text-white underline">
                  Ler Política de Privacidade
              </button>
          </div>
      </div>
  );

  return (
    <div className="h-full w-full bg-black text-white p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8 pt-2">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Voltar</span>
                </button>
                <div className="flex items-center gap-1 md:ml-4">
                    <div className="text-blue-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 3L19 12L5 21V3Z" />
                    </svg>
                    </div>
                    <div className="font-bold text-lg md:text-xl tracking-tight flex items-center flex-wrap">
                        <span className="text-white">Stream</span><span className="text-blue-600">ix</span> 
                        <span className="text-gray-400 mx-2">/</span> 
                        <span className="text-white">Configurações</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs - Horizontal Scroll on mobile */}
        <div className="flex overflow-x-auto gap-1 mb-6 md:mb-8 bg-[#121212] p-1 rounded-xl w-full md:w-fit border border-gray-900 scrollbar-hide shrink-0">
            {tabs.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 md:px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-[#1a1a1a] text-white border border-gray-800' 
                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {activeTab === 'conta' && renderConta()}
        {activeTab === 'preferencias' && renderPreferencias()}
        {activeTab === 'notificacoes' && renderNotificacoes()}
        {activeTab === 'parental' && renderParental()}
        {activeTab === 'privacidade' && renderPrivacidade()}

        <div className="mt-8 flex justify-end pb-10">
            <button className="w-full md:w-auto bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all">
                Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );
};
