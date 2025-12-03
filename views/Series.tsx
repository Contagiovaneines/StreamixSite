import React, { useState, useEffect } from 'react';
import { Category, Series as SeriesType, Season, Episode } from '../types';
import { mockApi } from '../services/mockApi';
import { Play, ChevronRight, LayoutList } from 'lucide-react';
import { Modal } from '../components/Modal';
import { VideoPlayer } from '../components/VideoPlayer';

export const Series: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [seriesList, setSeriesList] = useState<SeriesType[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<SeriesType | null>(null);
  
  // Details State
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Record<string, Episode[]>>({});
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    mockApi.getSeriesCategories().then(cats => {
        setCategories(cats);
        if(cats.length) setSelectedCategory(cats[0].category_id);
    });
  }, []);

  useEffect(() => {
    if(selectedCategory) {
        mockApi.getSeries(selectedCategory).then(setSeriesList);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSeries) {
      mockApi.getSeriesInfo(selectedSeries.series_id).then(data => {
        setSeasons(data.seasons);
        setEpisodes(data.episodes);
        if(data.seasons.length > 0) setActiveSeason(data.seasons[0].season_number);
      });
    }
  }, [selectedSeries]);

  const handleClose = () => {
    setSelectedSeries(null);
    setSelectedEpisode(null);
    setSeasons([]);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
        {/* Categories */}
        <div className="p-6 pb-2">
            <h1 className="text-2xl font-bold text-white mb-4">TV Series</h1>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
        </div>

        {/* Series Grid */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {seriesList.map(item => (
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
                        </div>
                        <h3 className="text-slate-200 font-medium truncate text-sm">{item.name}</h3>
                        <p className="text-xs text-slate-500">{item.genre}</p>
                    </div>
                ))}
            </div>
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
                         <div className="absolute bottom-0 left-0 p-8">
                             <h2 className="text-3xl font-bold text-white">{selectedSeries.name}</h2>
                             <p className="text-slate-300 line-clamp-2 max-w-2xl mt-2">{selectedSeries.plot}</p>
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
                                                onClick={() => setSelectedEpisode(ep)}
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
                <div className="w-full h-[90vh] bg-black">
                     <VideoPlayer 
                        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                        title={`S${activeSeason}:E${selectedEpisode.episode_num} - ${selectedEpisode.title}`}
                        autoPlay={true}
                    />
                </div>
            )}
        </Modal>
    </div>
  );
};
