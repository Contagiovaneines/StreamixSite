

export enum ContentType {
  HOME = 'home',
  LIVE = 'live',
  MOVIE = 'movie',
  SERIES = 'series',
  CATCHUP = 'catchup',
  MY_LIST = 'my_list'
}

export interface Profile {
  id: number;
  name: string;
  avatar: string;
  isKid: boolean;
  locked?: boolean;
  pin?: string;
}

export interface LoginResponse {
  user_info: {
    username: string;
    status: string;
    exp_date: string;
    max_connections: string;
  };
  server_info: {
    url: string;
    port: string;
    server_protocol: string;
  };
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  tv_archive: number;
  direct_source: string;
}

export interface VodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  ageRating?: string; // e.g., "L", "10", "12", "14", "16", "18"
  added: string;
  category_id: string;
  container_extension: string;
  direct_source: string;
  backdrop_path?: string[];
  year?: string;
  duration?: string;
  plot?: string;
  director?: string;
  genre?: string;
}

export interface Series {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  rating: string;
  rating_5based: number;
  ageRating?: string; // e.g., "L", "10", "12", "14", "16", "18"
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

export interface Episode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    plot: string;
    duration: string;
    movie_image: string;
  };
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  season_number: number;
  vote_average: number;
  cover: string;
}

export interface WatchProgress {
  contentId: string | number;
  profileId: number;
  type: 'movie' | 'series';
  progress: number; // Percentage 0-100
  timestamp: number; // Seconds
  duration: number; // Seconds
  lastWatched: number; // Unix timestamp
  meta: {
    name: string;
    image: string;
    subTitle?: string; // e.g. "S1:E2"
    source: string;
    backdrop?: string;
    year?: string;
    rating?: string;
    ageRating?: string;
  };
}

export interface MyListItem {
  contentId: string | number;
  profileId: number;
  type: 'movie' | 'series';
  addedAt: number;
  meta: {
    name: string;
    image: string;
    backdrop?: string;
    rating?: string;
    ageRating?: string;
    year?: string;
    genre?: string;
    source?: string; // For movies mostly
    plot?: string;
  }
}

export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  type: 'new' | 'suggestion' | 'reminder';
  read: boolean;
}