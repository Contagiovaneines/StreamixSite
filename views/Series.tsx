import React, { useState, useEffect, useMemo } from 'react';
import { Category, Series as SeriesType, Season, Episode, Profile } from '../types';
import { mockApi } from '../services/mockApi';
import { Play, ChevronRight, LayoutList, Filter, Plus, Check } from 'lucide-react';
import { Modal } from '../components/Modal';
import { VideoPlayer } from '../components/VideoPlayer';

interface SeriesProps {
    profile?: Profile;
}

export const Series: React.FC<SeriesProps> = ({ profile }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [seriesList, setSeriesList] = useState<SeriesType[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<SeriesType | null>(null);
  const [inList, setInList] = useState(false);
  
  // Filter State
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  
  // Details State
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Record<string, Episode[]>>({});
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [resumeTime, setResumeTime] = useState(0);

  useEffect(() => {
    mockApi.getSeriesCategories().then(cats => {
        setCategories(cats);
        if(cats.length) setSelectedCategory(cats[0].category_id);
    });
  }, []);

  useEffect(() => {
    if(selectedCategory) {
        mockApi.getSeries(selectedCategory).then(series => {
             // Filter based on age rating
             let filtered = series;
             if (profile?.isKid) {
                 const restrictedRatings = ["16", "18", "TV-MA", "R"];
                 filtered = series.filter(s => {
                     const rating = s.ageRating || "L";
                     return !restrictedRatings.includes(rating);
                 });
             }
             setSeriesList(filtered);

             // Extract Genres
             const genres = new Set<string>();
             filtered.forEach(s => {
                 if(s.genre) genres.add(s.genre);
             });
             setAvailableGenres(Array.from(genres).sort());
        });
    }
  }, [selectedCategory, profile]);

  useEffect(() => {
    if (selectedSeries) {
      if (profile) {
          setInList(mockApi.isInMyList(profile.id, selectedSeries.series_id));
      }
      mockApi.getSeriesInfo(selectedSeries.series_id).then(data => {
        setSeasons(data.seasons);
        setEpisodes(data.episodes);
        if(data.seasons.length > 0) setActiveSeason(data.seasons[0].season_number);
      });
    }
  }, [selectedSeries, profile]);

  const handleClose = () => {
    setSelectedSeries(null);
    setSelectedEpisode(null);
    setSeasons([]);
    setResumeTime(0);
  };

  const handleToggleList = () => {
      if (!profile || !selectedSeries) return;

      if (inList) {
          mockApi.removeFromMyList(profile.id, selectedSeries.series_id);
          setInList(false);
      } else {
          mockApi.addToMyList({
              contentId: selectedSeries.series_id,
              profileId: profile.id,
              type: 'series',
              addedAt: Date.now(),
              meta: {
                  name: selectedSeries.name,
                  image: selectedSeries.cover,
                  backdrop: selectedSeries.backdrop_path?.[0],
                  rating: selectedSeries.rating,
                  ageRating: selectedSeries.ageRating,
                  year: selectedSeries.releaseDate,
                  genre: selectedSeries.genre,
                  plot: selectedSeries.plot
              }
          });
          setInList(true);
      }
  };

  const filteredSeriesList = useMemo(() => {
      return seriesList.filter(s => {
          const genreMatch = selectedGenre === 'All' || s.genre === selectedGenre;
          const yearMatch = selectedYear === 'All' || s.releaseDate === selectedYear;
          return genreMatch && yearMatch;
      });
  }, [seriesList, selectedGenre, selectedYear]);

  const handlePlayEpisode = (episode: Episode) => {
      if (profile) {
          // Check for progress on this specific episode ID
          const progress = mockApi.getWatchProgress(profile.id).find(p => p.contentId === episode.id);
          if (progress) {
              setResumeTime(progress.timestamp);
          } else {
              setResumeTime(0);
          }
      }
      setSelectedEpisode(episode);
  };

  const onVideoProgress = (progress: { currentTime: number; duration: number; percentage: number }) => {
      if (profile && selectedSeries && selectedEpisode) {
          if (progress.currentTime > 5) {
              mockApi.saveWatchProgress({
                  contentId: selectedEpisode.id, // Save by Episode ID
                  profileId: profile.id,
                  type: 'series',
                  progress: progress.percentage,
                  timestamp: progress.currentTime,
                  duration: progress.duration,
                  lastWatched: Date.now(),
                  meta: {
                      name: selectedSeries.name,
                      image: selectedSeries.cover,
                      subTitle: `S${activeSeason}:E${selectedEpisode.episode_num} - ${selectedEpisode.title}`,
                      source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                      backdrop: selectedSeries.backdrop_path?.[0],
                      year: selectedSeries.releaseDate,
                      rating: selectedSeries.rating,
                      ageRating: selectedSeries.ageRating
                  }
              });
          }
      }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
        {/* Categories & Filters */}
        <div className="p-6 pb-2 space-y-4">
            <h1 className="text-2xl font-bold text-white">TV Series</h1>
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
                    {categories.map(cat => (
                        <button
                            key={cat.category_id}
                            onClick={() => setSelectedCategory(cat.category_id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === cat.category_id 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {cat.category_name}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                     <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-1.5 min-w-[120px]">
                         <Filter size={14} className="text-gray-400" />
                         <select 
                            value={selectedGenre} 
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="bg-transparent text-sm text-gray-300 outline-none border-none cursor-pointer w-full"
                         >
                             <option value="All">Genre</option>
                             {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
                         </select>
                     </div>
                     <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-1.5">
                         <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-transparent text-sm text-gray-300 outline-none border-none cursor-pointer"
                         >
                             <option value="All">Year</option>
                             <option value="2023">2023</option>
                             <option value="2022">2022</option>
                             <option value="2021">2021</option>
                         </select>
                     </div>
                </div>
            </div>
        </div>

        {/* Series Grid */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
            {filteredSeriesList.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    No series found matching your filters.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredSeriesList.map(item => (
                        <div 
                            key={item.series_id} 
                            onClick={() => setSelectedSeries(item)}
                            className="cursor-pointer group"
                        >
                            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 mb-2 relative shadow-lg">
                                <img src={item.cover} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <LayoutList className="text-white" size={32} />
                                </div>
                                {item.ageRating && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className={`text-[10px] font-bold px-1 py-0.5 rounded border bg-black/50 ${
                                            item.ageRating === '18' ? 'border-red-600 text-red-500' :
                                            item.ageRating === '16' ? 'border-red-600 text-red-500' :
                                            'border-green-500 text-green-500'
                                        }`}>
                                            {item.ageRating}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-slate-200 font-medium truncate text-sm">{item.name}</h3>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>{item.genre}</span>
                                <span>{item.releaseDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Details Modal */}
        <Modal isOpen={!!selectedSeries} onClose={handleClose} fullScreen={!!selectedEpisode}>
            {selectedSeries && !selectedEpisode && (
                <div className="flex flex-col h-[80vh]">
                    {/* Header Info */}
                    <div className="relative h-64 flex-shrink-0">
                         <div className="absolute inset-0">
                             <img src={selectedSeries.backdrop_path[0] || selectedSeries.cover} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                         </div>
                         <div className="absolute bottom-0 left-0 p-8 w-full">
                             <div className="flex justify-between items-end">
                                 <div>
                                     <h2 className="text-3xl font-bold text-white">{selectedSeries.name}</h2>
                                     <p className="text-slate-300 line-clamp-2 max-w-2xl mt-2">{selectedSeries.plot}</p>
                                     {selectedSeries.ageRating && (
                                         <div className="mt-2">
                                             <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                                 selectedSeries.ageRating === '18' ? 'border-red-600 text-red-500' : 'border-gray-500 text-gray-400'
                                             }`}>{selectedSeries.ageRating}</span>
                                         </div>
                                     )}
                                 </div>
                                 <button 
                                    onClick={handleToggleList}
                                    className="px-6 py-3 bg-gray-600/40 hover:bg-gray-600/60 text-white rounded font-bold flex items-center gap-2 transition-colors"
                                >
                                    {inList ? <Check size={20} /> : <Plus size={20} />}
                                    {inList ? 'Na Lista' : 'Minha Lista'}
                                </button>
                             </div>
                         </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Seasons List Sidebar */}
                        <div className="w-64 bg-slate-950/50 border-r border-slate-800 overflow-y-auto p-4">
                            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider">Seasons</h3>
                            <div className="space-y-2">
                                {seasons.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSeason(s.season_number)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                                            activeSeason === s.season_number ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                    >
                                        <span>Season {s.season_number}</span>
                                        <ChevronRight size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Episodes List */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
                             <h3 className="text-white font-bold mb-4">Episodes - Season {activeSeason}</h3>
                             <div className="space-y-3">
                                {episodes[activeSeason]?.map(ep => (
                                    <div key={ep.id} className="group flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-600">
                                        <div className="relative w-32 aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={ep.info.movie_image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                                            <button 
                                                onClick={() => handlePlayEpisode(ep)}
                                                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent"
                                            >
                                                <Play size={24} className="text-white drop-shadow-lg" fill="white" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-white font-medium mb-1">E{ep.episode_num} - {ep.title}</h4>
                                                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{ep.info.duration}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-2">{ep.info.plot}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedEpisode && (
                <div className="w-full h-full bg-black">
                     <VideoPlayer 
                        key={selectedEpisode.id} // Force reset for episode change
                        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                        title={`S${activeSeason}:E${selectedEpisode.episode_num} - ${selectedEpisode.title}`}
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