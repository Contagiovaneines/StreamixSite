import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentType, Profile } from './types';
import { mockApi } from './services/mockApi';
import { LiveTv } from './views/LiveTv';
import { Movies } from './views/Movies';
import { Series } from './views/Series';
import { Settings } from './views/Settings';
import { Profiles } from './views/Profiles';
import { User, Lock, Server, Smartphone, ChevronRight, Settings as SettingsIcon } from 'lucide-react';

enum AppState {
    ONBOARDING = 'onboarding',
    LOGIN = 'login',
    PROFILES = 'profiles',
    APP = 'app'
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.HOME);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);
  
  // Login Form State
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('http://cheapflix.us:25461');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mockApi.login(username, password, url);
    setLoading(false);
    setAppState(AppState.PROFILES);
  };

  const handleProfileSelect = (profile: Profile) => {
    if(!profile.locked) {
        setSelectedProfile(profile);
        setAppState(AppState.APP);
    }
  };

  const handleLogout = () => {
      setAppState(AppState.LOGIN);
      setSelectedProfile(undefined);
      setActiveTab(ContentType.HOME);
      setShowSettings(false);
  };

  if (appState === AppState.ONBOARDING) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
             <div className="max-w-md w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="mb-12 mt-8 flex justify-center text-blue-600">
                    <Smartphone size={48} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Assista em Qualquer Lugar</h2>
                <p className="text-gray-400 text-sm mb-12 leading-relaxed">
                    Transmita seus filmes, séries e animes favoritos em qualquer dispositivo, a qualquer hora, em qualquer lugar.
                </p>

                <div className="flex justify-center gap-2 mb-12">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <button onClick={() => setAppState(AppState.LOGIN)} className="text-gray-500 text-xs hover:text-white transition-colors">Voltar</button>
                    <button onClick={() => setAppState(AppState.LOGIN)} className="text-white text-xs hover:text-blue-500 transition-colors">Pular</button>
                    <button 
                        onClick={() => setAppState(AppState.LOGIN)}
                        className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        Próximo <ChevronRight size={14} />
                    </button>
                </div>
             </div>
        </div>
      );
  }

  if (appState === AppState.LOGIN) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="mb-10 flex flex-col items-center">
             <div className="flex items-center gap-1 mb-6 text-blue-600 transform scale-150">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M5 3L19 12L5 21V3Z" />
               </svg>
             </div>
             <div className="font-bold text-3xl tracking-tight mb-2">
                <span className="text-white">Stream</span><span className="text-blue-600">ix</span>
             </div>
             <p className="text-gray-400 text-sm">Faça login com suas credenciais IPTV</p>
        </div>

        <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl relative z-10">
          <h2 className="text-xl font-bold text-white text-center mb-1">Entrar</h2>
          <p className="text-center text-gray-500 text-xs mb-8">Digite suas credenciais Xtream Codes para acessar</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                </div>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#f0f4f8] text-gray-900 border-none rounded-lg py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                    placeholder="Username"
                    required
                />
            </div>
            
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                </div>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f0f4f8] text-gray-900 border-none rounded-lg py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                    placeholder="•••••••"
                    required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </div>

            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Server size={18} />
                </div>
                <input 
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-[#151515] border border-gray-700 text-gray-300 rounded-lg py-3 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-600"
                    placeholder="http://url_here.com:port"
                />
            </div>
            <p className="text-[10px] text-gray-500 ml-1">Deixe em branco para usar o portal padrão</p>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-70 mt-6 text-sm"
            >
                {loading ? 'Conectando...' : 'Entrar'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-800 flex-1"></div>
              <span className="text-xs text-gray-500 font-medium">OU</span>
              <div className="h-px bg-gray-800 flex-1"></div>
          </div>
          
          <button 
            type="button"
            onClick={() => setAppState(AppState.PROFILES)}
            className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
             <span>👋</span> Entrar em Modo Demo
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-8 text-center max-w-xs">
            Use suas credenciais do servidor Xtream Codes IPTV ou teste o Modo Demo
        </p>
      </div>
    );
  }

  if (appState === AppState.PROFILES) {
      return <Profiles onSelectProfile={handleProfileSelect} />;
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isSettingsOpen={showSettings}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        user={selectedProfile}
      />
      
      <main className="flex-1 h-full overflow-hidden relative">
        <header className="absolute top-0 right-0 p-6 z-40 flex items-center gap-4">
             {activeTab === ContentType.HOME && (
                 <div className="flex items-center gap-2">
                    <span className="bg-yellow-600/20 text-yellow-500 border border-yellow-600/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        👋 Modo Demo
                    </span>
                 </div>
             )}
             <div className="relative group">
                <div className="bg-[#121212] border border-gray-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-400 w-64">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar filmes, séries, anime..." className="bg-transparent border-none outline-none w-full placeholder:text-gray-600" />
                </div>
             </div>
             <button onClick={() => setShowSettings(true)} className="text-gray-400 hover:text-white">
                <SettingsIcon size={20} strokeWidth={1.5} />
             </button>
        </header>

        <div className="relative z-10 h-full">
            {activeTab === ContentType.HOME && <Movies showHero={true} title="Em Alta" />}
            {activeTab === ContentType.MOVIE && <Movies showHero={true} title="Filmes" />}
            {activeTab === ContentType.SERIES && <Series />}
            {activeTab === ContentType.LIVE && <LiveTv />}
            {activeTab === ContentType.CATCHUP && (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Catch Up</h2>
                        <p>Funcionalidade em desenvolvimento...</p>
                    </div>
                </div>
            )}
        </div>

        {/* Settings Overlay */}
        {showSettings && (
            <div className="absolute inset-0 z-50 bg-black animate-in slide-in-from-bottom-10 duration-300 fade-in">
                <Settings onBack={() => setShowSettings(false)} onLogout={handleLogout} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;