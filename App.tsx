
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentType, Profile } from './types';
import { mockApi } from './services/mockApi';
import { LiveTv } from './views/LiveTv';
import { Movies } from './views/Movies';
import { Series } from './views/Series';
import { Settings } from './views/Settings';
import { Profiles } from './views/Profiles';
import { MyList } from './views/MyList';
import { User, Lock, Server, Smartphone, ChevronRight, Settings as SettingsIcon, Search, Film, Tv, MonitorPlay, Cast, Download, Bell, ChevronDown, Home, PlaySquare } from 'lucide-react';

enum AppState {
    SPLASH = 'splash',
    LOGIN = 'login',
    ONBOARDING = 'onboarding',
    PROFILES = 'profiles',
    APP = 'app'
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.HOME);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);
  
  // Login Form State
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('http://cheapflix.us:25461');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{movies: any[], series: any[], channels: any[]}>({movies:[], series:[], channels:[]});
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Splash Screen Timer
  useEffect(() => {
    if (appState === AppState.SPLASH) {
      // Check for saved session
      const savedProfile = localStorage.getItem('streamix_current_profile');
      const savedState = localStorage.getItem('streamix_app_state');
      
      const timer = setTimeout(() => {
        if (savedProfile && savedState === 'APP') {
             try {
                setSelectedProfile(JSON.parse(savedProfile));
                setAppState(AppState.APP);
             } catch(e) {
                 setAppState(AppState.LOGIN);
             }
        } else {
             setAppState(AppState.LOGIN);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Debounce Search
  useEffect(() => {
      const handler = setTimeout(() => {
          setDebouncedQuery(searchQuery);
      }, 500); // 500ms debounce
      return () => clearTimeout(handler);
  }, [searchQuery]);

  // Perform Search
  useEffect(() => {
      if(debouncedQuery.length > 2) {
          setIsSearching(true);
          // Simulate global search by fetching distinct categories and filtering
          // In a real app, this would be a single API endpoint
          Promise.all([
              mockApi.getVodCategories().then(async cats => {
                  const allMovies = [];
                  for(const c of cats.slice(0, 3)) { // Limit to few cats for demo performance
                      const streams = await mockApi.getVodStreams(c.category_id);
                      allMovies.push(...streams);
                  }
                  return allMovies.filter(m => m.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
              }),
              mockApi.getSeriesCategories().then(async cats => {
                  const allSeries = [];
                  for(const c of cats.slice(0, 3)) {
                      const series = await mockApi.getSeries(c.category_id);
                      allSeries.push(...series);
                  }
                  return allSeries.filter(s => s.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
              }),
              mockApi.getLiveCategories().then(async cats => {
                   const allChannels = [];
                   if(cats.length > 0) {
                        const channels = await mockApi.getLiveStreams(cats[0].category_id);
                        allChannels.push(...channels);
                   }
                   return allChannels.filter(c => c.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
              })
          ]).then(([movies, series, channels]) => {
              setSearchResults({ movies, series, channels });
              setIsSearching(false);
          });
      } else {
          setSearchResults({movies:[], series:[], channels:[]});
      }
  }, [debouncedQuery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mockApi.login(username, password, url);
    setLoading(false);
    // Flow Change: Login -> Onboarding -> Profiles
    setAppState(AppState.ONBOARDING);
  };

  const handleProfileSelect = (profile: Profile) => {
    if(!profile.locked || (profile.locked && profile.isKid === false)) { // Basic check, real lock logic in Profiles view
        setSelectedProfile(profile);
        localStorage.setItem('streamix_current_profile', JSON.stringify(profile));
        localStorage.setItem('streamix_app_state', 'APP');
        setAppState(AppState.APP);
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('streamix_current_profile');
      localStorage.removeItem('streamix_app_state');
      setAppState(AppState.LOGIN);
      setSelectedProfile(undefined);
      setActiveTab(ContentType.HOME);
      setShowSettings(false);
  };

  const handleSwitchProfile = () => {
      localStorage.removeItem('streamix_current_profile');
      // We keep the main login session (implied), just go back to profiles
      setAppState(AppState.PROFILES);
      setSelectedProfile(undefined);
      setShowSettings(false);
  };

  // --- SPLASH SCREEN ---
  if (appState === AppState.SPLASH) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center animate-in fade-in duration-1000">
         <div className="flex items-center gap-2 transform scale-150 animate-bounce-subtle">
             <div className="text-blue-600">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M5 3L19 12L5 21V3Z" />
               </svg>
             </div>
             <div className="font-bold text-5xl tracking-tight">
                <span className="text-white">Stream</span><span className="text-blue-600">ix</span>
             </div>
          </div>
          <div className="mt-8 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- ONBOARDING (Post-Login) ---
  if (appState === AppState.ONBOARDING) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-in slide-in-from-right duration-500">
             <div className="max-w-md w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
                <div className="mb-12 mt-8 flex justify-center text-blue-600">
                    <Smartphone size={64} strokeWidth={1.5} />
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
                    <button onClick={() => setAppState(AppState.PROFILES)} className="text-gray-500 text-xs hover:text-white transition-colors">Voltar</button>
                    <button onClick={() => setAppState(AppState.PROFILES)} className="text-white text-xs hover:text-blue-500 transition-colors">Pular</button>
                    <button 
                        onClick={() => setAppState(AppState.PROFILES)}
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans animate-in fade-in duration-500">
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

        <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-800 p-8 rounded-2xl relative z-10 shadow-xl">
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
            onClick={() => setAppState(AppState.ONBOARDING)}
            className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
             <span>👋</span> Entrar em Modo Demo
          </button>
        </div>
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
        setActiveTab={(tab) => {
            setActiveTab(tab);
            setSearchQuery(''); // Clear search on tab change
        }}
        isSettingsOpen={showSettings}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        onChangeProfile={handleSwitchProfile}
        user={selectedProfile}
      />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/95 via-black/80 to-transparent pb-4 pt-2 transition-all duration-300">
        <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-bold text-white drop-shadow-md tracking-wide">
                Para {selectedProfile?.name?.toUpperCase() || 'VOCÊ'}
            </h1>
            <div className="flex items-center gap-5">
                <Cast size={22} className="text-white drop-shadow-md" />
                <Download size={22} className="text-white drop-shadow-md" />
                <Search 
                    size={22} 
                    className="text-white drop-shadow-md cursor-pointer" 
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                />
                <Bell size={22} className="text-white drop-shadow-md" />
            </div>
        </div>
        
        {/* Mobile Filter Chips */}
        {!showMobileSearch && (
            <div className="flex items-center gap-3 px-4 overflow-x-auto scrollbar-hide mt-2">
                <button 
                    onClick={() => setActiveTab(ContentType.SERIES)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${activeTab === ContentType.SERIES ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600'}`}
                >
                    Séries
                </button>
                <button 
                    onClick={() => setActiveTab(ContentType.MOVIE)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${activeTab === ContentType.MOVIE ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600'}`}
                >
                    Filmes
                </button>
                <button className="px-4 py-1.5 rounded-full text-xs font-medium border border-gray-600 text-gray-300 bg-transparent flex items-center gap-1 whitespace-nowrap">
                    Categorias <ChevronDown size={12} />
                </button>
            </div>
        )}

        {/* Mobile Search Bar Toggle */}
        {showMobileSearch && (
            <div className="px-4 mt-2">
                 <div className="bg-[#1f1f1f] rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-gray-400">
                    <Search size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        className="bg-transparent border-none outline-none w-full placeholder:text-gray-500 text-white" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
        )}
      </div>

      <main className="flex-1 h-full overflow-hidden relative pt-[110px] lg:pt-0 pb-[64px] lg:pb-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex absolute top-0 right-0 p-6 z-40 items-center gap-4">
             {activeTab !== ContentType.LIVE && (
                <div className="relative group">
                    <div className="bg-[#121212] border border-gray-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-400 w-64 focus-within:border-blue-600 focus-within:bg-black transition-all">
                        <Search size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar filmes, séries, anime..." 
                            className="bg-transparent border-none outline-none w-full placeholder:text-gray-600" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
             )}
             <button onClick={() => setShowSettings(true)} className="text-gray-400 hover:text-white">
                <SettingsIcon size={20} strokeWidth={1.5} />
             </button>
        </header>

        <div className="relative z-10 h-full">
            {/* Search Overlay */}
            {debouncedQuery.length > 2 ? (
                <div className="h-full bg-black/95 backdrop-blur-xl p-8 pt-4 lg:pt-24 overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6">Resultados para "{debouncedQuery}"</h2>
                    {isSearching ? (
                        <div className="text-gray-500">Buscando...</div>
                    ) : (
                        <div className="space-y-10 pb-20">
                            {searchResults.movies.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Film size={18}/> Filmes</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {searchResults.movies.map((m: any) => (
                                            <div key={m.stream_id} className="cursor-pointer group">
                                                <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                                                    <img src={m.stream_icon} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <p className="text-sm font-medium truncate">{m.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {searchResults.series.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><MonitorPlay size={18}/> Séries</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {searchResults.series.map((s: any) => (
                                            <div key={s.series_id} className="cursor-pointer group">
                                                <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                                                    <img src={s.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <p className="text-sm font-medium truncate">{s.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {searchResults.channels.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Tv size={18}/> Canais</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {searchResults.channels.map((c: any) => (
                                            <div key={c.stream_id} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 cursor-pointer">
                                                <img src={c.stream_icon} className="w-10 h-10 rounded object-cover" />
                                                <p className="text-sm font-medium truncate">{c.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {searchResults.movies.length === 0 && searchResults.series.length === 0 && searchResults.channels.length === 0 && (
                                <p className="text-gray-500">Nenhum resultado encontrado.</p>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {activeTab === ContentType.HOME && <Movies showHero={true} title="Em Alta" profile={selectedProfile} />}
                    {activeTab === ContentType.MOVIE && <Movies showHero={true} title="Filmes" profile={selectedProfile} />}
                    {activeTab === ContentType.SERIES && <Series profile={selectedProfile} />}
                    {activeTab === ContentType.LIVE && <LiveTv />}
                    {activeTab === ContentType.MY_LIST && <MyList profile={selectedProfile} />}
                    {activeTab === ContentType.CATCHUP && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">Catch Up</h2>
                                <p>Funcionalidade em desenvolvimento...</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-gray-800 pb-safe-bottom">
            <div className="flex items-center justify-around h-16">
                <button onClick={() => setActiveTab(ContentType.HOME)} className={`flex flex-col items-center gap-1 ${activeTab === ContentType.HOME ? 'text-white' : 'text-gray-500'}`}>
                    <Home size={22} strokeWidth={activeTab === ContentType.HOME ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Início</span>
                </button>
                
                <button onClick={() => setActiveTab(ContentType.SERIES)} className={`flex flex-col items-center gap-1 ${activeTab === ContentType.SERIES ? 'text-white' : 'text-gray-500'}`}>
                    <PlaySquare size={22} strokeWidth={activeTab === ContentType.SERIES ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Novidades</span>
                </button>

                <button onClick={handleSwitchProfile} className={`flex flex-col items-center gap-1 text-gray-500`}>
                    <div className={`w-6 h-6 rounded overflow-hidden border-2 border-transparent`}>
                        <img src={selectedProfile?.avatar} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-medium">Minha Netflix</span>
                </button>
            </div>
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
