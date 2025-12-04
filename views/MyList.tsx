import React, { useState, useEffect } from 'react';
import { Profile, MyListItem, VodStream } from '../types';
import { mockApi } from '../services/mockApi';
import { Modal } from '../components/Modal';
import { VideoPlayer } from '../components/VideoPlayer';
import { Play, Trash2, Bookmark } from 'lucide-react';

interface MyListProps {
  profile?: Profile;
}

export const MyList: React.FC<MyListProps> = ({ profile }) => {
  const [list, setList] = useState<MyListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MyListItem | null>(null);
  const [playItem, setPlayItem] = useState(false);
  const [resumeTime, setResumeTime] = useState(0);

  useEffect(() => {
    if (profile) {
      setList(mockApi.getMyList(profile.id));
    }
  }, [profile]);

  const handleRemove = (e: React.MouseEvent, item: MyListItem) => {
    e.stopPropagation();
    if (profile) {
        mockApi.removeFromMyList(profile.id, item.contentId);
        setList(prev => prev.filter(i => i.contentId !== item.contentId));
    }
  };

  const handlePlay = () => {
      if (profile && selectedItem) {
          const progress = mockApi.getWatchProgress(profile.id).find(p => p.contentId === selectedItem.contentId);
          if (progress) {
              setResumeTime(progress.timestamp);
          } else {
              setResumeTime(0);
          }
      }
      setPlayItem(true);
  };

  const handleCloseModal = () => {
      setSelectedItem(null);
      setPlayItem(false);
      setResumeTime(0);
  };

  const onVideoProgress = (progress: { currentTime: number; duration: number; percentage: number }) => {
      if (profile && selectedItem) {
          if (progress.currentTime > 5) {
              mockApi.saveWatchProgress({
                  contentId: selectedItem.contentId,
                  profileId: profile.id,
                  type: selectedItem.type,
                  progress: progress.percentage,
                  timestamp: progress.currentTime,
                  duration: progress.duration,
                  lastWatched: Date.now(),
                  meta: {
                      name: selectedItem.meta.name,
                      image: selectedItem.meta.image,
                      source: selectedItem.meta.source || '',
                      backdrop: selectedItem.meta.backdrop,
                      year: selectedItem.meta.year,
                      rating: selectedItem.meta.rating,
                      ageRating: selectedItem.meta.ageRating
                  }
              });
          }
      }
  };

  return (
    <div className="h-full bg-black flex flex-col overflow-y-auto custom-scrollbar p-6">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Bookmark className="text-blue-600" /> Minha Lista
      </h1>

      {list.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
              <Bookmark size={64} className="mb-4" />
              <p className="text-xl">Sua lista está vazia</p>
              <p className="text-sm mt-2">Adicione filmes e séries para assistir mais tarde.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {list.map(item => (
                  <div 
                      key={item.contentId} 
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer group relative"
                  >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 mb-2 relative shadow-lg ring-1 ring-white/5 transition-all duration-300 group-hover:scale-105 group-hover:ring-blue-600">
                          <img src={item.meta.image} className="w-full h-full object-cover" />
                          
                          {/* Remove Button Overlay */}
                          <button 
                            onClick={(e) => handleRemove(e, item)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-20"
                            title="Remover da lista"
                          >
                              <Trash2 size={14} />
                          </button>

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="text-white drop-shadow-lg" size={32} fill="white" />
                          </div>
                          
                          {item.meta.ageRating && (
                              <div className="absolute top-2 left-2">
                                  <span className={`text-[10px] font-bold px-1 py-0.5 rounded border bg-black/50 ${
                                      item.meta.ageRating === '18' ? 'border-red-600 text-red-500' :
                                      item.meta.ageRating === '16' ? 'border-red-600 text-red-500' :
                                      'border-green-500 text-green-500'
                                  }`}>
                                      {item.meta.ageRating}
                                  </span>
                              </div>
                          )}
                      </div>
                      <h3 className="text-slate-200 font-medium truncate text-sm">{item.meta.name}</h3>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>{item.type === 'movie' ? 'Filme' : 'Série'}</span>
                          <span>{item.meta.year}</span>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={!!selectedItem} onClose={handleCloseModal} fullScreen={playItem}>
          {selectedItem && !playItem && (
             <div className="flex flex-col md:flex-row h-full bg-[#141414]">
                 <div className="absolute inset-0 z-0">
                     <img src={selectedItem.meta.backdrop || selectedItem.meta.image} className="w-full h-full object-cover opacity-20" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent" />
                 </div>

                 <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto mt-10">
                     <div className="w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl shadow-black mx-auto md:mx-0 ring-1 ring-white/10">
                         <img src={selectedItem.meta.image} className="w-full h-auto object-cover" />
                     </div>
                     
                     <div className="flex-1 space-y-6">
                         <div>
                             <h2 className="text-4xl font-bold text-white mb-2">{selectedItem.meta.name}</h2>
                             <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                                 <span>{selectedItem.meta.year}</span>
                                 <span className="border border-gray-600 px-1 rounded text-xs">HD</span>
                                 {selectedItem.meta.genre && <span>{selectedItem.meta.genre}</span>}
                             </div>
                         </div>

                         <p className="text-white text-lg leading-relaxed max-w-2xl">
                             {selectedItem.meta.plot || "Descrição indisponível."}
                         </p>

                         <div className="flex flex-wrap gap-4 pt-4">
                             <button 
                                 onClick={handlePlay}
                                 className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded font-bold flex items-center gap-2 transition-colors"
                             >
                                 <Play size={20} fill="currentColor" /> Assistir
                             </button>
                             <button 
                                onClick={(e) => {
                                    handleRemove(e, selectedItem);
                                    handleCloseModal();
                                }}
                                className="px-8 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded font-bold flex items-center gap-2 transition-colors"
                             >
                                 <Trash2 size={20} /> Remover
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
          )}

          {playItem && selectedItem && (
             <div className="w-full h-full bg-black">
                  <VideoPlayer 
                     key={selectedItem.contentId}
                     src={selectedItem.meta.source || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} 
                     title={selectedItem.meta.name}
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