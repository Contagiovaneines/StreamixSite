

import { Category, LiveStream, VodStream, Series, LoginResponse, Episode, WatchProgress, MyListItem } from '../types';

// Mock Data
const MOCK_CATEGORIES_LIVE: Category[] = [
  { category_id: "1", category_name: "Esportes Premium", parent_id: 0 },
  { category_id: "2", category_name: "Notícias Globais", parent_id: 0 },
  { category_id: "3", category_name: "Entretenimento", parent_id: 0 },
  { category_id: "4", category_name: "Infantil", parent_id: 0 },
  { category_id: "5", category_name: "Documentários", parent_id: 0 },
];

const MOCK_CATEGORIES_VOD: Category[] = [
  { category_id: "1", category_name: "Ação e Aventura", parent_id: 0 },
  { category_id: "2", category_name: "Comédia", parent_id: 0 },
  { category_id: "3", category_name: "Ficção Científica", parent_id: 0 },
  { category_id: "4", category_name: "Terror", parent_id: 0 },
];

const MOCK_CATEGORIES_SERIES: Category[] = [
  { category_id: "1", category_name: "Originais Netflix", parent_id: 0 },
  { category_id: "2", category_name: "Sucessos HBO", parent_id: 0 },
  { category_id: "3", category_name: "Animes", parent_id: 0 },
];

const VIDEO_URL = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// Helper to assign random age ratings
const getRandomAgeRating = (index: number) => {
    const ratings = ["L", "10", "12", "14", "16", "18"];
    // Deterministic random based on index
    return ratings[index % ratings.length];
};

export const mockApi = {
  login: async (u: string, p: string, url: string): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user_info: {
            username: u,
            status: "Active",
            exp_date: "1735689600",
            max_connections: "2"
          },
          server_info: {
            url: "http://mock-server.com",
            port: "8080",
            server_protocol: "http"
          }
        });
      }, 1000);
    });
  },

  getLiveCategories: async (): Promise<Category[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CATEGORIES_LIVE), 300));
  },

  getVodCategories: async (): Promise<Category[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CATEGORIES_VOD), 300));
  },

  getSeriesCategories: async (): Promise<Category[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_CATEGORIES_SERIES), 300));
  },

  getLiveStreams: async (catId: string): Promise<LiveStream[]> => {
    return new Promise(resolve => {
      const streams: LiveStream[] = Array.from({ length: 15 }).map((_, i) => ({
        num: i,
        name: `Canal ${catId}-${i + 1} HD`,
        stream_type: "live",
        stream_id: parseInt(`${catId}${i}`),
        stream_icon: `https://picsum.photos/seed/live${catId}${i}/200/200`,
        epg_channel_id: `ch${i}`,
        added: "123456789",
        category_id: catId,
        tv_archive: 0,
        direct_source: VIDEO_URL
      }));
      setTimeout(() => resolve(streams), 400);
    });
  },

  getVodStreams: async (catId: string): Promise<VodStream[]> => {
    return new Promise(resolve => {
      const streams: VodStream[] = Array.from({ length: 12 }).map((_, i) => ({
        num: i,
        name: i === 0 ? "Aventura Épica" : `Filme Título ${catId}-${i + 1}`,
        stream_type: "movie",
        stream_id: parseInt(`${catId}${i}`),
        stream_icon: `https://picsum.photos/seed/vod${catId}${i}/300/450`,
        rating: "8.5",
        rating_5based: 4.2,
        ageRating: i === 0 ? "14" : getRandomAgeRating(i + parseInt(catId)),
        added: "123456789",
        category_id: catId,
        container_extension: "mp4",
        direct_source: VIDEO_URL,
        backdrop_path: [`https://picsum.photos/seed/vodback${catId}${i}/1920/1080`],
        year: "2024",
        duration: "148 min",
        plot: "Uma jornada emocionante através de terras desconhecidas enfrentando perigos inimagináveis para salvar o futuro da humanidade.",
        director: "Christopher Nolan",
        genre: "Ação"
      }));
      setTimeout(() => resolve(streams), 400);
    });
  },

  getSeries: async (catId: string): Promise<Series[]> => {
    return new Promise(resolve => {
      const series: Series[] = Array.from({ length: 8 }).map((_, i) => ({
        num: i,
        name: `Série Título ${catId}-${i + 1}`,
        series_id: parseInt(`${catId}${i}`),
        cover: `https://picsum.photos/seed/series${catId}${i}/300/450`,
        plot: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        cast: "Ator Um, Ator Dois",
        director: "Diretor Famoso",
        genre: "Drama",
        releaseDate: "2023",
        rating: "9.0",
        rating_5based: 4.5,
        ageRating: getRandomAgeRating(i + parseInt(catId)),
        backdrop_path: [`https://picsum.photos/seed/backdrop${catId}${i}/1280/720`],
        youtube_trailer: "",
        episode_run_time: "45",
        category_id: catId
      }));
      setTimeout(() => resolve(series), 400);
    });
  },

  getSeriesInfo: async (seriesId: number): Promise<{ seasons: any[], episodes: any }> => {
    return new Promise(resolve => {
       setTimeout(() => resolve({
         seasons: [
           { season_number: 1, name: "Temporada 1", episode_count: 5, cover: `https://picsum.photos/seed/s${seriesId}s1/300/450` },
           { season_number: 2, name: "Temporada 2", episode_count: 3, cover: `https://picsum.photos/seed/s${seriesId}s2/300/450` }
         ],
         episodes: {
           "1": Array.from({length: 5}).map((_, i) => ({
             id: `${seriesId}_s1_e${i+1}`,
             episode_num: i+1,
             title: `Episódio ${i+1}: O Início`,
             container_extension: "mp4",
             info: { plot: "Uma descrição emocionante do episódio.", duration: "45:00", movie_image: `https://picsum.photos/seed/ep${seriesId}${i}/300/170` }
           })),
           "2": Array.from({length: 3}).map((_, i) => ({
             id: `${seriesId}_s2_e${i+1}`,
             episode_num: i+1,
             title: `Episódio ${i+1}: O Retorno`,
             container_extension: "mp4",
             info: { plot: "A história continua na temporada 2.", duration: "42:00", movie_image: `https://picsum.photos/seed/ep2${seriesId}${i}/300/170` }
           }))
         }
       }), 500);
    });
  },

  // --- Watch Progress Methods ---

  getWatchProgress: (profileId: number): WatchProgress[] => {
    try {
        const key = `streamix_progress_${profileId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error fetching progress", e);
        return [];
    }
  },

  saveWatchProgress: (progress: WatchProgress) => {
    try {
        const key = `streamix_progress_${progress.profileId}`;
        const currentData = mockApi.getWatchProgress(progress.profileId);
        
        // Remove existing entry for this content if it exists
        const filtered = currentData.filter(item => item.contentId !== progress.contentId);
        
        // Add updated progress to the beginning of the list
        const updated = [progress, ...filtered];
        
        // Limit history size (optional, e.g., 20 items)
        const limited = updated.slice(0, 20);
        
        localStorage.setItem(key, JSON.stringify(limited));
    } catch (e) {
        console.error("Error saving progress", e);
    }
  },

  // --- My List Methods ---

  getMyList: (profileId: number): MyListItem[] => {
    try {
        const key = `streamix_mylist_${profileId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error fetching my list", e);
        return [];
    }
  },

  addToMyList: (item: MyListItem) => {
    try {
        const key = `streamix_mylist_${item.profileId}`;
        const currentData = mockApi.getMyList(item.profileId);
        if (!currentData.find(i => i.contentId === item.contentId)) {
            const updated = [item, ...currentData];
            localStorage.setItem(key, JSON.stringify(updated));
        }
    } catch (e) { console.error(e); }
  },

  removeFromMyList: (profileId: number, contentId: string | number) => {
     try {
        const key = `streamix_mylist_${profileId}`;
        const currentData = mockApi.getMyList(profileId);
        const updated = currentData.filter(i => i.contentId !== contentId);
        localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) { console.error(e); }
  },

  isInMyList: (profileId: number, contentId: string | number): boolean => {
      const list = mockApi.getMyList(profileId);
      return !!list.find(i => i.contentId === contentId);
  }
};