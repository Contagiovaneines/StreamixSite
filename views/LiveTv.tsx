
import React, { useState, useEffect } from 'react';
import { Category, LiveStream } from '../types';
import { mockApi } from '../services/mockApi';
import { Search, Play, Tv, ChevronLeft, Info } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';

export const LiveTv: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [channels, setChannels] = useState<LiveStream[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mobile View State
  const [mobileView, setMobileView] = useState<'categories' | 'channels'>('categories');

  useEffect(() => {
    const loadCats = async () => {
      const data = await mockApi.getLiveCategories();
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0].category_id);
    };
    loadCats();
  }, []);

  useEffect(() => {
    const loadChannels = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      const data = await mockApi.getLiveStreams(selectedCategory);
      setChannels(data);
      setLoading(false);
    };
    loadChannels();
  }, [selectedCategory]);

  const handleCategorySelect = (id: string) => {
      setSelectedCategory(id);
      setMobileView('channels');
  };

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-black text-white">
      
      {/* Mobile Player (Sticky Top) - Only visible on mobile when a channel is selected */}
      <div className={`lg:hidden w-full flex-shrink-0 bg-black ${selectedChannel ? 'block' : 'hidden'}`}>
        <div className="aspect-video w-full relative bg-slate-900">
            {selectedChannel && (
                <VideoPlayer 
                    key={`mobile-${selectedChannel.stream_id}`}
                    src={selectedChannel.direct_source} 
                    title={selectedChannel.name}
                    autoPlay={true}
                />
            )}
        </div>
        {selectedChannel && (
            <div className="p-3 bg-[#121212] border-b border-gray-800 flex items-center justify-between">
                <div className="truncate pr-2">
                    <h3 className="text-white font-bold text-sm truncate">{selectedChannel.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-gray-400 text-xs">Ao Vivo</p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Categories Column */}
      <div className={`
          flex-col flex-shrink-0 bg-[#0a0a0a] border-r border-gray-800
          lg:w-64 lg:flex h-full
          ${mobileView === 'categories' ? 'flex flex-1' : 'hidden'}
      `}>
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-bold text-gray-200 text-lg flex items-center gap-2">
              <Tv size={20} className="text-blue-500" /> Categorias
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.category_id}
              onClick={() => handleCategorySelect(cat.category_id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.category_id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center">
                  <span>{cat.category_name}</span>
                  <span className="lg:hidden text-gray-500"><ChevronLeft size={16} className="rotate-180" /></span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Channels List Column */}
      <div className={`
          flex-col flex-shrink-0 bg-[#0f0f0f] border-r border-gray-800
          lg:w-80 lg:flex h-full
          ${mobileView === 'channels' ? 'flex flex-1' : 'hidden'}
      `}>
        {/* Mobile Header: Back button */}
        <div className="lg:hidden p-3 border-b border-gray-800 bg-[#0a0a0a] flex items-center">
            <button 
                onClick={() => setMobileView('categories')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
                <ChevronLeft size={20} />
                <span className="ml-1 text-sm font-medium">Voltar para Categorias</span>
            </button>
        </div>

        <div className="p-4 border-b border-gray-800 space-y-3">
          <h2 className="font-bold text-gray-200 hidden lg:block">Canais</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar canal..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            filteredChannels.map(channel => (
              <button
                key={channel.stream_id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full flex items-center gap-3 p-3 border-b border-gray-800/50 transition-colors ${
                    selectedChannel?.stream_id === channel.stream_id ? 'bg-[#1a1a1a] border-l-4 border-l-blue-600' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <img 
                    src={channel.stream_icon} 
                    alt="icon" 
                    className="w-10 h-10 rounded object-cover bg-gray-800"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50')}
                />
                <div className="text-left overflow-hidden">
                    <p className={`text-sm font-medium truncate ${selectedChannel?.stream_id === channel.stream_id ? 'text-blue-400' : 'text-gray-200'}`}>
                        {channel.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedChannel?.stream_id === channel.stream_id ? 'bg-green-500' : 'bg-gray-600'}`}></span> 
                        {channel.stream_id === selectedChannel?.stream_id ? 'Assistindo' : 'Ao Vivo'}
                    </p>
                </div>
              </button>
            ))
          )}
          {filteredChannels.length === 0 && !loading && (
               <div className="p-8 text-center text-gray-500 text-sm">
                   Nenhum canal encontrado.
               </div>
          )}
        </div>
      </div>

      {/* Desktop Player Area */}
      <div className="hidden lg:flex flex-1 bg-black flex-col">
        {selectedChannel ? (
            <div className="flex-1 relative bg-black">
                <VideoPlayer 
                    key={selectedChannel.stream_id} // Force re-mount on channel change
                    src={selectedChannel.direct_source} 
                    title={selectedChannel.name}
                    autoPlay={true}
                />
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 bg-[#050505]">
                <div className="p-6 bg-[#0f0f0f] rounded-full mb-4">
                    <Tv size={64} className="opacity-50" />
                </div>
                <p className="text-xl font-medium text-gray-400">Selecione um canal para assistir</p>
                <p className="text-sm text-gray-600 mt-2">Escolha uma categoria e depois um canal</p>
            </div>
        )}
        
        {/* Simple EPG / Info placeholder */}
        {selectedChannel && (
            <div className="h-40 bg-[#0a0a0a] border-t border-gray-800 p-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex items-start gap-5">
                    <img src={selectedChannel.stream_icon} className="w-20 h-20 rounded-xl bg-gray-800 object-cover shadow-lg" />
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{selectedChannel.name}</h3>
                        <div className="flex items-center gap-3 text-gray-400 text-sm mb-3">
                             <span className="flex items-center gap-1 text-red-500 font-bold"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> AO VIVO</span>
                             <span>•</span>
                             <span>1080p Full HD</span>
                             <span>•</span>
                             <span>Stereo</span>
                        </div>
                        <div className="flex gap-2">
                             <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 font-medium">HD</span>
                             <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 font-medium">16:9</span>
                             <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700 font-medium">TV</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
