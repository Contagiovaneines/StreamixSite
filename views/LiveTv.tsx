
import React, { useState, useEffect } from 'react';
import { Category, LiveStream } from '../types';
import { mockApi } from '../services/mockApi';
import { Search, Play, Tv } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';

export const LiveTv: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [channels, setChannels] = useState<LiveStream[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Categories Column */}
      <div className="w-64 bg-slate-800/50 border-r border-slate-700 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-bold text-slate-200">Categories</h2>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {categories.map(cat => (
            <button
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.category_id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      </div>

      {/* Channels List Column */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <h2 className="font-bold text-slate-200">Channels</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search channel..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            filteredChannels.map(channel => (
              <button
                key={channel.stream_id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full flex items-center gap-3 p-3 border-b border-slate-800 transition-colors ${
                    selectedChannel?.stream_id === channel.stream_id ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                }`}
              >
                <img 
                    src={channel.stream_icon} 
                    alt="icon" 
                    className="w-10 h-10 rounded-md object-cover bg-slate-700"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/50')}
                />
                <div className="text-left overflow-hidden">
                    <p className={`text-sm font-medium truncate ${selectedChannel?.stream_id === channel.stream_id ? 'text-purple-400' : 'text-slate-200'}`}>
                        {channel.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live
                    </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Player Area */}
      <div className="flex-1 bg-black flex flex-col">
        {selectedChannel ? (
            <div className="flex-1 relative">
                <VideoPlayer 
                    key={selectedChannel.stream_id} // Force re-mount on channel change
                    src={selectedChannel.direct_source} 
                    title={selectedChannel.name}
                    autoPlay={true}
                />
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                <Tv size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Select a channel to start watching</p>
            </div>
        )}
        
        {/* Simple EPG / Info placeholder */}
        {selectedChannel && (
            <div className="h-32 bg-slate-900 border-t border-slate-800 p-6">
                <div className="flex items-start gap-4">
                    <img src={selectedChannel.stream_icon} className="w-16 h-16 rounded-lg bg-slate-800 object-cover" />
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{selectedChannel.name}</h3>
                        <p className="text-slate-400 text-sm">Now Playing: Standard Broadcast • 1080p • Stereo</p>
                        <div className="mt-2 flex gap-2">
                             <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">HD</span>
                             <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">16:9</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
