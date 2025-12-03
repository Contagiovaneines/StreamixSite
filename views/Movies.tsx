import React, { useState, useEffect } from 'react';
import { Category, VodStream } from '../types';
import { mockApi } from '../services/mockApi';
import { Play, Plus, Info, Star } from 'lucide-react';
import { Modal } from '../components/Modal';
import { VideoPlayer } from '../components/VideoPlayer';

interface MoviesProps {
    title?: string;
    showHero?: boolean;
}

export const Movies: React.FC<MoviesProps> = ({ title = "Filmes", showHero = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStreams, setCategoryStreams] = useState<Record<string, VodStream[]>>({});
  const [heroMovie, setHeroMovie] = useState<VodStream | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<VodStream | null>(null);
  const [playMovie, setPlayMovie] = useState(false);

  useEffect(() => {
    const init = async () => {
        const cats = await mockApi.getVodCategories();
        setCategories(cats);
        
        // Load streams for each category to build rows
        const streamsMap: Record<string, VodStream[]> = {};
        for(const cat of cats) {
            const streams = await mockApi.getVodStreams(cat.category_id);
            streamsMap[cat.category_id] = streams;
            
            // Pick first movie of first category as hero for now if enabled
            if(showHero && !heroMovie && streams.length > 0 && cat.category_id === cats[0].category_id) {
                setHeroMovie(streams[0]);
            }
        }
        setCategoryStreams(streamsMap);
    };
    init();
  }, [showHero]);

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setPlayMovie(false);
  };

  return (
    <div className="h-full bg-black flex flex-col overflow-y-auto custom-scrollbar">
      
      {/* Hero Section */}
      {showHero && heroMovie && (
        <div className="relative h-[85vh] w-full shrink-0">
            <div className="absolute inset-0">
                <img src={heroMovie.backdrop_path?.[0] || heroMovie.stream_icon} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl w-full z-10 pb-24">
                <div className="flex gap-2 mb-4">
                     <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">Novo</span>
                     <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-0.5 rounded">Movie</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">{heroMovie.name}</h1>
                
                <div className="flex items-center gap-4 text-gray-300 text-sm mb-4 font-medium">
                    <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> {heroMovie.rating}</span>
                    <span>{heroMovie.year || '2024'}</span>
                    <span>{heroMovie.duration || '148 min'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
                    <span className="border border-gray-600 px-2 py-1 rounded">{heroMovie.genre || 'Ação'}</span>
                    <span>Aventura</span>
                </div>

                <p className="text-gray-300 text-lg mb-8 line-clamp-3">
                    {heroMovie.plot || "Uma jornada emocionante através de terras desconhecidas."}
                </p>

                <div className="flex gap-4">
                    <button 
                        onClick={() => { setSelectedMovie(heroMovie); setPlayMovie(true); }}
                        className="px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold flex items-center gap-2 transition-colors"
                    >
                        <Play size={20} fill="currentColor" /> Assistir
                    </button>
                    <button className="px-6 py-3 bg-gray-600/60 hover:bg-gray-600/80 text-white rounded font-medium flex items-center gap-2 transition-colors">
                        <Plus size={20} /> Minha Lista
                    </button>
                    <button 
                        onClick={() => setSelectedMovie(heroMovie)}
                        className="px-6 py-3 bg-gray-600/60 hover:bg-gray-600/80 text-white rounded font-medium flex items-center gap-2 transition-colors"
                    >
                         <Info size={20} /> Mais Informações
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Rows */}
      <div className={`flex-1 p-6 space-y-10 ${showHero ? '-mt-16 relative z-20' : ''}`}>
        {!showHero && <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>}
        
        {categories.map(cat => (
             categoryStreams[cat.category_id] && categoryStreams[cat.category_id].length > 0 && (
                <div key={cat.category_id}>
                    <div className="flex items-center justify-between mb-3 px-2">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            {showHero && <span className="text-gray-400 transform -rotate-45">⬈</span>}
                            {cat.category_name}
                        </h3>
                        <div className="flex gap-2">
                             <button className="text-gray-500 hover:text-white"><span className="text-xs">❮</span></button>
                             <button className="text-gray-500 hover:text-white"><span className="text-xs">❯</span></button>
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                        {categoryStreams[cat.category_id].map(movie => (
                            <div 
                                key={movie.stream_id} 
                                onClick={() => setSelectedMovie(movie)}
                                className="flex-shrink-0 w-40 md:w-56 cursor-pointer group relative"
                            >
                                <div className="aspect-[2/3] rounded-md overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-900/20 group-hover:ring-2 group-hover:ring-blue-600">
                                    <img 
                                        src={movie.stream_icon} 
                                        className="w-full h-full object-cover" 
                                        loading="lazy"
                                        onError={(e) => (e.currentTarget.src = 'https://picsum.photos/300/450')}
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                            New
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 px-1">
                                    <h4 className="text-white text-sm font-bold truncate group-hover:text-blue-500 transition-colors">{movie.name}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-gray-400">2024</span>
                                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                            <Star size={10} fill="currentColor" /> {movie.rating}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mt-1.5">
                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">Ação</span>
                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">Aventura</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )
        ))}
      </div>

      {/* Details Modal */}
      <Modal isOpen={!!selectedMovie} onClose={handleCloseModal} fullScreen={playMovie}>
        {selectedMovie && !playMovie && (
            <div className="flex flex-col md:flex-row h-full bg-[#141414]">
                <div className="absolute inset-0 z-0">
                    <img src={selectedMovie.backdrop_path?.[0] || selectedMovie.stream_icon} className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent" />
                </div>

                <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto mt-10">
                    <div className="w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl shadow-black mx-auto md:mx-0 ring-1 ring-white/10">
                        <img src={selectedMovie.stream_icon} className="w-full h-auto object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-6">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">{selectedMovie.name}</h2>
                            <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                                <span className="flex items-center gap-1 text-green-500 font-bold">98% Match</span>
                                <span>2024</span>
                                <span className="border border-gray-600 px-1 rounded text-xs">HD</span>
                            </div>
                        </div>

                        <p className="text-white text-lg leading-relaxed max-w-2xl">
                            {selectedMovie.plot || "Uma descrição detalhada do filme apareceria aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button 
                                onClick={() => setPlayMovie(true)}
                                className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold flex items-center gap-2 transition-colors"
                            >
                                <Play size={20} fill="currentColor" /> Assistir
                            </button>
                            <button className="px-8 py-3 bg-gray-600/40 hover:bg-gray-600/60 text-white rounded font-bold flex items-center gap-2 transition-colors">
                                <Plus size={20} /> Minha Lista
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {playMovie && selectedMovie && (
            <div className="w-full h-full bg-black">
                 <VideoPlayer 
                    src={selectedMovie.direct_source} 
                    poster={selectedMovie.stream_icon}
                    title={selectedMovie.name}
                    autoPlay={true}
                />
            </div>
        )}
      </Modal>
    </div>
  );
};