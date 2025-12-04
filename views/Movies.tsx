import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, VodStream, Profile, WatchProgress } from '../types';
import { mockApi } from '../services/mockApi';
import { Play, Plus, Info, Star, Filter, Check } from 'lucide-react';
import { Modal } from '../components/Modal';
import { VideoPlayer } from '../components/VideoPlayer';

interface MoviesProps {
    title?: string;
    showHero?: boolean;
    profile?: Profile;
}

export const Movies: React.FC<MoviesProps> = ({ title = "Filmes", showHero = false, profile }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStreams, setCategoryStreams] = useState<Record<string, VodStream[]>>({});
  const [heroMovie, setHeroMovie] = useState<VodStream | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<VodStream | null>(null);
  const [playMovie, setPlayMovie] = useState(false);
  
  // List State
  const [inList, setInList] = useState(false);
  const [heroInList, setHeroInList] = useState(false);

  // Filtering State
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  
  // Continue Watching State
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [resumeTime, setResumeTime] = useState(0);

  // Helper to check if content is suitable for Kids profile
  const isContentAllowed = useCallback((stream: VodStream) => {
      if (!profile?.isKid) return true;
      
      // If profile is kid, filter out 16+ content
      const rating = stream.ageRating || "L";
      const restrictedRatings = ["16", "18", "TV-MA", "R"];
      return !restrictedRatings.includes(rating);
  }, [profile]);

  // Load Data
  useEffect(() => {
    const init = async () => {
        const cats = await mockApi.getVodCategories();
        setCategories(cats);
        
        // Load streams for each category to build rows
        const streamsMap: Record<string, VodStream[]> = {};
        const genresSet = new Set<string>();

        for(const cat of cats) {
            const streams = await mockApi.getVodStreams(cat.category_id);
            // Filter streams based on profile
            const filteredStreams = streams.filter(isContentAllowed);
            
            streamsMap[cat.category_id] = filteredStreams;
            
            // Collect Genres
            filteredStreams.forEach(s => {
                if(s.genre) genresSet.add(s.genre);
            });

            // Pick first movie of first category as hero for now if enabled and fits profile
            if(showHero && !heroMovie && filteredStreams.length > 0 && cat.category_id === cats[0].category_id) {
                setHeroMovie(filteredStreams[0]);
            }
        }
        setCategoryStreams(streamsMap);
        setAvailableGenres(Array.from(genresSet).sort());
    };
    init();
  }, [showHero, isContentAllowed]);

  // Load Continue Watching
  useEffect(() => {
    if (profile) {
        const progress = mockApi.getWatchProgress(profile.id);
        setContinueWatching(progress);
    }
  }, [profile, playMovie]); // Reload when player closes to update list

  // Check List Status
  useEffect(() => {
      if (profile && selectedMovie) {
          setInList(mockApi.isInMyList(profile.id, selectedMovie.stream_id));
      }
      if (profile && heroMovie) {
          setHeroInList(mockApi.isInMyList(profile.id, heroMovie.stream_id));
      }
  }, [profile, selectedMovie, heroMovie]);

  // Memoized Filtered Content
  const filteredCategoryStreams = useMemo(() => {
      const filtered: Record<string, VodStream[]> = {};
      
      Object.keys(categoryStreams).forEach(catId => {
          const streams = categoryStreams[catId].filter(movie => {
              const genreMatch = selectedGenre === 'All' || movie.genre === selectedGenre;
              const yearMatch = selectedYear === 'All' || movie.year === selectedYear;
              return genreMatch && yearMatch;
          });
          
          if (streams.length > 0) {
              filtered[catId] = streams;
          }
      });
      
      return filtered;
  }, [categoryStreams, selectedGenre, selectedYear]);

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setPlayMovie(false);
    setResumeTime(0);
  };

  const handlePlayMovie = (movie: VodStream) => {
      // Check if we have progress
      if (profile) {
          const progress = mockApi.getWatchProgress(profile.id).find(p => p.contentId === movie.stream_id);
          if (progress) {
              setResumeTime(progress.timestamp);
          } else {
              setResumeTime(0);
          }
      }
      setSelectedMovie(movie);
      setPlayMovie(true);
  };

  const handleToggleList = (movie: VodStream, isHero: boolean = false) => {
      if (!profile) return;
      
      const isAdded = mockApi.isInMyList(profile.id, movie.stream_id);
      
      if (isAdded) {
          mockApi.removeFromMyList(profile.id, movie.stream_id);
          if(isHero) setHeroInList(false);
          else setInList(false);
      } else {
          mockApi.addToMyList({
              contentId: movie.stream_id,
              profileId: profile.id,
              type: 'movie',
              addedAt: Date.now(),
              meta: {
                  name: movie.name,
                  image: movie.stream_icon,
                  backdrop: movie.backdrop_path?.[0],
                  rating: movie.rating,
                  ageRating: movie.ageRating,
                  year: movie.year,
                  genre: movie.genre,
                  source: movie.direct_source,
                  plot: movie.plot
              }
          });
          if(isHero) setHeroInList(true);
          else setInList(true);
      }
  };

  const handleContinueWatchingClick = (item: WatchProgress) => {
      const movie: VodStream = {
          stream_id: item.contentId as number,
          name: item.meta.name,
          stream_icon: item.meta.image,
          direct_source: item.meta.source,
          backdrop_path: item.meta.backdrop ? [item.meta.backdrop] : [],
          rating: item.meta.rating || "0",
          ageRating: item.meta.ageRating,
          // Defaults
          num: 0, stream_type: 'movie', rating_5based: 0, added: '', category_id: '', container_extension: 'mp4', genre: 'Unknown'
      };
      
      setResumeTime(item.timestamp);
      setSelectedMovie(movie);
      setPlayMovie(true);
  };

  const onVideoProgress = (progress: { currentTime: number; duration: number; percentage: number }) => {
      if (profile && selectedMovie) {
          if (progress.currentTime > 5) {
              mockApi.saveWatchProgress({
                  contentId: selectedMovie.stream_id,
                  profileId: profile.id,
                  type: 'movie',
                  progress: progress.percentage,
                  timestamp: progress.currentTime,
                  duration: progress.duration,
                  lastWatched: Date.now(),
                  meta: {
                      name: selectedMovie.name,
                      image: selectedMovie.stream_icon,
                      source: selectedMovie.direct_source,
                      backdrop: selectedMovie.backdrop_path?.[0],
                      year: selectedMovie.year,
                      rating: selectedMovie.rating,
                      ageRating: selectedMovie.ageRating
                  }
              });
          }
      }
  };

  return (
    <div className="h-full bg-black flex flex-col overflow-y-auto custom-scrollbar">
      
      {/* Hero Section */}
      {showHero && heroMovie && selectedGenre === 'All' && selectedYear === 'All' && (
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
                     {heroMovie.ageRating && (
                         <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                             heroMovie.ageRating === '18' ? 'border-red-600 text-red-500' :
                             heroMovie.ageRating === '16' ? 'border-red-600 text-red-500' :
                             heroMovie.ageRating === '14' ? 'border-orange-500 text-orange-500' :
                             heroMovie.ageRating === '12' ? 'border-yellow-500 text-yellow-500' :
                             'border-green-500 text-green-500'
                         }`}>
                             {heroMovie.ageRating}
                         </span>
                     )}
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
                        onClick={() => handlePlayMovie(heroMovie)}
                        className="px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold flex items-center gap-2 transition-colors"
                    >
                        <Play size={20} fill="currentColor" /> Assistir
                    </button>
                    <button 
                        onClick={() => handleToggleList(heroMovie, true)}
                        className="px-6 py-3 bg-gray-600/60 hover:bg-gray-600/80 text-white rounded font-medium flex items-center gap-2 transition-colors"
                    >
                        {heroInList ? <Check size={20} /> : <Plus size={20} />}
                        {heroInList ? 'Na Lista' : 'Minha Lista'}
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

      {/* Filters & Content */}
      <div className={`flex-1 p-6 space-y-8 ${showHero ? '-mt-16 relative z-20' : ''}`}>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
             {!showHero && <h1 className="text-2xl font-bold text-white mr-4">{title}</h1>}
             
             <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-1.5">
                 <Filter size={14} className="text-gray-400" />
                 <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 outline-none border-none cursor-pointer"
                 >
                     <option value="All">Todos Gêneros</option>
                     {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
                 </select>
             </div>

             <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-1.5">
                 <span className="text-xs text-gray-500">Ano:</span>
                 <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 outline-none border-none cursor-pointer"
                 >
                     <option value="All">Todos</option>
                     <option value="2024">2024</option>
                     <option value="2023">2023</option>
                     <option value="2022">2022</option>
                 </select>
             </div>
        </div>

        {/* Continue Watching Row */}
        {showHero && continueWatching.length > 0 && selectedGenre === 'All' && selectedYear === 'All' && (
            <div className="animate-in fade-in slide-in-from-right duration-700">
                <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        Continuar Assistindo
                    </h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                    {continueWatching.map(item => (
                        <div 
                            key={item.contentId} 
                            onClick={() => handleContinueWatchingClick(item)}
                            className="flex-shrink-0 w-40 md:w-56 cursor-pointer group relative"
                        >
                            <div className="aspect-video rounded-md overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-900/20 group-hover:ring-2 group-hover:ring-blue-600 relative">
                                <img 
                                    src={item.meta.backdrop || item.meta.image} 
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                        <Play size={16} fill="white" className="text-white ml-0.5" />
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                    <div 
                                        className="h-full bg-blue-600" 
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="mt-2 px-1">
                                <h4 className="text-white text-sm font-bold truncate group-hover:text-blue-500 transition-colors">{item.meta.name}</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400">
                                        {item.meta.subTitle || (item.type === 'movie' ? 'Filme' : 'Série')}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {Math.floor(item.progress)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {Object.keys(filteredCategoryStreams).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Info size={48} className="mb-4 opacity-50" />
                <p>Nenhum filme encontrado com estes filtros.</p>
            </div>
        ) : (
            categories.map(cat => (
                filteredCategoryStreams[cat.category_id] && filteredCategoryStreams[cat.category_id].length > 0 && (
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
                            {filteredCategoryStreams[cat.category_id].map(movie => (
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
                                            <span className="text-[10px] text-gray-400">{movie.year || '2024'}</span>
                                            <div className="flex items-center gap-2">
                                                {movie.ageRating && (
                                                    <span className={`text-[10px] font-bold px-1 rounded border ${
                                                        movie.ageRating === '18' ? 'border-red-600 text-red-500' :
                                                        movie.ageRating === '16' ? 'border-red-600 text-red-500' :
                                                        movie.ageRating === '14' ? 'border-orange-500 text-orange-500' :
                                                        'border-green-500 text-green-500'
                                                    }`}>
                                                        {movie.ageRating}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                                    <Star size={10} fill="currentColor" /> {movie.rating}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mt-1.5">
                                            <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">{movie.genre || 'Filme'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))
        )}
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
                                <span>{selectedMovie.year || '2024'}</span>
                                {selectedMovie.ageRating && (
                                     <span className={`px-2 py-0.5 border rounded text-xs ${
                                        selectedMovie.ageRating === '18' ? 'border-red-600 text-red-500' : 'border-gray-500 text-gray-400'
                                     }`}>{selectedMovie.ageRating}</span>
                                )}
                                <span className="border border-gray-600 px-1 rounded text-xs">HD</span>
                            </div>
                        </div>

                        <p className="text-white text-lg leading-relaxed max-w-2xl">
                            {selectedMovie.plot || "Uma descrição detalhada do filme apareceria aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button 
                                onClick={() => handlePlayMovie(selectedMovie)}
                                className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold flex items-center gap-2 transition-colors"
                            >
                                <Play size={20} fill="currentColor" /> Assistir
                            </button>
                            <button 
                                onClick={() => handleToggleList(selectedMovie)}
                                className="px-8 py-3 bg-gray-600/40 hover:bg-gray-600/60 text-white rounded font-bold flex items-center gap-2 transition-colors"
                            >
                                {inList ? <Check size={20} /> : <Plus size={20} />}
                                {inList ? 'Na Lista' : 'Minha Lista'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {playMovie && selectedMovie && (
            <div className="w-full h-full bg-black">
                 <VideoPlayer 
                    key={selectedMovie.stream_id} // FORCE RESET
                    src={selectedMovie.direct_source} 
                    poster={selectedMovie.stream_icon}
                    title={selectedMovie.name}
                    autoPlay={true}
                    startTime={resumeTime}
                    onProgress={onVideoProgress}
                />
            </div>
        )}
      </Modal>
    </div>
  );
};